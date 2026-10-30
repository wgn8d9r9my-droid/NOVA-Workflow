"use client";

import { useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Check, Clock, Plus, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTodosStore, useTodoListsStore } from "@/lib/store/todos";
import { accentColors } from "@/lib/accent-colors";
import { PRIORITY_LABEL, dateKey } from "@/lib/todo-derived";
import type { Priority, Subtask, TodoItem } from "@/types/entities";

export function TodoEditorSheet({
  todoId,
  onOpenChange,
}: {
  todoId: string | null;
  onOpenChange: (v: boolean) => void;
}) {
  const todo = useTodosStore((s) => s.items.find((t) => t.id === todoId));

  return (
    <Sheet open={!!todoId} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-5">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Modifier la tâche</SheetTitle>
        </SheetHeader>
        {todo && <TodoEditorForm key={todo.id} todo={todo} onDeleted={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  );
}

function TodoEditorForm({ todo, onDeleted }: { todo: TodoItem; onDeleted: () => void }) {
  const updateTodo = useTodosStore((s) => s.update);
  const removeTodo = useTodosStore((s) => s.remove);
  const lists = useTodoListsStore((s) => s.items);

  const [title, setTitle] = useState(todo.title);
  const [notes, setNotes] = useState(todo.notes ?? "");
  const [newSubtask, setNewSubtask] = useState("");
  const subtasks: Subtask[] = todo.subtasks ?? [];
  const done = todo.status === "done";

  function setSubtasks(next: Subtask[]) {
    updateTodo(todo.id, { subtasks: next });
  }

  function addSubtask() {
    const t = newSubtask.trim();
    if (!t) return;
    setSubtasks([...subtasks, { id: crypto.randomUUID(), title: t, done: false }]);
    setNewSubtask("");
  }

  const quickDates = [
    { label: "Aujourd'hui", value: dateKey(new Date()) },
    { label: "Demain", value: dateKey(addDays(new Date(), 1)) },
    { label: "Dans 1 semaine", value: dateKey(addDays(new Date(), 7)) },
  ];

  return (
    <div className="mt-4 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            updateTodo(todo.id, {
              status: done ? "todo" : "done",
              completed_at: done ? undefined : new Date().toISOString(),
            })
          }
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            !todo.color && (done ? "border-primary bg-primary" : "border-border hover:border-primary/60")
          )}
          style={todo.color ? { borderColor: todo.color, background: done ? todo.color : "transparent" } : undefined}
        >
          {done && <Check className="size-3.5 text-white" strokeWidth={3} />}
        </button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title.trim() !== todo.title && updateTodo(todo.id, { title: title.trim() })}
          className={cn(
            "border-none px-0 text-lg font-medium shadow-none focus-visible:ring-0",
            done && "text-muted-foreground line-through"
          )}
        />
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => notes.trim() !== (todo.notes ?? "") && updateTodo(todo.id, { notes: notes.trim() || undefined })}
        placeholder="Notes, détails…"
        rows={3}
      />

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Échéance</p>
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarIcon className="size-3.5" />
                {todo.due_date ? format(parseISO(todo.due_date), "d MMM yyyy", { locale: fr }) : "Définir une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                locale={fr}
                selected={todo.due_date ? parseISO(todo.due_date) : undefined}
                onSelect={(d) => updateTodo(todo.id, { due_date: d ? format(d, "yyyy-MM-dd") : undefined })}
              />
            </PopoverContent>
          </Popover>

          {todo.due_date && (
            <div className="flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1.5">
              <Clock className="size-3.5 text-muted-foreground" />
              <input
                type="time"
                value={todo.due_time?.slice(0, 5) ?? ""}
                onChange={(e) => updateTodo(todo.id, { due_time: e.target.value || undefined })}
                className="w-[70px] bg-transparent text-sm text-foreground outline-none"
              />
            </div>
          )}

          {todo.due_date && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Retirer l'échéance"
              onClick={() => updateTodo(todo.id, { due_date: undefined, due_time: undefined })}
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {quickDates.map((q) => (
            <button
              key={q.label}
              onClick={() => updateTodo(todo.id, { due_date: q.value })}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] transition-colors",
                todo.due_date === q.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Priorité</p>
        <div className="flex gap-1.5">
          {(["P1", "P2", "P3"] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => updateTodo(todo.id, { priority: p })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                todo.priority === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
            >
              {PRIORITY_LABEL[p]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Couleur</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => updateTodo(todo.id, { color: undefined })}
            title="Couleur de la liste"
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-dashed text-muted-foreground transition-colors",
              !todo.color ? "border-foreground/50 text-foreground" : "border-border/60 hover:border-foreground/40"
            )}
          >
            <X className="size-3" />
          </button>
          {accentColors.map((c) => (
            <button
              key={c.value}
              onClick={() => updateTodo(todo.id, { color: c.value })}
              title={c.name}
              className={cn(
                "size-6 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-105",
                todo.color === c.value ? "ring-foreground/50" : "ring-transparent"
              )}
              style={{ background: c.value }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Liste</p>
        <Select
          value={todo.list_id && lists.some((l) => l.id === todo.list_id) ? todo.list_id : "none"}
          onValueChange={(v) => updateTodo(todo.id, { list_id: v === "none" ? undefined : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Aucune liste" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune liste</SelectItem>
            {lists.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.emoji ? `${l.emoji} ` : ""}
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Sous-tâches</p>
        <div className="flex flex-col gap-1">
          {subtasks.map((s) => (
            <div key={s.id} className="group flex items-center gap-2 rounded-lg px-1 py-1">
              <button
                onClick={() => setSubtasks(subtasks.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)))}
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                  s.done ? "border-primary bg-primary" : "border-border hover:border-primary/60"
                )}
              >
                {s.done && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
              </button>
              <span className={cn("flex-1 text-sm", s.done && "text-muted-foreground/60 line-through")}>{s.title}</span>
              <button
                onClick={() => setSubtasks(subtasks.filter((x) => x.id !== s.id))}
                aria-label="Supprimer la sous-tâche"
                className="text-muted-foreground/60 transition-colors hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 rounded-lg border border-border/60 px-2.5 py-1.5">
            <Plus className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubtask()}
              placeholder="Ajouter une sous-tâche…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <Button
        variant="destructive"
        size="sm"
        className="mt-2 w-fit gap-1.5"
        onClick={() => {
          removeTodo(todo.id);
          onDeleted();
        }}
      >
        <Trash2 className="size-3.5" />
        Supprimer la tâche
      </Button>
    </div>
  );
}
