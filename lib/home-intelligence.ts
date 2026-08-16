import { differenceInCalendarDays, isBefore, startOfToday } from "date-fns";
import type { Task, Project, Goal, Milestone } from "@/types/entities";
import { AlertTriangle, Clock, Target, Sparkles, type LucideIcon } from "lucide-react";

export interface SpotlightContent {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
}

export function computeSpotlight(
  tasks: Task[],
  projects: Project[],
  goals: Goal[],
  milestones: Milestone[]
): SpotlightContent {
  const today = startOfToday();
  const openTasks = tasks.filter((t) => t.status === "todo");

  const overdue = openTasks.filter((t) => t.due_date && isBefore(new Date(t.due_date), today));
  if (overdue.length > 0) {
    return {
      icon: AlertTriangle,
      title: `${overdue.length} tâche${overdue.length > 1 ? "s" : ""} en retard`,
      description: "Quelques éléments ont dépassé leur échéance — un bon moment pour rattraper.",
      cta: "Voir le calendrier",
      href: "/calendar",
    };
  }

  const soonProjects = projects
    .filter((p) => p.status === "active" && p.deadline)
    .map((p) => ({ p, days: differenceInCalendarDays(new Date(p.deadline!), today) }))
    .filter((x) => x.days >= 0 && x.days <= 7)
    .sort((a, b) => a.days - b.days);

  if (soonProjects.length > 0) {
    const { p, days } = soonProjects[0];
    return {
      icon: Clock,
      title: `${p.name} approche`,
      description:
        days === 0
          ? "Échéance aujourd'hui."
          : `Échéance dans ${days} jour${days > 1 ? "s" : ""} — garde le cap.`,
      cta: "Voir le projet",
      href: `/projects/${p.id}`,
    };
  }

  const p1Today = openTasks.filter((t) => t.priority === "P1");
  if (p1Today.length >= 3) {
    return {
      icon: AlertTriangle,
      title: `${p1Today.length} priorités t'attendent`,
      description: "Ta journée est chargée en tâches essentielles.",
      cta: "Voir le calendrier",
      href: "/calendar",
    };
  }

  const neglectedGoal = goals.find((g) => {
    const gMilestones = milestones.filter((m) => m.goal_id === g.id);
    if (gMilestones.length === 0) return false;
    return gMilestones.every((m) => !m.done);
  });
  if (neglectedGoal) {
    return {
      icon: Target,
      title: `${neglectedGoal.title} n'a pas avancé`,
      description: "Aucun jalon complété pour le moment — reprends-y un instant.",
      cta: "Voir l'objectif",
      href: "/goals",
    };
  }

  return {
    icon: Sparkles,
    title: "Tout est sous contrôle",
    description: "Rien d'urgent aujourd'hui. Bon moment pour avancer sur ce qui compte vraiment.",
    cta: "Voir le calendrier",
    href: "/calendar",
  };
}
