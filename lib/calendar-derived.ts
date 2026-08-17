import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import type { Task } from "@/types/entities";

export const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 → 23:00

export function dateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function tasksForDate(tasks: Task[], date: Date) {
  const key = dateKey(date);
  return tasks.filter((t) => t.due_date === key);
}

/** The 7 days (Mon→Sun) of the week containing `date`. */
export function weekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Full calendar weeks (Mon→Sun) covering the month containing `date`. */
export function monthGrid(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  const days: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

/** "90" → "1h30", "45" → "45 min", "120" → "2h". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${m}` : `${h}h`;
}

/** "14:00" or, with a duration, "14:00–14:45". */
export function formatTimeRange(due_time?: string, duration_minutes?: number): string | undefined {
  if (!due_time) return undefined;
  if (!duration_minutes) return due_time;
  const [h, m] = due_time.split(":").map(Number);
  const end = new Date(2000, 0, 1, h, m + duration_minutes);
  const endLabel = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
  return `${due_time}–${endLabel}`;
}

export function splitByTime(tasks: Task[]) {
  const allDay = tasks.filter((t) => !t.due_time);
  const byHour = new Map<number, Task[]>();
  for (const t of tasks) {
    if (!t.due_time) continue;
    const hour = Number(t.due_time.split(":")[0]);
    const list = byHour.get(hour) ?? [];
    list.push(t);
    list.sort((a, b) => (a.due_time ?? "").localeCompare(b.due_time ?? ""));
    byHour.set(hour, list);
  }
  return { allDay, byHour };
}
