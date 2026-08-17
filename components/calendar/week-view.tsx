"use client";

import { useMemo } from "react";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import { useTaskCategoriesStore } from "@/lib/store/task-categories";
import {
  weekDays,
  tasksForDate,
  splitByTime,
  layoutDayTasks,
  formatTimeRange,
  HOURS,
  HOUR_HEIGHT_PX,
  DAY_GRID_HEIGHT_PX,
} from "@/lib/calendar-derived";
import { priorityDotClass } from "@/lib/priority";
import type { Priority, Task } from "@/types/entities";

const PRIORITY_COLOR: Record<Priority, string> = {
  P1: "var(--primary)",
  P2: "var(--glow)",
  P3: "var(--muted-foreground)",
};

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

  function categoryFor(id?: string) {
    return id ? categories.find((c) => c.id === id) : undefined;
  }

  const byDay = useMemo(
    () =>
      days.map((day) => {
        const open = tasksForDate(tasks, day).filter((t) => t.status === "todo");
        const { allDay, timed } = splitByTime(open);
        return { day, allDay, layout: layoutDayTasks(timed) };
      }),
    [days, tasks]
  );

  const hasAllDay = byDay.some((d) => d.allDay.length > 0);

  function renderBlock(task: Task, top: number, height: number, left: number, width: number, isRange: boolean) {
    const category = categoryFor(task.category_id);
    const color = task.color ?? category?.color ?? PRIORITY_COLOR[task.priority];
    return (
      <button
        key={task.id}
        onClick={() => onOpenTask(task.id)}
        style={{
          top,
          height,
          left: `calc(${left}% + 1px)`,
          width: `calc(${width}% - 2px)`,
          background: isRange ? color : undefined,
        }}
        className={cn(
          "group absolute overflow-hidden rounded-md text-left leading-tight transition-opacity hover:opacity-90",
          isRange
            ? "flex flex-col justify-start px-1 py-0.5 text-[9px] text-white shadow-soft"
            : "flex items-center gap-1 px-1 text-[9px] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
        )}
      >
        {isRange ? (
          <>
            <span className="truncate font-medium">{task.title}</span>
            <span className="truncate opacity-80">{formatTimeRange(task.due_time, task.end_time)}</span>
          </>
        ) : (
          <>
            <span className="size-1.5 shrink-0 rounded-full" style={{ background: color }} />
            <span className="truncate text-foreground">{task.title}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex">
        <div className="w-12 shrink-0" />
        <div className="grid flex-1 grid-cols-7 gap-1.5">
          {days.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs hover:bg-muted",
                isToday(day) && "bg-accent"
              )}
            >
              <span className="text-muted-foreground">{format(day, "EEE", { locale: fr })}</span>
              <span className={cn("text-sm font-semibold", isToday(day) && "text-primary")}>{format(day, "d")}</span>
            </button>
          ))}
        </div>
      </div>

      {hasAllDay && (
        <div className="flex">
          <div className="w-12 shrink-0" />
          <div className="grid flex-1 grid-cols-7 gap-1.5">
            {byDay.map(({ day, allDay }) => (
              <div key={day.toISOString()} className="flex flex-col gap-0.5">
                {allDay.slice(0, 3).map((task) => {
                  const category = categoryFor(task.category_id);
                  const color = task.color ?? category?.color;
                  return (
                    <button
                      key={task.id}
                      onClick={() => onOpenTask(task.id)}
                      className="flex items-center gap-1 truncate rounded-md px-1 py-0.5 text-left text-[9px] hover:bg-muted"
                    >
                      <span
                        className={cn("size-1.5 shrink-0 rounded-full", !color && priorityDotClass[task.priority])}
                        style={color ? { background: color } : undefined}
                      />
                      <span className="truncate">{task.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass shadow-soft rounded-2xl p-2">
        <div className="flex">
          <div className="w-12 shrink-0" style={{ height: DAY_GRID_HEIGHT_PX }}>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="text-right text-[10px] tabular-nums text-muted-foreground"
                style={{ height: HOUR_HEIGHT_PX }}
              >
                <span className="relative -top-1.5 pr-1.5">{String(hour).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          <div className="grid flex-1 grid-cols-7 gap-1.5">
            {byDay.map(({ day, layout }) => (
              <div key={day.toISOString()} className="relative" style={{ height: DAY_GRID_HEIGHT_PX }}>
                {HOURS.map((hour, i) => (
                  <div
                    key={hour}
                    className="absolute inset-x-0 border-t border-border/50 first:border-t-0"
                    style={{ top: i * HOUR_HEIGHT_PX }}
                  />
                ))}
                {layout.map(({ task, top, height, left, width, isRange }) =>
                  renderBlock(task, top, height, left, width, isRange)
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
