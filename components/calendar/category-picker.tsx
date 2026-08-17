"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskCategoriesStore } from "@/lib/store/task-categories";
import { accentColors } from "@/lib/accent-colors";

export function CategoryPicker({
  value,
  onChange,
  allowCreate = false,
}: {
  value?: string;
  onChange: (id?: string) => void;
  allowCreate?: boolean;
}) {
  const categories = useTaskCategoriesStore((s) => s.items);
  const addCategory = useTaskCategoriesStore((s) => s.add);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(accentColors[0].value);

  function createCategory() {
    if (!name.trim()) return;
    const category = addCategory({ name: name.trim(), color });
    onChange(category.id);
    setName("");
    setColor(accentColors[0].value);
    setCreating(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(value === c.id ? undefined : c.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
            value === c.id
              ? "border-transparent text-white"
              : "border-border/60 text-muted-foreground hover:bg-muted"
          )}
          style={value === c.id ? { background: c.color } : undefined}
        >
          <span className="size-2 shrink-0 rounded-full" style={{ background: c.color }} />
          {c.name}
        </button>
      ))}

      {allowCreate && !creating && (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 rounded-full border border-dashed border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3" />
          Catégorie
        </button>
      )}

      {allowCreate && creating && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border/60 p-1.5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createCategory()}
            placeholder="Nom (ex: Santé)"
            className="w-28 bg-transparent text-[11px] outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-1">
            {accentColors.slice(0, 8).map((c) => (
              <button
                key={c.value}
                type="button"
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
            type="button"
            onClick={createCategory}
            disabled={!name.trim()}
            className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Check className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}
