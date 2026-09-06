"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubjectsStore } from "@/lib/store/courses";
import { EmojiPicker } from "@/components/shared/emoji-picker";
import { accentColors } from "@/lib/accent-colors";

export function SubjectSidebar({
  selectedId,
  onSelect,
}: {
  selectedId: string | "all";
  onSelect: (id: string | "all") => void;
}) {
  const subjects = useSubjectsStore((s) => s.items);
  const addSubject = useSubjectsStore((s) => s.add);
  const removeSubject = useSubjectsStore((s) => s.remove);

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(accentColors[0].value);
  const [emoji, setEmoji] = useState<string | undefined>(undefined);

  function create() {
    if (!name.trim()) return;
    const subject = addSubject({ name: name.trim(), color, emoji });
    onSelect(subject.id);
    setName("");
    setEmoji(undefined);
    setColor(accentColors[0].value);
    setCreating(false);
  }

  function remove(id: string) {
    removeSubject(id);
    if (selectedId === id) onSelect("all");
  }

  return (
    <div className="flex w-52 shrink-0 flex-col gap-1">
      <div className="mb-1 flex items-center justify-between px-1">
        <p className="text-xs font-medium text-muted-foreground">Matières</p>
        <button
          onClick={() => setCreating((v) => !v)}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <button
        onClick={() => onSelect("all")}
        className={cn(
          "rounded-xl px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-muted",
          selectedId === "all" && "bg-accent font-medium text-accent-foreground"
        )}
      >
        Toutes les notes
      </button>

      {subjects.map((s) => (
        <div
          key={s.id}
          className={cn(
            "group flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
            selectedId === s.id && "bg-accent font-medium text-accent-foreground"
          )}
        >
          <button onClick={() => onSelect(s.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
            {s.emoji ? (
              <span className="shrink-0">{s.emoji}</span>
            ) : (
              <span className="size-2 shrink-0 rounded-full" style={{ background: s.color }} />
            )}
            <span className="truncate">{s.name}</span>
          </button>
          <button
            onClick={() => remove(s.id)}
            className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}

      {creating && (
        <div className="mt-1 flex flex-col gap-2 rounded-xl border border-border/60 p-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            placeholder="Nom (ex : Maths)"
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <EmojiPicker value={emoji} onChange={setEmoji} />
          <div className="flex flex-wrap gap-1">
            {accentColors.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={cn(
                  "size-4 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-background transition-transform hover:scale-110",
                  color === c.value ? "ring-foreground/50" : "ring-transparent"
                )}
                style={{ background: c.value }}
              />
            ))}
          </div>
          <button
            onClick={create}
            disabled={!name.trim()}
            className="rounded-lg bg-primary py-1 text-xs font-medium text-primary-foreground disabled:opacity-40"
          >
            Créer
          </button>
        </div>
      )}
    </div>
  );
}
