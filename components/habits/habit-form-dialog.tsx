"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useHabitsStore } from "@/lib/store/habits";
import { HabitFieldsEditor } from "@/components/habits/habit-fields-editor";
import type { HabitField } from "@/types/entities";

const colors = ["#104090", "#5b3ec9", "#0f7a52", "#a8590f", "#c0316b"];

export function HabitFormDialog({ trigger }: { trigger: ReactNode }) {
  const addHabit = useHabitsStore((s) => s.add);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [frequency, setFrequency] = useState(7);
  const [fields, setFields] = useState<HabitField[]>([]);

  function reset() {
    setName("");
    setColor(colors[0]);
    setFrequency(7);
    setFields([]);
  }

  function submit() {
    if (!name.trim()) return;
    addHabit({
      name: name.trim(),
      color,
      target_frequency: frequency,
      fields: fields.filter((f) => f.label.trim()),
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle habitude</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            autoFocus
            autoComplete="off"
            placeholder="Ex. Sport, Lecture, Méditation…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Couleur</p>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "size-7 rounded-full ring-2 ring-offset-2 ring-offset-popover transition-transform hover:scale-105",
                    color === c ? "ring-foreground/40" : "ring-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Objectif : {frequency}x / semaine
            </p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  onClick={() => setFrequency(n)}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                    frequency === n
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Champs personnalisés (optionnel)
            </p>
            <HabitFieldsEditor fields={fields} onChange={setFields} />
          </div>

          <Button onClick={submit} disabled={!name.trim()} className="mt-1">
            Créer l&apos;habitude
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
