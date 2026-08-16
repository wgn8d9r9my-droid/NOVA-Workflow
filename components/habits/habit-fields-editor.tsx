"use client";

import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HabitField, HabitFieldType } from "@/types/entities";

const TYPE_LABEL: Record<HabitFieldType, string> = {
  select: "Choix",
  text: "Texte",
  number: "Nombre",
};

export function HabitFieldsEditor({
  fields,
  onChange,
}: {
  fields: HabitField[];
  onChange: (fields: HabitField[]) => void;
}) {
  function addField() {
    onChange([...fields, { id: crypto.randomUUID(), label: "", type: "text" }]);
  }

  function updateField(id: string, patch: Partial<HabitField>) {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function removeField(id: string) {
    onChange(fields.filter((f) => f.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1.5 rounded-xl border border-border/60 p-2">
          <div className="flex items-center gap-1.5">
            <Input
              autoComplete="off"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              placeholder="Nom du champ (ex. Type, Durée…)"
              className="h-7 flex-1 text-xs"
            />
            <Select
              value={field.type}
              onValueChange={(v) => updateField(field.id, { type: v as HabitFieldType })}
            >
              <SelectTrigger size="sm" className="h-7 w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TYPE_LABEL) as HabitFieldType[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {TYPE_LABEL[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={() => removeField(field.id)} className="text-muted-foreground hover:text-destructive">
              <X className="size-3.5" />
            </button>
          </div>
          {field.type === "select" && (
            <Input
              autoComplete="off"
              value={field.options?.join(", ") ?? ""}
              onChange={(e) =>
                updateField(field.id, {
                  options: e.target.value
                    .split(",")
                    .map((o) => o.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Options séparées par des virgules (ex. Bras, Jambes, Abdos)"
              className="h-7 text-xs"
            />
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={addField}>
        <Plus className="size-3.5" /> Ajouter un champ
      </Button>
    </div>
  );
}
