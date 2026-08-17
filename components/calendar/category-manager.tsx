"use client";

import { useState } from "react";
import { Tag, Trash2, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskCategoriesStore } from "@/lib/store/task-categories";
import { accentColors } from "@/lib/accent-colors";

export function CategoryManager() {
  const categories = useTaskCategoriesStore((s) => s.items);
  const addCategory = useTaskCategoriesStore((s) => s.add);
  const removeCategory = useTaskCategoriesStore((s) => s.remove);
  const [name, setName] = useState("");
  const [color, setColor] = useState(accentColors[0].value);

  function create() {
    if (!name.trim()) return;
    addCategory({ name: name.trim(), color });
    setName("");
    setColor(accentColors[0].value);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Tag className="size-3.5" />
          Catégories
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">Catégories d&apos;agenda</p>

        <div className="flex flex-col gap-0.5">
          {categories.length === 0 && (
            <p className="px-1 py-1 text-xs text-muted-foreground">
              Aucune catégorie — crée &quot;Pro&quot;, &quot;Perso&quot;, &quot;Santé&quot;…
            </p>
          )}
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2 rounded-lg px-1 py-1">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
              <span className="min-w-0 flex-1 truncate text-sm">{c.name}</span>
              <button
                onClick={() => removeCategory(c.id)}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-1.5 border-t border-border/60 pt-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            placeholder="Nouvelle catégorie…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-1">
            {accentColors.slice(0, 6).map((ac) => (
              <button
                key={ac.value}
                onClick={() => setColor(ac.value)}
                className={cn(
                  "size-4 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-popover transition-transform hover:scale-110",
                  color === ac.value ? "ring-foreground/50" : "ring-transparent"
                )}
                style={{ background: ac.value }}
              />
            ))}
          </div>
          <button
            onClick={create}
            disabled={!name.trim()}
            className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
