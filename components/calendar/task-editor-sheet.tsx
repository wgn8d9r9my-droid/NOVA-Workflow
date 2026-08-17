"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, Trash2, X } from "lucide-react";
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

  return (
        <div className="mt-4 flex flex-col gap-5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title.trim() && updateTask(task.id, { title: title.trim() })}
            className="border-none px-0 text-lg font-medium shadow-none focus-visible:ring-0"
          />

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
