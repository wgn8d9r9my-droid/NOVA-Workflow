"use client";

import { useMemo, useState } from "react";
import { QuickAddIdea } from "@/components/creative/quick-add-idea";
import { IdeaCard } from "@/components/creative/idea-card";
import { useNotesStore } from "@/lib/store/notes";
import { cn } from "@/lib/utils";

type Filter = "all" | "idea" | "note";

export default function CreativePage() {
  const notes = useNotesStore((s) => s.items);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const sorted = [...notes].sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (filter === "all") return sorted;
    return sorted.filter((n) => n.type === filter);
  }, [notes, filter]);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Creative Lab</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Ton studio d&apos;idées et de références.</p>
      </div>

      <QuickAddIdea />

      <div className="flex gap-1.5">
        {(
          [
            { value: "all", label: "Tout" },
            { value: "idea", label: "Idées" },
            { value: "note", label: "Notes" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 text-muted-foreground hover:bg-muted"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="px-1 py-12 text-center text-sm text-muted-foreground">
          Rien ici pour l&apos;instant — capture ta première idée ci-dessus.
        </p>
      ) : (
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
          {filtered.map((note) => (
            <IdeaCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
