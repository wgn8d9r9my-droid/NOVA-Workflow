"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseNote } from "@/types/entities";

export function NoteList({
  notes,
  selectedId,
  onSelect,
  onCreate,
}: {
  notes: CourseNote[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}) {
  const sorted = useMemo(() => [...notes].sort((a, b) => b.updated_at.localeCompare(a.updated_at)), [notes]);

  return (
    <div className="flex w-64 shrink-0 flex-col gap-1">
      <div className="mb-1 flex items-center justify-between px-1">
        <p className="text-xs font-medium text-muted-foreground">Notes · {notes.length}</p>
        <button onClick={onCreate} className="text-muted-foreground transition-colors hover:text-foreground">
          <Plus className="size-4" />
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="px-2 py-6 text-center text-xs text-muted-foreground">Aucune note — crée la première.</p>
      ) : (
        sorted.map((note) => (
          <button
            key={note.id}
            onClick={() => onSelect(note.id)}
            className={cn(
              "flex flex-col gap-0.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-muted",
              selectedId === note.id && "bg-accent text-accent-foreground"
            )}
          >
            <span className="flex items-center gap-1.5 truncate text-sm font-medium">
              <FileText className="size-3.5 shrink-0 opacity-60" />
              {note.title || "Sans titre"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {format(new Date(note.updated_at), "d MMM yyyy", { locale: fr })}
            </span>
          </button>
        ))
      )}
    </div>
  );
}
