"use client";

import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import { formatDuration } from "@/lib/calendar-derived";
import type { Priority } from "@/types/entities";

const DURATIONS = [15, 30, 45, 60, 90, 120];

export function QuickAddTask({ date }: { date: Date }) {
  const addTask = useTasksStore((s) => s.add);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("P2");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  function submit() {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      priority,
      status: "todo",
      tags: [],
      due_date: format(date, "yyyy-MM-dd"),
      due_time: time || undefined,
      duration_minutes: time && duration ? Number(duration) : undefined,
    });
    setTitle("");
    setTime("");
    setDuration("");
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
        {time && (
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="rounded-full border border-border/60 bg-transparent px-2 py-1 text-[11px] text-foreground outline-none"
          >
            <option value="">Durée</option>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {formatDuration(d)}
              </option>
            ))}
          </select>
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
