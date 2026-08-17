"use client";

import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import { useTaskCategoriesStore } from "@/lib/store/task-categories";
import type { Priority } from "@/types/entities";

export function QuickAddTask({ date }: { date: Date }) {
  const addTask = useTasksStore((s) => s.add);
  const categories = useTaskCategoriesStore((s) => s.items);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("P2");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  function submit() {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      priority,
      status: "todo",
      tags: [],
      due_date: format(date, "yyyy-MM-dd"),
      due_time: time || undefined,
      end_time: time && endTime ? endTime : undefined,
      category_id: categoryId,
    });
    setTitle("");
    setTime("");
    setEndTime("");
    setCategoryId(undefined);
  }

  return (
    <div className="glass shadow-soft flex flex-wrap items-center gap-2 rounded-2xl p-2">
      <Plus className="ml-2 size-4 shrink-0 text-muted-foreground" />
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ajouter et programmer une tâche…"
        className="h-8 min-w-[140px] flex-1 border-none bg-transparent shadow-none focus-visible:ring-0"
      />
      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-full border border-border/60 px-2 py-1">
          <Clock className="size-3 text-muted-foreground" />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-[70px] bg-transparent text-[11px] text-foreground outline-none"
          />
        </div>
        {time && (
          <div className="flex items-center gap-1 rounded-full border border-border/60 px-2 py-1">
            <span className="text-[10px] text-muted-foreground">à</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-[70px] bg-transparent text-[11px] text-foreground outline-none"
            />
          </div>
        )}
        {categories.length > 0 && (
          <div className="flex items-center gap-1 rounded-full border border-border/60 px-1.5 py-1">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(categoryId === c.id ? undefined : c.id)}
                title={c.name}
                className={cn(
                  "size-4 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-background transition-transform hover:scale-110",
                  categoryId === c.id ? "ring-foreground/50" : "ring-transparent"
                )}
                style={{ background: c.color }}
              />
            ))}
          </div>
        )}
        {(["P1", "P2", "P3"] as Priority[]).map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className={cn(
              "rounded-full border px-2 py-1 text-[11px] font-medium transition-colors",
              priority === p
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 text-muted-foreground hover:bg-muted"
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
