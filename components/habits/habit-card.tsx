"use client";

import { useMemo } from "react";
import { Flame, Trash2 } from "lucide-react";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useHabitEntriesStore, useHabitsStore } from "@/lib/store/habits";
import { currentStreak, weekCount, lastDays, toDateKey, isDoneOn } from "@/lib/habit-derived";
import type { Habit } from "@/types/entities";

export function HabitCard({ habit, onOpenDetail }: { habit: Habit; onOpenDetail: () => void }) {
  const allEntries = useHabitEntriesStore((s) => s.items);
  const addEntry = useHabitEntriesStore((s) => s.add);
  const updateEntry = useHabitEntriesStore((s) => s.update);
  const removeHabit = useHabitsStore((s) => s.remove);

  const entries = useMemo(() => allEntries.filter((e) => e.habit_id === habit.id), [allEntries, habit.id]);
  const streak = useMemo(() => currentStreak(allEntries, habit.id), [allEntries, habit.id]);
  const week = useMemo(() => weekCount(allEntries, habit.id), [allEntries, habit.id]);
  const days = useMemo(() => lastDays(8), []);

  function toggleDay(date: Date) {
    if (date > new Date()) return;
    const key = toDateKey(date);
    const existing = entries.find((e) => e.date === key);
    if (existing) {
      updateEntry(existing.id, { done: !existing.done });
    } else {
      addEntry({ habit_id: habit.id, date: key, done: true, values: {} });
    }
  }

  const todayDone = isDoneOn(allEntries, habit.id, new Date());

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <button onClick={onOpenDetail} className="flex items-center gap-2 text-left">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: habit.color }} />
          <h4 className="text-sm font-medium hover:text-primary">{habit.name}</h4>
        </button>
        <button
          onClick={() => removeHabit(habit.id)}
          className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Flame className={cn("size-3.5", streak > 0 && "text-primary")} />
          {streak} jour{streak > 1 ? "s" : ""}
        </span>
        <span>
          {week} / {habit.target_frequency} cette semaine
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {days.map((day) => {
          const done = isDoneOn(allEntries, habit.id, day);
          return (
            <button
              key={day.toISOString()}
              title={format(day, "d MMMM", { locale: fr })}
              onClick={() => toggleDay(day)}
              className={cn(
                "size-3 rounded-[3px] transition-transform hover:scale-125",
                isToday(day) && "ring-1 ring-foreground/40"
              )}
              style={{ backgroundColor: done ? habit.color : "var(--muted)" }}
            />
          );
        })}
      </div>

      <button
        onClick={() => toggleDay(new Date())}
        className={cn(
          "mt-3 w-full rounded-xl border py-1.5 text-xs font-medium transition-colors",
          todayDone
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border/60 text-muted-foreground hover:bg-muted"
        )}
      >
        {todayDone ? "Fait aujourd'hui ✓" : "Marquer aujourd'hui"}
      </button>
    </Card>
  );
}
