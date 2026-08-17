"use client";

import { useMemo } from "react";
import { format, isToday, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import { useTaskCategoriesStore } from "@/lib/store/task-categories";
import { monthGrid, tasksForDate } from "@/lib/calendar-derived";
import type { Priority } from "@/types/entities";

const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

const PRIORITY_COLOR: Record<Priority, string> = {
  P1: "var(--primary)",
  P2: "var(--glow)",
  P3: "var(--muted-foreground)",
};

export function MonthView({
  date,
  onSelectDay,
  onOpenTask,
}: {
  date: Date;
  onSelectDay: (date: Date) => void;
  onOpenTask: (id: string) => void;
}) {
  const tasks = useTasksStore((s) => s.items);
  const categories = useTaskCategoriesStore((s) => s.items);
  const days = useMemo(() => monthGrid(date), [date]);

  function categoryFor(id?: string) {
    return id ? categories.find((c) => c.id === id) : undefined;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60">
      <div className="grid grid-cols-7 border-b border-border/60 bg-muted/50">
        {WEEKDAY_LABELS.map((d, i) => (
          <div key={i} className="py-2 text-center text-[11px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayTasks = tasksForDate(tasks, day)
            .filter((t) => t.status === "todo")
            .sort((a, b) => (a.due_time ?? "").localeCompare(b.due_time ?? ""));
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex min-h-[112px] flex-col gap-1 border-b border-r border-border/40 p-1.5 last:border-r-0 [&:nth-child(7n)]:border-r-0",
                !isSameMonth(day, date) && "bg-muted/20"
              )}
            >
              <button
                onClick={() => onSelectDay(day)}
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center self-start rounded-full text-[11px] transition-colors hover:bg-muted",
                  isToday(day) && "bg-primary font-semibold text-primary-foreground",
                  !isSameMonth(day, date) && "text-muted-foreground/50"
                )}
              >
                {format(day, "d")}
              </button>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                {dayTasks.slice(0, 3).map((task) => {
                  const category = categoryFor(task.category_id);
                  const color = task.color ?? category?.color ?? PRIORITY_COLOR[task.priority];
                  return (
                    <button
                      key={task.id}
                      onClick={() => onOpenTask(task.id)}
                      style={{ background: color }}
                      className="truncate rounded px-1 py-0.5 text-left text-[10px] leading-tight text-white shadow-soft transition-opacity hover:opacity-90"
                    >
                      {task.due_time && <span className="tabular-nums opacity-80">{task.due_time} </span>}
                      {task.title}
                    </button>
                  );
                })}
                {dayTasks.length > 3 && (
                  <button
                    onClick={() => onSelectDay(day)}
                    className="truncate px-1 text-left text-[10px] font-medium text-primary hover:underline"
                  >
                    +{dayTasks.length - 3} de plus
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
