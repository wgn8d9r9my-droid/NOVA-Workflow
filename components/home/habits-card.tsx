import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/home/widget-card";
import type { Habit } from "@/types/entities";

export function HabitsCard({
  rows,
}: {
  rows: { habit: Habit; days: boolean[]; count: number }[];
}) {
  return (
    <WidgetCard title="Habitudes" href="/habits" hrefLabel="Cette semaine" empty={rows.length === 0}>
      <div className="flex flex-col gap-3">
        {rows.map(({ habit, days, count }) => (
          <div key={habit.id} className="flex items-center gap-2.5">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-xs"
              style={{ background: `${habit.color}22`, color: habit.color }}
            >
              {habit.icon ?? "●"}
            </span>
            <span className="w-16 shrink-0 truncate text-[13px]">{habit.name}</span>
            <div className="flex flex-1 items-center justify-end gap-1">
              {days.map((done, i) => (
                <span
                  key={i}
                  className={cn(
                    "size-2 rounded-full",
                    done ? "bg-primary" : "bg-muted"
                  )}
                  style={done ? { background: habit.color } : undefined}
                />
              ))}
            </div>
            <span className="w-7 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
              {count}/7
            </span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
