import { format, addDays, isBefore, startOfToday, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import type { Task, Project, Goal, Milestone, Transaction, Habit, HabitEntry } from "@/types/entities";
import { formatEUR, summary as financeSummary, inMonth } from "@/lib/finance-derived";
import { currentStreak } from "@/lib/habit-derived";
import { projectStatusMeta } from "@/lib/project-status";

export interface NovaContext {
  tasks: Task[];
  projects: Project[];
  goals: Goal[];
  milestones: Milestone[];
  transactions: Transaction[];
  habits: Habit[];
  habitEntries: HabitEntry[];
  addTask: (task: { title: string; due_date?: string }) => void;
}

export interface NovaReply {
  text: string;
}

function todayKey() {
  return format(new Date(), "yyyy-MM-dd");
}

function tomorrowKey() {
  return format(addDays(new Date(), 1), "yyyy-MM-dd");
}

export function askNova(input: string, ctx: NovaContext): NovaReply {
  const trimmed = input.trim();
  const q = trimmed.toLowerCase();

  // --- Action: create a task ------------------------------------------------
  const addMatch = trimmed.match(/^(?:ajoute|cr[ée]e|nouvelle t[âa]che)\s*:?\s*(.+)/i);
  if (addMatch) {
    let title = addMatch[1].trim();
    let due_date: string | undefined;
    if (/demain/i.test(title)) {
      due_date = tomorrowKey();
      title = title.replace(/pour\s+demain|demain/gi, "").trim();
    } else if (/aujourd'?hui/i.test(title)) {
      due_date = todayKey();
      title = title.replace(/pour\s+aujourd'?hui|aujourd'?hui/gi, "").trim();
    }
    title = title.replace(/^(une\s+)?t[âa]che\s+(pour\s+)?/i, "").trim();
    if (title.length > 0) {
      const capitalized = title[0].toUpperCase() + title.slice(1);
      ctx.addTask({ title: capitalized, due_date });
      return {
        text: `Ajouté : « ${capitalized} »${due_date === todayKey() ? " pour aujourd'hui" : due_date === tomorrowKey() ? " pour demain" : ""}.`,
      };
    }
  }

  // --- Today's tasks ----------------------------------------------------
  if (/aujourd'?hui|today/.test(q) && /(fait|faire|t[âa]che|programm)/.test(q)) {
    const today = todayKey();
    const items = ctx.tasks.filter((t) => t.due_date === today && t.status === "todo");
    if (items.length === 0) return { text: "Rien de programmé aujourd'hui. Bon moment pour avancer sur tes projets actifs." };
    const list = items
      .sort((a, b) => a.priority.localeCompare(b.priority))
      .map((t) => `• [${t.priority}] ${t.title}${t.due_time ? ` à ${t.due_time}` : ""}`)
      .join("\n");
    return { text: `Voici ta journée :\n${list}` };
  }

  // --- Urgent / late projects --------------------------------------------
  if (/urgent|retard|deadline|échéance/.test(q) && /projet/.test(q)) {
    const today = startOfToday();
    const overdueTasks = ctx.tasks.filter(
      (t) => t.status === "todo" && t.due_date && isBefore(new Date(t.due_date), today)
    );
    const soon = ctx.projects
      .filter((p) => p.status === "active" && p.deadline)
      .filter((p) => new Date(p.deadline!) >= today)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 3);

    const parts: string[] = [];
    if (overdueTasks.length > 0) {
      parts.push(`${overdueTasks.length} tâche${overdueTasks.length > 1 ? "s" : ""} en retard.`);
    }
    if (soon.length > 0) {
      parts.push(
        "Prochaines échéances :\n" +
          soon.map((p) => `• ${p.name} — ${format(new Date(p.deadline!), "d MMM", { locale: fr })}`).join("\n")
      );
    }
    if (parts.length === 0) parts.push("Aucun projet urgent en ce moment — tu es à jour.");
    return { text: parts.join("\n\n") };
  }

  // --- Finances -----------------------------------------------------------
  if (/d[ée]pens|revenu|finance|argent|solde/.test(q)) {
    const now = new Date();
    const monthly = inMonth(ctx.transactions, now.getFullYear(), now.getMonth());
    const { income, expense, balance } = financeSummary(monthly);
    return {
      text: `Ce mois-ci : ${formatEUR(income)} de revenus, ${formatEUR(expense)} de dépenses, soit un solde de ${formatEUR(balance)}.`,
    };
  }

  // --- Weekly summary -------------------------------------------------------
  if (/bilan|r[ée]sum[ée]/.test(q) && /semaine/.test(q)) {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const doneThisWeek = ctx.tasks.filter(
      (t) => t.status === "done" && t.completed_at && new Date(t.completed_at) >= weekStart
    );
    const monthly = inMonth(ctx.transactions, new Date().getFullYear(), new Date().getMonth());
    const { balance } = financeSummary(monthly);
    const activeHabits = ctx.habits.map((h) => ({ h, streak: currentStreak(ctx.habitEntries, h.id) }));
    const bestHabit = activeHabits.sort((a, b) => b.streak - a.streak)[0];

    const lines = [`${doneThisWeek.length} tâche${doneThisWeek.length > 1 ? "s" : ""} terminée${doneThisWeek.length > 1 ? "s" : ""} cette semaine.`];
    lines.push(`Solde du mois : ${formatEUR(balance)}.`);
    if (bestHabit && bestHabit.streak > 0) {
      lines.push(`${bestHabit.h.name} tient bon avec un streak de ${bestHabit.streak} jour${bestHabit.streak > 1 ? "s" : ""}.`);
    }
    return { text: lines.join("\n") };
  }

  // --- Neglected goals ------------------------------------------------------
  if (/objectif/.test(q) && /(n[ée]glig|avanc|stagn)/.test(q)) {
    const neglected = ctx.goals.filter((g) => {
      const gm = ctx.milestones.filter((m) => m.goal_id === g.id);
      return gm.length === 0 || gm.every((m) => !m.done);
    });
    if (neglected.length === 0) return { text: "Tous tes objectifs ont un jalon récent — bien joué." };
    return {
      text: `À reprendre :\n${neglected.map((g) => `• ${g.title}`).join("\n")}`,
    };
  }

  // --- Project status overview ----------------------------------------------
  if (/projet/.test(q) && /(combien|liste|statut|status)/.test(q)) {
    const active = ctx.projects.filter((p) => p.status === "active");
    if (active.length === 0) return { text: "Aucun projet actif pour l'instant." };
    return {
      text: `${active.length} projet${active.length > 1 ? "s" : ""} actif${active.length > 1 ? "s" : ""} :\n${active
        .map((p) => `• ${p.name} (${projectStatusMeta[p.status].label})`)
        .join("\n")}`,
    };
  }

  return {
    text: "Je peux te dire ce que tu as à faire aujourd'hui, faire le bilan de ta semaine, ton solde du mois, tes projets urgents, tes objectifs délaissés — ou ajouter une tâche si tu me dis « ajoute … ».",
  };
}
