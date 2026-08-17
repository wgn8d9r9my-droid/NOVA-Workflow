import Link from "next/link";
import { CheckSquare, Square } from "lucide-react";
import { WidgetCard } from "@/components/home/widget-card";
import type { Goal } from "@/types/entities";

export function GoalsCard({
  rows,
}: {
  rows: { goal: Goal; progress: number }[];
}) {
  return (
    <WidgetCard title="Objectifs annuels" href="/goals" empty={rows.length === 0}>
      <div className="flex flex-col gap-2.5">
        {rows.map(({ goal, progress }) => (
          <Link
            key={goal.id}
            href="/goals"
            className="flex items-center gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
          >
            {progress >= 100 ? (
              <CheckSquare className="size-4 shrink-0 text-primary" />
            ) : (
              <Square className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span className="min-w-0 flex-1 truncate text-[13px]">{goal.title}</span>
            <div className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
              {progress}%
            </span>
          </Link>
        ))}
      </div>
    </WidgetCard>
  );
}
