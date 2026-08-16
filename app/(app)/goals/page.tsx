"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalFormDialog } from "@/components/goals/goal-form-dialog";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalDetailSheet } from "@/components/goals/goal-detail-sheet";
import { useGoalsStore } from "@/lib/store/goals";

const PERIOD_LABEL: Record<string, string> = {
  year: "Annuel",
  quarter: "Trimestriel",
  custom: "Personnalisé",
};

export default function GoalsPage() {
  const goals = useGoalsStore((s) => s.items);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const grouped = goals.reduce<Record<string, typeof goals>>((acc, g) => {
    (acc[g.period] ??= []).push(g);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
        <GoalFormDialog
          trigger={
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" /> Nouvel objectif
            </Button>
          }
        />
      </div>

      {goals.length === 0 ? (
        <p className="px-1 py-12 text-center text-sm text-muted-foreground">
          Aucun objectif encore — définis le premier avec le bouton ci-dessus.
        </p>
      ) : (
        Object.entries(grouped).map(([period, items]) => (
          <div key={period}>
            <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">
              {PERIOD_LABEL[period] ?? period}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onClick={() => setSelectedGoalId(goal.id)} />
              ))}
            </div>
          </div>
        ))
      )}

      <GoalDetailSheet goalId={selectedGoalId} onOpenChange={(v) => !v && setSelectedGoalId(null)} />
    </div>
  );
}
