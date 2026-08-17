"use client";

import { motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store/ui";
import { WidgetCard } from "@/components/home/widget-card";
import type { Task } from "@/types/entities";

const priorityStyles: Record<Task["priority"], string> = {
  P1: "bg-primary text-primary-foreground",
  P2: "bg-accent text-accent-foreground",
  P3: "bg-muted text-muted-foreground",
};

export function PrioritiesCard({
  tasks,
  onToggle,
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
}) {
  const openCapture = useUIStore((s) => s.openCapture);

  return (
    <WidgetCard title="Top priorités" badge={tasks.length} href="/calendar" empty={tasks.length === 0}>
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
                "flex-1 truncate text-[13px]",
                task.status === "done" ? "text-muted-foreground/60 line-through" : "text-foreground"
              )}
            >
              {task.title}
            </span>
            <span
              className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                priorityStyles[task.priority]
              )}
            >
              {task.priority}
            </span>
            {task.due_time && (
              <span className="hidden shrink-0 text-[11px] tabular-nums text-muted-foreground sm:inline">
                {task.due_time}
              </span>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => openCapture("task")}
        className="mt-1.5 flex items-center gap-1.5 rounded-xl px-1 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-primary"
      >
        <Plus className="size-3.5" />
        Ajouter une tâche
      </button>
    </WidgetCard>
  );
}
