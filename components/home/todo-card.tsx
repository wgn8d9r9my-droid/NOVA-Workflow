"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/home/widget-card";
import { useTodosStore, useTodoListsStore } from "@/lib/store/todos";
import { deadlineInfo, sortTodos, todoColor } from "@/lib/todo-derived";

const TONE_TEXT = {
  overdue: "text-destructive",
  today: "text-primary",
  soon: "text-foreground/70",
  normal: "text-muted-foreground",
} as const;

export function TodoCard() {
  const todos = useTodosStore((s) => s.items);
  const addTodo = useTodosStore((s) => s.add);
  const updateTodo = useTodosStore((s) => s.update);
  const lists = useTodoListsStore((s) => s.items);
  const [value, setValue] = useState("");

  const { open, total, doneCount } = useMemo(() => {
    const openItems = todos.filter((t) => t.status === "todo").sort(sortTodos);
    return { open: openItems, total: todos.length, doneCount: todos.length - openItems.length };
  }, [todos]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const title = value.trim();
    if (!title) return;
    setValue("");
    addTodo({ title, priority: "P2", status: "todo", subtasks: [] });
  }

  const ratio = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <WidgetCard title="To-do" badge={open.length || undefined} href="/todo">
      <form onSubmit={submit} className="mb-2 flex items-center gap-2 rounded-xl border border-border/60 px-2.5 py-1.5">
        <Plus className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ajouter une chose à faire…"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </form>

      {open.length === 0 ? (
        <p className="px-0.5 py-3 text-[13px] text-muted-foreground">Rien à faire — profite-en.</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {open.slice(0, 6).map((todo) => {
            const color = todoColor(todo, todo.list_id ? lists.find((l) => l.id === todo.list_id) : undefined);
            const deadline = deadlineInfo(todo);
            return (
              <div key={todo.id} className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
                <button
                  onClick={() => updateTodo(todo.id, { status: "done", completed_at: new Date().toISOString() })}
                  aria-label="Marquer comme fait"
                  className={cn(
                    "flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    !color && "border-border hover:border-primary/60"
                  )}
                  style={color ? { borderColor: color } : undefined}
                />
                <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">{todo.title}</span>
                {deadline && (
                  <span className={cn("shrink-0 text-[11px]", TONE_TEXT[deadline.tone])}>{deadline.text}</span>
                )}
              </div>
            );
          })}
          {open.length > 6 && (
            <p className="px-1 pt-1 text-[11px] text-muted-foreground">+ {open.length - 6} autres</p>
          )}
        </div>
      )}

      {total > 0 && (
        <div className="mt-3 border-t border-border/50 pt-3">
          <div className="mb-1.5 text-[11px] text-muted-foreground">
            {doneCount}/{total} terminées
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${ratio}%` }} />
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
