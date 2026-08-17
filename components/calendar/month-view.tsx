"use client";

import { useMemo } from "react";
import { format, isToday, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import { useTaskCategoriesStore } from "@/lib/store/task-categories";
import { monthGrid, tasksForDate } from "@/lib/calendar-derived";
import { priorityDotClass } from "@/lib/priority";

const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

export function MonthView({
  date,
  onSelectDay,
}: {
  date: Date;
  onSelectDay: (date: Date) => void;
}) {
  const tasks = useTasksStore((s) => s.items);
  const categories = useTaskCategoriesStore((s) => s.items);
  const days = useMemo(() => monthGrid(date), [date]);

  function categoryColor(id?: string) {
    return id ? categories.find((c) => c.id === id)?.color : undefined;
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
          const dayTasks = tasksForDate(tasks, day);
          const open = dayTasks.filter((t) => t.status === "todo");
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex min-h-[84px] flex-col items-start gap-1 border-b border-r border-border/40 p-1.5 text-left last:border-r-0 hover:bg-muted/60 [&:nth-child(7n)]:border-r-0",
                !isSameMonth(day, date) && "bg-muted/20 text-muted-foreground/50"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[11px]",
                  isToday(day) && "bg-primary font-semibold text-primary-foreground"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-wrap gap-0.5">
                {open.slice(0, 4).map((task) => {
                  const color = task.color ?? categoryColor(task.category_id);
                  return (
                    <span
                      key={task.id}
                      className={cn("size-1.5 rounded-full", !color && priorityDotClass[task.priority])}
                      style={color ? { background: color } : undefined}
                    />
                  );
                })}
                {open.length > 4 && (
                  <span className="text-[9px] text-muted-foreground">+{open.length - 4}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
