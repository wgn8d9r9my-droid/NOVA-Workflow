"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { QuickAddTask } from "@/components/calendar/quick-add-task";
import { TaskRow } from "@/components/shared/task-row";
import { useTasksStore } from "@/lib/store/tasks";
import { useProjectsStore } from "@/lib/store/projects";
import { tasksForDate, splitByTime, HOURS, formatTimeRange } from "@/lib/calendar-derived";
import { cn } from "@/lib/utils";

export function DayView({
  date,
  onOpenTask,
}: {
  date: Date;
  onOpenTask: (id: string) => void;
}) {
  const tasks = useTasksStore((s) => s.items);
  const updateTask = useTasksStore((s) => s.update);
  const projects = useProjectsStore((s) => s.items);
  const [showCompleted, setShowCompleted] = useState(false);

  const dayTasks = useMemo(() => tasksForDate(tasks, date), [tasks, date]);
  const open = useMemo(() => dayTasks.filter((t) => t.status === "todo"), [dayTasks]);
  const completed = useMemo(() => dayTasks.filter((t) => t.status === "done"), [dayTasks]);
  const { allDay, byHour } = useMemo(() => splitByTime(open), [open]);

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, {
      status: task.status === "done" ? "todo" : "done",
      completed_at: task.status === "done" ? undefined : new Date().toISOString(),
    });
  }

  function projectName(id?: string) {
    return id ? projects.find((p) => p.id === id)?.name : undefined;
  }

  return (
    <div className="flex flex-col gap-6">
      <QuickAddTask date={date} />

      {allDay.length > 0 && (
        <div>
          <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">Toute la journée</p>
          <div className="glass shadow-soft flex flex-col rounded-2xl p-2">
            {allDay.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onOpen={onOpenTask}
                subtitle={projectName(task.project_id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="glass shadow-soft rounded-2xl p-2">
        {HOURS.map((hour) => {
          const hourTasks = byHour.get(hour) ?? [];
          return (
            <div key={hour} className="flex gap-3 border-t border-border/50 py-1.5 first:border-t-0">
              <span className="w-12 shrink-0 pt-1.5 text-right text-xs tabular-nums text-muted-foreground">
                {String(hour).padStart(2, "0")}:00
              </span>
              <div className="flex-1">
                {hourTasks.length === 0 ? (
                  <div className="h-7" />
                ) : (
                  <div className="flex flex-col">
                    {hourTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onOpen={onOpenTask}
                        subtitle={formatTimeRange(task.due_time, task.duration_minutes)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completed.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="mb-1.5 flex items-center gap-1 px-1 text-xs font-medium text-muted-foreground"
          >
            Terminées · {completed.length}
            <ChevronDown className={cn("size-3.5 transition-transform", showCompleted && "rotate-180")} />
          </button>
          {showCompleted && (
            <div className="flex flex-col rounded-2xl border border-border/60 p-2">
              {completed.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} onOpen={onOpenTask} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
