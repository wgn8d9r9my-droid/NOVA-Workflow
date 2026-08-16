"use client";

import Link from "next/link";
import { Lightbulb, StickyNote, Trash2, FolderPlus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useNotesStore } from "@/lib/store/notes";
import { useProjectsStore } from "@/lib/store/projects";
import type { Note } from "@/types/entities";

export function IdeaCard({ note }: { note: Note }) {
  const removeNote = useNotesStore((s) => s.remove);
  const updateNote = useNotesStore((s) => s.update);
  const addProject = useProjectsStore((s) => s.add);
  const convertedProject = useProjectsStore((s) =>
    note.converted_to_project_id ? s.items.find((p) => p.id === note.converted_to_project_id) : undefined
  );

  function convertToProject() {
    const project = addProject({
      name: note.content.slice(0, 60),
      description: note.content,
      status: "idea",
      type: "personal",
    });
    updateNote(note.id, { converted_to_project_id: project.id });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div
          className={
            note.type === "idea"
              ? "flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground"
              : "flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground"
          }
        >
          {note.type === "idea" ? <Lightbulb className="size-3.5" /> : <StickyNote className="size-3.5" />}
        </div>
        <button
          onClick={() => removeNote(note.id)}
          className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <p className="whitespace-pre-wrap text-sm text-foreground/90">{note.content}</p>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-[11px] text-muted-foreground">
          {format(new Date(note.created_at), "d MMM", { locale: fr })}
        </span>

        {note.type === "idea" &&
          (convertedProject ? (
            <Link
              href={`/projects/${convertedProject.id}`}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Voir le projet →
            </Link>
          ) : (
            <Button variant="ghost" size="sm" className="h-6 gap-1 px-2 text-[11px]" onClick={convertToProject}>
              <FolderPlus className="size-3" /> En projet
            </Button>
          ))}
      </div>
    </div>
  );
}
