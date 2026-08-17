"use client";

import { useMemo } from "react";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import { useTaskCategoriesStore } from "@/lib/store/task-categories";
import { weekDays, tasksForDate, formatTimeRange } from "@/lib/calendar-derived";
import { priorityDotClass } from "@/lib/priority";

export function WeekView({
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
  const days = useMemo(() => weekDays(date), [date]);

  function categoryColor(id?: string) {
    return id ? categories.find((c) => c.id === id)?.color : undefined;
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const dayTasks = tasksForDate(tasks, day).sort((a, b) =>
          (a.due_time ?? "").localeCompare(b.due_time ?? "")
        );
        return (
          <div key={day.toISOString()} className="flex min-h-[320px] flex-col rounded-2xl border border-border/60 bg-card">
            <button
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex flex-col items-center gap-0.5 border-b border-border/60 py-2 text-xs hover:bg-muted",
                isToday(day) && "bg-accent"
              )}
            >
              <span className="text-muted-foreground">{format(day, "EEE", { locale: fr })}</span>
              <span className={cn("text-sm font-semibold", isToday(day) && "text-primary")}>
                {format(day, "d")}
              </span>
            </button>
            <div className="flex flex-1 flex-col gap-1 p-1.5">
              {dayTasks.length === 0 ? (
                <span className="px-1 pt-2 text-center text-[11px] text-muted-foreground/60">—</span>
              ) : (
                dayTasks.slice(0, 6).map((task) => {
                  const color = categoryColor(task.category_id);
                  return (
                    <button
                      key={task.id}
                      onClick={() => onOpenTask(task.id)}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-1.5 py-1 text-left text-[11px] hover:bg-muted",
                        task.status === "done" && "opacity-40 line-through"
                      )}
                    >
                      <span
                        className={cn("size-1.5 shrink-0 rounded-full", !color && priorityDotClass[task.priority])}
                        style={color ? { background: color } : undefined}
                      />
                      <span className="truncate">
                        {task.due_time && (
                          <span className="text-muted-foreground">{formatTimeRange(task.due_time, task.end_time)} </span>
                        )}
                        {task.title}
                      </span>
                    </button>
                  );
                })
              )}
              {dayTasks.length > 6 && (
                <button
                  onClick={() => onSelectDay(day)}
                  className="px-1.5 text-[10px] text-primary hover:underline"
                >
                  +{dayTasks.length - 6} de plus
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
