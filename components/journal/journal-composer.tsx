"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useJournalStore } from "@/lib/store/journal";
import { moods } from "@/lib/mood";
import type { Mood } from "@/types/entities";

export function JournalComposer() {
  const addEntry = useJournalStore((s) => s.add);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [tagsInput, setTagsInput] = useState("");

  function submit() {
    if (!content.trim()) return;
    addEntry({
      content: content.trim(),
      mood,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      date: new Date().toISOString().slice(0, 10),
    });
    setContent("");
    setMood(undefined);
    setTagsInput("");
  }

  return (
    <div className="glass shadow-soft flex flex-col gap-3 rounded-2xl p-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écris librement…"
        rows={5}
        className="resize-none border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {moods.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(mood === m.value ? undefined : m.value)}
              title={m.label}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-base transition-transform hover:scale-110",
                mood === m.value ? "bg-accent ring-2 ring-primary" : "hover:bg-muted"
              )}
            >
              {m.emoji}
            </button>
          ))}
        </div>
        <Input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="tags (optionnel)"
          className="h-8 flex-1 min-w-[140px]"
        />
        <Button size="sm" onClick={submit} disabled={!content.trim()}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
