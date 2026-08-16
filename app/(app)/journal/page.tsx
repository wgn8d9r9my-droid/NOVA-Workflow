"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { JournalComposer } from "@/components/journal/journal-composer";
import { JournalEntryRow } from "@/components/journal/journal-entry-row";
import { useJournalStore } from "@/lib/store/journal";

export default function JournalPage() {
  const entries = useJournalStore((s) => s.items);
  const [blurred, setBlurred] = useState(false);

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Journal</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Un espace privé, seulement pour toi.</p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={() => setBlurred((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
          >
            {blurred ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {blurred ? "Masqué" : "Visible"}
          </button>
        )}
      </div>

      <JournalComposer />

      {sorted.length === 0 ? (
        <p className="px-1 py-8 text-center text-sm text-muted-foreground">
          Aucune entrée encore — commence à écrire ci-dessus.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((entry) => (
            <JournalEntryRow key={entry.id} entry={entry} blurred={blurred} />
          ))}
        </div>
      )}
    </div>
  );
}
