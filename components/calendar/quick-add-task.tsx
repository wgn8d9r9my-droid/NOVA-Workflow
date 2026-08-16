"use client";

import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import type { Priority } from "@/types/entities";

export function QuickAddTask({ date }: { date: Date }) {
  const addTask = useTasksStore((s) => s.add);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("P2");
  const [time, setTime] = useState("");

  function submit() {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      priority,
      status: "todo",
      tags: [],
      due_date: format(date, "yyyy-MM-dd"),
      due_time: time || undefined,
    });
    setTitle("");
    setTime("");
  }

  return (
    <div className="glass shadow-soft flex items-center gap-2 rounded-2xl p-2">
      <Plus className="ml-2 size-4 shrink-0 text-muted-foreground" />
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ajouter et programmer une tâche…"
        className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0"
      />
      <div className="flex shrink-0 items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-full border border-border/60 px-2 py-1">
          <Clock className="size-3 text-muted-foreground" />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-[70px] bg-transparent text-[11px] text-foreground outline-none"
          />
        </div>
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
