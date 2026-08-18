"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, MapPin, Users, Check, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import { useProjectsStore } from "@/lib/store/projects";
import { CategoryPicker } from "@/components/calendar/category-picker";
import { accentColors } from "@/lib/accent-colors";
import type { Priority, Task } from "@/types/entities";

export function TaskEditorSheet({
  taskId,
  onOpenChange,
}: {
  taskId: string | null;
  onOpenChange: (v: boolean) => void;
}) {
  const task = useTasksStore((s) => s.items.find((t) => t.id === taskId));

  return (
    <Sheet open={!!taskId} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 p-5">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Modifier la tâche</SheetTitle>
        </SheetHeader>
        {task && <TaskEditorForm key={task.id} task={task} onDeleted={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  );
}

function TaskEditorForm({ task, onDeleted }: { task: Task; onDeleted: () => void }) {
  const updateTask = useTasksStore((s) => s.update);
  const removeTask = useTasksStore((s) => s.remove);
  const projects = useProjectsStore((s) => s.items);

  const [title, setTitle] = useState(task.title);
  const [tagsInput, setTagsInput] = useState(task.tags.join(", "));
  const [location, setLocation] = useState(task.location ?? "");
  const [attendees, setAttendees] = useState(task.attendees ?? "");

  return (
        <div className="mt-4 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateTask(task.id, {
                  status: task.status === "done" ? "todo" : "done",
                  completed_at: task.status === "done" ? undefined : new Date().toISOString(),
                })
              }
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                task.status === "done" ? "border-primary bg-primary" : "border-border hover:border-primary/60"
              )}
            >
              {task.status === "done" && <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />}
            </button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => title.trim() && updateTask(task.id, { title: title.trim() })}
              className={cn(
                "border-none px-0 text-lg font-medium shadow-none focus-visible:ring-0",
                task.status === "done" && "text-muted-foreground line-through"
              )}
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Priorité</p>
            <div className="flex gap-1.5">
              {(["P1", "P2", "P3"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => updateTask(task.id, { priority: p })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    task.priority === p
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Échéance</p>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <CalendarIcon className="size-3.5" />
                    {task.due_date
                      ? format(new Date(task.due_date), "d MMM yyyy", { locale: fr })
                      : "Définir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    locale={fr}
                    selected={task.due_date ? new Date(task.due_date) : undefined}
                    onSelect={(date) =>
                      updateTask(task.id, {
                        due_date: date ? format(date, "yyyy-MM-dd") : undefined,
                      })
                    }
                  />
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1.5">
                <Clock className="size-3.5 text-muted-foreground" />
                <input
                  type="time"
                  value={task.due_time ?? ""}
                  onChange={(e) => updateTask(task.id, { due_time: e.target.value || undefined })}
                  className="w-[70px] bg-transparent text-sm text-foreground outline-none"
                />
              </div>

              {task.due_date && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    updateTask(task.id, { due_date: undefined, due_time: undefined, end_time: undefined })
                  }
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>

            {task.due_time && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">jusqu&apos;à</span>
                <div className="flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1.5">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <input
                    type="time"
                    value={task.end_time ?? ""}
                    onChange={(e) => updateTask(task.id, { end_time: e.target.value || undefined })}
                    className="w-[70px] bg-transparent text-sm text-foreground outline-none"
                  />
                </div>
                {task.end_time && (
                  <Button variant="ghost" size="icon-sm" onClick={() => updateTask(task.id, { end_time: undefined })}>
                    <X className="size-3.5" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Catégorie</p>
            <CategoryPicker
              value={task.category_id}
              onChange={(id) => updateTask(task.id, { category_id: id })}
              allowCreate
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Lieu</p>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
              <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={() => updateTask(task.id, { location: location.trim() || undefined })}
                placeholder="Ex : Salle 204, Zoom…"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Personnes</p>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
              <Users className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                onBlur={() => updateTask(task.id, { attendees: attendees.trim() || undefined })}
                placeholder="Ex : Léa, M. Dupont…"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Couleur de l&apos;évènement</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => updateTask(task.id, { color: undefined })}
                title="Automatique"
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-dashed text-muted-foreground transition-colors",
                  !task.color ? "border-foreground/50 text-foreground" : "border-border/60 hover:border-foreground/40"
                )}
              >
                <X className="size-3" />
              </button>
              {accentColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateTask(task.id, { color: c.value })}
                  title={c.name}
                  className={cn(
                    "size-6 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-105",
                    task.color === c.value ? "ring-foreground/50" : "ring-transparent"
                  )}
                  style={{ background: c.value }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Projet</p>
            <Select
              value={task.project_id ?? "none"}
              onValueChange={(v) => updateTask(task.id, { project_id: v === "none" ? undefined : v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun projet</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Tags</p>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onBlur={() =>
                updateTask(task.id, {
                  tags: tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              placeholder="tag1, tag2…"
            />
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="mt-2 w-fit gap-1.5"
            onClick={() => {
              removeTask(task.id);
              onDeleted();
            }}
          >
            <Trash2 className="size-3.5" />
            Supprimer la tâche
          </Button>
        </div>
  );
}
