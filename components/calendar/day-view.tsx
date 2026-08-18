"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { AddEventButton } from "@/components/calendar/add-event-button";
import { TaskRow } from "@/components/shared/task-row";
import { useTasksStore } from "@/lib/store/tasks";
import { useTaskCategoriesStore } from "@/lib/store/task-categories";
import {
  tasksForDate,
  splitByTime,
  layoutDayTasks,
  formatTimeRange,
  HOURS,
  HOUR_HEIGHT_PX,
  DAY_GRID_HEIGHT_PX,
} from "@/lib/calendar-derived";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types/entities";

const PRIORITY_COLOR: Record<Priority, string> = {
  P1: "var(--primary)",
  P2: "var(--glow)",
  P3: "var(--muted-foreground)",
};

export function DayView({
  date,
  onOpenTask,
}: {
  date: Date;
  onOpenTask: (id: string) => void;
}) {
  const tasks = useTasksStore((s) => s.items);
  const updateTask = useTasksStore((s) => s.update);
  const categories = useTaskCategoriesStore((s) => s.items);

  const dayTasks = useMemo(() => tasksForDate(tasks, date), [tasks, date]);
  const { allDay, timed } = useMemo(() => splitByTime(dayTasks), [dayTasks]);
  const layout = useMemo(() => layoutDayTasks(timed), [timed]);

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, {
      status: task.status === "done" ? "todo" : "done",
      completed_at: task.status === "done" ? undefined : new Date().toISOString(),
    });
  }

  function categoryFor(id?: string) {
    return id ? categories.find((c) => c.id === id) : undefined;
  }

  return (
    <div className="flex flex-col gap-6">
      <AddEventButton date={date} />

      {allDay.length > 0 && (
        <div>
          <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">Toute la journée</p>
          <div className="glass shadow-soft flex flex-col rounded-2xl p-2">
            {allDay.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} onOpen={onOpenTask} />
            ))}
          </div>
        </div>
      )}

      <div className="glass shadow-soft rounded-2xl p-2">
        <div className="flex">
          <div className="w-12 shrink-0" style={{ height: DAY_GRID_HEIGHT_PX }}>
            {HOURS.map((hour) => (
              <div key={hour} className="text-right text-xs tabular-nums text-muted-foreground" style={{ height: HOUR_HEIGHT_PX }}>
                <span className="relative -top-1.5 pr-1.5">{String(hour).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          <div className="relative flex-1" style={{ height: DAY_GRID_HEIGHT_PX }}>
            {HOURS.map((hour, i) => (
              <div
                key={hour}
                className="absolute inset-x-0 border-t border-border/50 first:border-t-0"
                style={{ top: i * HOUR_HEIGHT_PX }}
              />
            ))}

            {layout.map(({ task, top, height, left, width, isRange }) => {
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
                    left: `calc(${left}% + 2px)`,
                    width: `calc(${width}% - 6px)`,
                    background: isRange ? color : undefined,
                  }}
                  className={cn(
                    "group absolute overflow-hidden rounded-lg text-left transition-opacity hover:opacity-90",
                    isRange
                      ? "flex flex-col justify-start px-2 py-1 text-[11px] text-white shadow-soft"
                      : "flex items-center gap-1.5 px-1.5 text-[11px] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]",
                    done && "opacity-45"
                  )}
                >
                  {isRange ? (
                    <>
                      <div className="flex items-start justify-between gap-1">
                        <span className={cn("truncate font-medium leading-tight", done && "line-through")}>
                          {task.title}
                        </span>
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(task.id);
                          }}
                          className="flex size-4 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/10"
                        >
                          {done && <Check className="size-2.5 text-white" strokeWidth={3} />}
                        </span>
                      </div>
                      <span className="truncate text-[10px] leading-tight opacity-80">
                        {formatTimeRange(task.due_time, task.end_time)}
                      </span>
                      {task.location && height >= 58 && (
                        <span className="truncate text-[10px] leading-tight opacity-70">📍 {task.location}</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id);
                        }}
                        className="flex size-3 shrink-0 items-center justify-center rounded-full border"
                        style={{ borderColor: color, background: done ? color : "transparent" }}
                      >
                        {done && <Check className="size-2 text-white" strokeWidth={3} />}
                      </span>
                      <span className={cn("truncate text-foreground", done && "line-through text-muted-foreground/60")}>
                        <span className="tabular-nums text-muted-foreground">{task.due_time}</span> {task.title}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
