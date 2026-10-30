import { addDays, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import type { Priority, TodoItem, TodoList } from "@/types/entities";

export const PRIORITY_LABEL: Record<Priority, string> = { P1: "Haute", P2: "Normale", P3: "Basse" };

export function dateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function todoColor(item: TodoItem, list?: TodoList) {
  return item.color ?? list?.color;
}

const hhmm = (t?: string) => (t ? t.slice(0, 5) : undefined);

export type DeadlineTone = "overdue" | "today" | "soon" | "normal";

export function deadlineInfo(item: TodoItem): { text: string; tone: DeadlineTone } | null {
  if (!item.due_date) return null;
  const now = new Date();
  const today = dateKey(now);
  const tomorrow = dateKey(addDays(now, 1));
  const time = hhmm(item.due_time);
  const date = parseISO(item.due_date);

  let text: string;
  let tone: DeadlineTone;
  if (item.due_date < today) {
    text = format(date, "d MMM", { locale: fr });
    tone = "overdue";
  } else if (item.due_date === today) {
    text = "Aujourd'hui";
    tone = time && time < format(now, "HH:mm") ? "overdue" : "today";
  } else if (item.due_date === tomorrow) {
    text = "Demain";
    tone = "soon";
  } else {
    text = format(date, "EEE d MMM", { locale: fr });
    tone = "normal";
  }
  return { text: time ? `${text} · ${time}` : text, tone };
}

export function sortTodos(a: TodoItem, b: TodoItem) {
  if (a.due_date !== b.due_date) {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return a.due_date.localeCompare(b.due_date);
  }
  const ta = hhmm(a.due_time) ?? "99:99";
  const tb = hhmm(b.due_time) ?? "99:99";
  if (ta !== tb) return ta.localeCompare(tb);
  if (a.priority !== b.priority) return a.priority.localeCompare(b.priority);
  return a.created_at.localeCompare(b.created_at);
}

export type SmartView = "all" | "today" | "upcoming" | "nodate" | "done";

export function matchesView(item: TodoItem, view: string) {
  const today = dateKey(new Date());
  switch (view) {
    case "all":
      return true;
    case "today":
      return !!item.due_date && item.due_date <= today;
    case "upcoming":
      return !!item.due_date && item.due_date > today;
    case "nodate":
      return !item.due_date;
    case "done":
      return true;
    default:
      return item.list_id === view;
  }
}

export interface TodoGroup {
  key: string;
  label: string;
  tone: DeadlineTone | "none";
  items: TodoItem[];
}

export function groupOpenTodos(open: TodoItem[]): TodoGroup[] {
  const now = new Date();
  const today = dateKey(now);
  const tomorrow = dateKey(addDays(now, 1));
  const weekEnd = dateKey(addDays(now, 7));

  const groups: TodoGroup[] = [
    { key: "overdue", label: "En retard", tone: "overdue", items: [] },
    { key: "today", label: "Aujourd'hui", tone: "today", items: [] },
    { key: "tomorrow", label: "Demain", tone: "soon", items: [] },
    { key: "week", label: "Cette semaine", tone: "normal", items: [] },
    { key: "later", label: "Plus tard", tone: "normal", items: [] },
    { key: "nodate", label: "Sans échéance", tone: "none", items: [] },
  ];
  const by = Object.fromEntries(groups.map((g) => [g.key, g]));

  for (const item of [...open].sort(sortTodos)) {
    if (!item.due_date) by.nodate.items.push(item);
    else if (item.due_date < today) by.overdue.items.push(item);
    else if (item.due_date === today) by.today.items.push(item);
    else if (item.due_date === tomorrow) by.tomorrow.items.push(item);
    else if (item.due_date <= weekEnd) by.week.items.push(item);
    else by.later.items.push(item);
  }
  return groups.filter((g) => g.items.length > 0);
}
