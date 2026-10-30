"use client";

import { motion } from "motion/react";
import { Check, Flag, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { deadlineInfo, todoColor } from "@/lib/todo-derived";
import type { TodoItem, TodoList } from "@/types/entities";

const TONE_STYLE = {
  overdue: "bg-destructive/10 text-destructive",
  today: "bg-primary/10 text-primary",
  soon: "bg-accent text-accent-foreground",
  normal: "bg-muted text-muted-foreground",
} as const;

export function TodoRow({
  item,
  list,
  showList,
  onToggle,
  onOpen,
}: {
  item: TodoItem;
  list?: TodoList;
  showList?: boolean;
  onToggle: (item: TodoItem) => void;
  onOpen: (id: string) => void;
}) {
  const done = item.status === "done";
  const color = todoColor(item, list);
  const deadline = deadlineInfo(item);
  const subtasks = item.subtasks ?? [];
  const subDone = subtasks.filter((s) => s.done).length;

  return (
    <div
      onClick={() => onOpen(item.id)}
      className="group flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(item);
        }}
        aria-label={done ? "Marquer comme à faire" : "Marquer comme fait"}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          !color && (done ? "border-primary bg-primary" : "border-border hover:border-primary/60")
        )}
        style={color ? { borderColor: color, background: done ? color : "transparent" } : undefined}
      >
        {done && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Check className="size-3 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm", done ? "text-muted-foreground/60 line-through" : "text-foreground")}>
          {item.title}
        </p>
        {item.notes && !done && <p className="truncate text-xs text-muted-foreground">{item.notes}</p>}
      </div>

      {subtasks.length > 0 && (
        <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
          <ListTree className="size-3" />
          {subDone}/{subtasks.length}
        </span>
      )}

      {showList && list && (
        <span className="hidden shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground sm:flex">
          {list.emoji ? <span>{list.emoji}</span> : <span className="size-1.5 rounded-full" style={{ background: list.color }} />}
          {list.name}
        </span>
      )}

      {item.priority === "P1" && !done && <Flag className="size-3.5 shrink-0 text-destructive" fill="currentColor" />}

      {deadline && !done && (
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", TONE_STYLE[deadline.tone])}>
          {deadline.text}
        </span>
      )}
    </div>
  );
}
