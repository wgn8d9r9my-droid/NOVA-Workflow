"use client";

import { useMemo, useState } from "react";
import { format, isSameMonth, isToday, addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HabitFieldsEditor } from "@/components/habits/habit-fields-editor";
import { cn } from "@/lib/utils";
import { useHabitsStore, useHabitEntriesStore } from "@/lib/store/habits";
import { monthGrid, toDateKey, currentStreak, weekCount } from "@/lib/habit-derived";
import type { Habit, HabitField } from "@/types/entities";

const colors = ["#104090", "#5b3ec9", "#0f7a52", "#a8590f", "#c0316b"];

export function HabitDetailSheet({
  habitId,
  onOpenChange,
}: {
  habitId: string | null;
  onOpenChange: (v: boolean) => void;
}) {
  const habit = useHabitsStore((s) => s.items.find((h) => h.id === habitId));

  return (
    <Sheet open={!!habitId} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg gap-0 overflow-y-auto p-5">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Modifier l&apos;habitude</SheetTitle>
        </SheetHeader>
        {habit && <HabitDetailForm key={habit.id} habit={habit} onDeleted={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  );
}

function HabitDetailForm({ habit, onDeleted }: { habit: Habit; onDeleted: () => void }) {
  const updateHabit = useHabitsStore((s) => s.update);
  const removeHabit = useHabitsStore((s) => s.remove);
  const allEntries = useHabitEntriesStore((s) => s.items);
  const addEntry = useHabitEntriesStore((s) => s.add);
  const updateEntry = useHabitEntriesStore((s) => s.update);

  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const entries = useMemo(() => allEntries.filter((e) => e.habit_id === habit.id), [allEntries, habit.id]);
  const streak = currentStreak(allEntries, habit.id);
  const week = weekCount(allEntries, habit.id);
  const days = useMemo(() => monthGrid(month), [month]);

  const selectedEntry = selectedDate ? entries.find((e) => e.date === selectedDate) : undefined;

  function selectDay(date: Date) {
    if (date > new Date()) return;
    setSelectedDate(toDateKey(date));
  }

  function toggleSelectedDone() {
    if (!selectedDate) return;
    if (selectedEntry) {
      updateEntry(selectedEntry.id, { done: !selectedEntry.done });
    } else {
      addEntry({ habit_id: habit.id, date: selectedDate, done: true, values: {} });
    }
  }

  function setFieldValue(fieldId: string, value: string) {
    if (!selectedDate) return;
    if (selectedEntry) {
      updateEntry(selectedEntry.id, { values: { ...selectedEntry.values, [fieldId]: value } });
    } else {
      addEntry({ habit_id: habit.id, date: selectedDate, done: true, values: { [fieldId]: value } });
    }
  }

  const recentFilled = [...entries]
    .filter((e) => e.done)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  return (
    <div className="mt-4 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <Input
          defaultValue={habit.name}
          onBlur={(e) => e.target.value.trim() && updateHabit(habit.id, { name: e.target.value.trim() })}
          className="border-none px-0 text-lg font-semibold shadow-none focus-visible:ring-0"
        />
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => {
            removeHabit(habit.id);
            onDeleted();
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{streak} jour{streak > 1 ? "s" : ""} de suite</span>
        <span>{week} / {habit.target_frequency} cette semaine</span>
      </div>

      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => updateHabit(habit.id, { color: c })}
            className={cn(
              "size-6 rounded-full ring-2 ring-offset-2 ring-offset-popover transition-transform hover:scale-105",
              habit.color === c ? "ring-foreground/40" : "ring-transparent"
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium capitalize">{format(month, "MMMM yyyy", { locale: fr })}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="icon-sm" onClick={() => setMonth((m) => addMonths(m, -1))}>
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon-sm" onClick={() => setMonth((m) => addMonths(m, 1))}>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = toDateKey(day);
            const entry = entries.find((e) => e.date === key);
            const done = entry?.done;
            const future = day > new Date();
            return (
              <button
                key={key}
                disabled={future}
                onClick={() => selectDay(day)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-xs transition-colors disabled:opacity-30",
                  !isSameMonth(day, month) && "opacity-30",
                  selectedDate === key && "ring-2 ring-primary",
                  isToday(day) && "font-semibold"
                )}
                style={{ backgroundColor: done ? habit.color : "var(--muted)", color: done ? "white" : undefined }}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="rounded-2xl border border-border/60 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {format(new Date(selectedDate), "EEEE d MMMM", { locale: fr })}
            </p>
            <button
              onClick={toggleSelectedDone}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                selectedEntry?.done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
            >
              {selectedEntry?.done ? "Fait ✓" : "Marquer fait"}
            </button>
          </div>

          {habit.fields.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {habit.fields.map((field) => (
                <HabitFieldInput
                  key={field.id}
                  field={field}
                  value={selectedEntry?.values?.[field.id] ?? ""}
                  onChange={(v) => setFieldValue(field.id, v)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Champs personnalisés</p>
        <HabitFieldsEditor
          fields={habit.fields}
          onChange={(fields) => updateHabit(habit.id, { fields })}
        />
      </div>

      {recentFilled.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Historique récent</p>
          <div className="flex flex-col gap-1.5">
            {recentFilled.map((e) => (
              <div key={e.id} className="rounded-xl border border-border/60 px-3 py-2 text-xs">
                <span className="font-medium">{format(new Date(e.date), "d MMM", { locale: fr })}</span>
                {habit.fields.length > 0 && (
                  <span className="ml-2 text-muted-foreground">
                    {habit.fields
                      .filter((f) => e.values?.[f.id])
                      .map((f) => `${f.label}: ${e.values[f.id]}`)
                      .join(" · ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HabitFieldInput({
  field,
  value,
  onChange,
}: {
  field: HabitField;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === "select") {
    return (
      <div className="flex items-center gap-2">
        <span className="w-24 shrink-0 text-xs text-muted-foreground">{field.label}</span>
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger size="sm" className="flex-1">
            <SelectValue placeholder="Choisir…" />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{field.label}</span>
      <Input
        autoComplete="off"
        type={field.type === "number" ? "number" : "text"}
        defaultValue={value}
        onBlur={(e) => onChange(e.target.value)}
        className="h-8 flex-1 text-sm"
      />
    </div>
  );
}
