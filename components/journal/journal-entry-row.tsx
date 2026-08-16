"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { moodEmoji } from "@/lib/mood";
import { useJournalStore } from "@/lib/store/journal";
import { cn } from "@/lib/utils";
import type { JournalEntry } from "@/types/entities";

export function JournalEntryRow({ entry, blurred }: { entry: JournalEntry; blurred: boolean }) {
  const removeEntry = useJournalStore((s) => s.remove);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <button onClick={() => setExpanded((v) => !v)} className="flex flex-1 items-start gap-2.5 text-left">
          {entry.mood && <span className="text-lg leading-none">{moodEmoji(entry.mood)}</span>}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">
              {format(new Date(entry.date), "EEEE d MMMM", { locale: fr })}
            </p>
            <p
              className={cn(
                "mt-1 whitespace-pre-wrap text-sm text-foreground/90",
                !expanded && "line-clamp-2",
                blurred && "blur-md select-none"
              )}
            >
              {entry.content}
            </p>
          </div>
        </button>
        <button
          onClick={() => removeEntry(entry.id)}
          className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      {entry.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 pl-7">
          {entry.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
