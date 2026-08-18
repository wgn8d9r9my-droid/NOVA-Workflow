"use client";

import { useMemo } from "react";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Check } from "lucide-react";
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
  const updateTask = useTasksStore((s) => s.update);
  const categories = useTaskCategoriesStore((s) => s.items);
  const days = useMemo(() => weekDays(date), [date]);

  function categoryFor(id?: string) {
    return id ? categories.find((c) => c.id === id) : undefined;
  }

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, {
      status: task.status === "done" ? "todo" : "done",
      completed_at: task.status === "done" ? undefined : new Date().toISOString(),
    });
  }

  const byDay = useMemo(
    () =>
      days.map((day) => {
        const dayTasks = tasksForDate(tasks, day);
        const { allDay, timed } = splitByTime(dayTasks);
        return { day, allDay, layout: layoutDayTasks(timed) };
      }),
    [days, tasks]
  );

  const hasAllDay = byDay.some((d) => d.allDay.length > 0);

  function renderBlock(task: Task, top: number, height: number, left: number, width: number, isRange: boolean) {
    const category = categoryFor(task.category_id);
    const color = task.color ?? category?.color ?? PRIORITY_COLOR[task.priority];
    const done = task.status === "done";
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
            : "flex items-center gap-1 px-1 text-[9px] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]",
          done && "opacity-45"
        )}
      >
        {isRange ? (
          <>
            <div className="flex items-start justify-between gap-0.5">
              <span className={cn("truncate font-medium", done && "line-through")}>{task.title}</span>
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(task.id);
                }}
                className="flex size-3 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/10"
              >
                {done && <Check className="size-2 text-white" strokeWidth={3} />}
              </span>
            </div>
            <span className="truncate opacity-80">{formatTimeRange(task.due_time, task.end_time)}</span>
          </>
        ) : (
          <>
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleTask(task.id);
              }}
              className="flex size-2.5 shrink-0 items-center justify-center rounded-full border"
              style={{ borderColor: color, background: done ? color : "transparent" }}
            />
            <span className={cn("truncate text-foreground", done && "line-through text-muted-foreground/60")}>
              {task.title}
            </span>
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
                  const done = task.status === "done";
                  return (
                    <button
                      key={task.id}
                      onClick={() => onOpenTask(task.id)}
                      className={cn(
                        "flex items-center gap-1 truncate rounded-md px-1 py-0.5 text-left text-[9px] hover:bg-muted",
                        done && "opacity-45"
                      )}
                    >
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id);
                        }}
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          !color && priorityDotClass[task.priority]
                        )}
                        style={color ? { background: color } : undefined}
                      />
                      <span className={cn("truncate", done && "line-through")}>{task.title}</span>
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
