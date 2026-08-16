import {
  formatISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  addDays,
} from "date-fns";
import type { HabitEntry } from "@/types/entities";

export function toDateKey(date: Date) {
  return formatISO(date, { representation: "date" });
}

export function isDoneOn(entries: HabitEntry[], habitId: string, date: Date) {
  const key = toDateKey(date);
  return entries.some((e) => e.habit_id === habitId && e.date === key && e.done);
}

export function currentStreak(entries: HabitEntry[], habitId: string): number {
  let streak = 0;
  let cursor = new Date();
  if (!isDoneOn(entries, habitId, cursor)) {
    cursor = subDays(cursor, 1);
    if (!isDoneOn(entries, habitId, cursor)) return 0;
  }
  while (isDoneOn(entries, habitId, cursor)) {
    streak++;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

export function weekCount(entries: HabitEntry[], habitId: string): number {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return entries.filter((e) => e.habit_id === habitId && e.done && new Date(e.date) >= start).length;
}

/** Last `weeks` weeks of days, oldest first, for a contribution-style grid. */
export function lastDays(weeks: number): Date[] {
  const days: Date[] = [];
  const total = weeks * 7;
  for (let i = total - 1; i >= 0; i--) {
    days.push(subDays(new Date(), i));
  }
  return days;
}

/** Full calendar weeks (Mon→Sun) covering the given month, for a month grid. */
export function monthGrid(monthDate: Date): Date[] {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
  const days: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}
