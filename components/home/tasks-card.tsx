"use client";

import { motion } from "motion/react";
import { isToday, isTomorrow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/home/widget-card";
import type { Task } from "@/types/entities";

function dueLabel(dueDate?: string) {
  if (!dueDate) return undefined;
  const d = new Date(dueDate);
  if (isToday(d)) return "Aujourd'hui";
  if (isTomorrow(d)) return "Demain";
  return format(d, "EEE d MMM", { locale: fr });
}

export function TasksCard({
  tasks,
  done,
  total,
  onToggle,
}: {
  tasks: Task[];
  done: number;
  total: number;
  onToggle: (id: string) => void;
}) {
  const ratio = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <WidgetCard title="Tâches" href="/calendar" empty={tasks.length === 0}>
      <div className="flex flex-col gap-0.5">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
            <button
              onClick={() => onToggle(task.id)}
              className={cn(
                "flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors",
                task.status === "done" ? "border-primary bg-primary" : "border-border hover:border-primary/60"
              )}
            >
              {task.status === "done" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />
                </motion.div>
              )}
            </button>
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-[13px]",
                task.status === "done" ? "text-muted-foreground/60 line-through" : "text-foreground"
              )}
            >
              {task.title}
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground">{dueLabel(task.due_date)}</span>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="mt-3 border-t border-border/50 pt-3">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {done}/{total} terminées
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${ratio}%` }} />
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
