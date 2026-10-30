"use client";

import { useState } from "react";
import { CalendarClock, CalendarDays, CheckCheck, Inbox, ListChecks, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodoListsStore } from "@/lib/store/todos";
import { EmojiPicker } from "@/components/shared/emoji-picker";
import { accentColors } from "@/lib/accent-colors";
import { matchesView } from "@/lib/todo-derived";
import type { TodoItem } from "@/types/entities";

const SMART_VIEWS = [
  { id: "all", label: "Toutes", icon: ListChecks },
  { id: "today", label: "Aujourd'hui", icon: CalendarDays },
  { id: "upcoming", label: "À venir", icon: CalendarClock },
  { id: "nodate", label: "Sans échéance", icon: Inbox },
  { id: "done", label: "Terminées", icon: CheckCheck },
] as const;

export function TodoSidebar({
  items,
  view,
  onSelect,
}: {
  items: TodoItem[];
  view: string;
  onSelect: (view: string) => void;
}) {
  const lists = useTodoListsStore((s) => s.items);
  const addList = useTodoListsStore((s) => s.add);
  const removeList = useTodoListsStore((s) => s.remove);

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(accentColors[1].value);
  const [emoji, setEmoji] = useState<string | undefined>(undefined);

  function count(id: string) {
    const open = items.filter((i) => i.status === "todo");
    if (id === "done") return items.filter((i) => i.status === "done").length;
    return open.filter((i) => matchesView(i, id)).length;
  }

  function create() {
    if (!name.trim()) return;
    const list = addList({ name: name.trim(), color, emoji });
    onSelect(list.id);
    setName("");
    setEmoji(undefined);
    setColor(accentColors[1].value);
    setCreating(false);
  }

  function remove(id: string) {
    removeList(id);
    if (view === id) onSelect("all");
  }

  return (
    <div className="flex flex-col gap-2 md:w-56 md:shrink-0">
      {/* Mobile: horizontal chips */}
      <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 md:hidden">
        {[...SMART_VIEWS.map((v) => ({ id: v.id as string, label: v.label })), ...lists.map((l) => ({ id: l.id, label: `${l.emoji ?? "•"} ${l.name}` }))].map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              view === v.id ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-muted-foreground"
            )}
          >
            {v.label}
          </button>
        ))}
        <button
          onClick={() => setCreating((v) => !v)}
          className="shrink-0 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground"
        >
          + Liste
        </button>
      </div>

      {/* Desktop: vertical panel */}
      <div className="hidden flex-col gap-0.5 md:flex">
        {SMART_VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-muted",
              view === v.id && "bg-accent font-medium text-accent-foreground"
            )}
          >
            <v.icon className="size-4 shrink-0" />
            <span className="flex-1 truncate">{v.label}</span>
            <span className="text-xs text-muted-foreground">{count(v.id) || ""}</span>
          </button>
        ))}

        <div className="mb-1 mt-4 flex items-center justify-between px-1">
          <p className="text-xs font-medium text-muted-foreground">Listes</p>
          <button
            onClick={() => setCreating((v) => !v)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Nouvelle liste"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {lists.length === 0 && !creating && (
          <p className="px-2.5 text-xs text-muted-foreground">Crée des listes (Perso, Travail…) avec leur couleur.</p>
        )}

        {lists.map((l) => (
          <div
            key={l.id}
            className={cn(
              "group flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
              view === l.id && "bg-accent font-medium text-accent-foreground"
            )}
          >
            <button onClick={() => onSelect(l.id)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
              {l.emoji ? (
                <span className="shrink-0">{l.emoji}</span>
              ) : (
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: l.color }} />
              )}
              <span className="truncate">{l.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{count(l.id) || ""}</span>
            </button>
            <button
              onClick={() => remove(l.id)}
              aria-label="Supprimer la liste"
              className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {creating && (
        <div className="flex flex-col gap-2 rounded-xl border border-border/60 p-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            placeholder="Nom de la liste (ex : Travail)"
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <EmojiPicker value={emoji} onChange={setEmoji} />
          <div className="flex flex-wrap gap-1">
            {accentColors.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                title={c.name}
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
            Créer la liste
          </button>
        </div>
      )}
    </div>
  );
}
