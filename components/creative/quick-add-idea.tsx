"use client";

import { useState } from "react";
import { Plus, Lightbulb, StickyNote } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNotesStore } from "@/lib/store/notes";
import type { NoteType } from "@/types/entities";

export function QuickAddIdea() {
  const addNote = useNotesStore((s) => s.add);
  const [content, setContent] = useState("");
  const [type, setType] = useState<NoteType>("idea");

  function submit() {
    if (!content.trim()) return;
    addNote({ content: content.trim(), type, tags: [] });
    setContent("");
  }

  return (
    <div className="glass shadow-soft flex flex-col gap-2 rounded-2xl p-3">
      <div className="flex items-start gap-2">
        <Plus className="mt-2 ml-1 size-4 shrink-0 text-muted-foreground" />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder="Capture une idée, une référence, un concept… (⌘+Entrée pour valider)"
          rows={2}
          className="border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="flex items-center justify-between pl-1">
        <div className="flex gap-1.5">
          {(
            [
              { value: "idea", label: "Idée", icon: Lightbulb },
              { value: "note", label: "Note", icon: StickyNote },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setType(opt.value)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                type === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
            >
              <opt.icon className="size-3" />
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={submit}
          disabled={!content.trim()}
          className="rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground disabled:opacity-40"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
