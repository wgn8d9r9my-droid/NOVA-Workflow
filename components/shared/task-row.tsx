"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/entities";

const priorityStyles: Record<Task["priority"], string> = {
  P1: "bg-primary text-primary-foreground",
  P2: "bg-accent text-accent-foreground",
  P3: "bg-muted text-muted-foreground",
};

export function TaskRow({
  task,
  onToggle,
  onOpen,
  subtitle,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onOpen?: (id: string) => void;
  subtitle?: string;
}) {
  const done = task.status === "done";

  return (
    <div
      onClick={() => onOpen?.(task.id)}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]",
        onOpen && "cursor-pointer"
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          done ? "border-primary bg-primary" : "border-border hover:border-primary/60"
        )}
      >
        {done && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Check className="size-3 text-primary-foreground" strokeWidth={3} />
          </motion.div>
        )}
      </button>

      <span
        className={cn(
          "flex-1 truncate text-sm transition-all",
          done ? "text-muted-foreground/60 line-through" : "text-foreground"
        )}
      >
        {task.title}
      </span>

      {subtitle && !done && (
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{subtitle}</span>
      )}

      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold transition-opacity",
          priorityStyles[task.priority],
          done && "opacity-40"
        )}
      >
        {task.priority[1]}
      </span>
    </div>
  );
}
