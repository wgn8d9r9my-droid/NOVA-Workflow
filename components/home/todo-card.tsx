"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/home/widget-card";
import { useTasksStore } from "@/lib/store/tasks";

export function TodoCard() {
  const tasks = useTasksStore((s) => s.items);
  const addTask = useTasksStore((s) => s.add);
  const updateTask = useTasksStore((s) => s.update);
  const removeTask = useTasksStore((s) => s.remove);
  const [value, setValue] = useState("");

  // The to-do list is the undated tasks: same table as the Calendar, so it
  // syncs across devices like everything else.
  const items = useMemo(() => {
    const undated = tasks.filter((t) => !t.due_date);
    const todo = undated
      .filter((t) => t.status === "todo")
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    const done = undated
      .filter((t) => t.status === "done")
      .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""));
    return { todo, done: done.slice(0, 5), doneCount: done.length, total: undated.length };
  }, [tasks]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const title = value.trim();
    if (!title) return;
    setValue("");
    addTask({ title, priority: "P2", status: "todo", tags: [] });
  }

  function toggle(id: string, done: boolean) {
    updateTask(id, {
      status: done ? "todo" : "done",
      completed_at: done ? undefined : new Date().toISOString(),
    });
  }

  const rows = [...items.todo, ...items.done];
  const ratio = items.total > 0 ? Math.round((items.doneCount / items.total) * 100) : 0;

  return (
    <WidgetCard title="To-do" badge={items.todo.length || undefined}>
      <form onSubmit={submit} className="mb-2 flex items-center gap-2 rounded-xl border border-border/60 px-2.5 py-1.5">
        <Plus className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ajouter une chose à faire…"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </form>

      {rows.length === 0 ? (
        <p className="px-0.5 py-3 text-[13px] text-muted-foreground">Rien à faire — profite-en.</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {rows.map((task) => {
            const done = task.status === "done";
            return (
              <div key={task.id} className="group flex items-center gap-2.5 rounded-xl px-1 py-1.5">
                <button
                  onClick={() => toggle(task.id, done)}
                  aria-label={done ? "Marquer comme à faire" : "Marquer comme fait"}
                  className={cn(
                    "flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors",
                    done ? "border-primary bg-primary" : "border-border hover:border-primary/60"
                  )}
                >
                  {done && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-[13px]",
                    done ? "text-muted-foreground/60 line-through" : "text-foreground"
                  )}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  aria-label="Supprimer"
                  className="shrink-0 text-muted-foreground/60 transition-colors hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {items.total > 0 && (
        <div className="mt-3 border-t border-border/50 pt-3">
          <div className="mb-1.5 text-[11px] text-muted-foreground">
            {items.doneCount}/{items.total} terminées
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${ratio}%` }} />
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
