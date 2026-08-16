"use client";

import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { useMilestonesStore } from "@/lib/store/goals";
import { goalProgress } from "@/lib/derived";
import { cn } from "@/lib/utils";
import type { Goal } from "@/types/entities";

export function GoalCard({ goal, onClick }: { goal: Goal; onClick?: () => void }) {
  const allMilestones = useMilestonesStore((s) => s.items);
  const milestones = useMemo(
    () => allMilestones.filter((m) => m.goal_id === goal.id),
    [allMilestones, goal.id]
  );
  const progress = goalProgress(allMilestones, goal.id);

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-4 shadow-soft",
        onClick && "cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-float"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium">{goal.title}</h4>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="mt-3 h-1.5" />
      {milestones.length > 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          {milestones.filter((m) => m.done).length} / {milestones.length} jalons
        </p>
      )}
    </div>
  );
}
