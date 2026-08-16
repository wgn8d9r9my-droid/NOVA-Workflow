"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitDetailSheet } from "@/components/habits/habit-detail-sheet";
import { useHabitsStore } from "@/lib/store/habits";

export default function HabitsPage() {
  const habits = useHabitsStore((s) => s.items);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Habits</h1>
        <HabitFormDialog
          trigger={
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" /> Nouvelle habitude
            </Button>
          }
        />
      </div>

      {habits.length === 0 ? (
        <p className="px-1 py-12 text-center text-sm text-muted-foreground">
          Aucune habitude encore — ajoute la première avec le bouton ci-dessus.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <div key={habit.id} className="group">
              <HabitCard habit={habit} onOpenDetail={() => setSelectedHabitId(habit.id)} />
            </div>
          ))}
        </div>
      )}

      <HabitDetailSheet habitId={selectedHabitId} onOpenChange={(v) => !v && setSelectedHabitId(null)} />
    </div>
  );
}
