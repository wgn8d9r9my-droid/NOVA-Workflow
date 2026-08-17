"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, CalendarIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusSelect } from "@/components/projects/status-select";
import { TaskRow } from "@/components/shared/task-row";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useProjectsStore, useProjectFoldersStore } from "@/lib/store/projects";
import { useTasksStore } from "@/lib/store/tasks";
import { useNotesStore } from "@/lib/store/notes";
import { useClientsStore } from "@/lib/store/finances";
import { EmojiPicker } from "@/components/shared/emoji-picker";
import { projectColors } from "@/lib/project-colors";
import { cn } from "@/lib/utils";
import type { ProjectStatus, ProjectType } from "@/types/entities";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const project = useProjectsStore((s) => s.items.find((p) => p.id === id));
  const updateProject = useProjectsStore((s) => s.update);
  const removeProject = useProjectsStore((s) => s.remove);

  const allTasks = useTasksStore((s) => s.items);
  const addTask = useTasksStore((s) => s.add);
  const updateTask = useTasksStore((s) => s.update);
  const tasks = useMemo(() => allTasks.filter((t) => t.project_id === id), [allTasks, id]);

  const allNotes = useNotesStore((s) => s.items);
  const addNote = useNotesStore((s) => s.add);
  const notes = useMemo(() => allNotes.filter((n) => n.project_id === id), [allNotes, id]);

  const clients = useClientsStore((s) => s.items);
  const folders = useProjectFoldersStore((s) => s.items);

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [newTask, setNewTask] = useState("");
  const [newNote, setNewNote] = useState("");

  if (!project) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-muted-foreground">Projet introuvable.</p>
        <Link href="/projects" className="text-sm text-primary hover:underline">
          Retour aux projets
        </Link>
      </div>
    );
  }

  const computedProgress =
    tasks.length === 0
      ? 0
      : Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100);
  const isManualProgress = project.progress_override != null;
  const progress = isManualProgress ? project.progress_override! : computedProgress;

  function toggleTask(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    updateTask(taskId, {
      status: task.status === "done" ? "todo" : "done",
      completed_at: task.status === "done" ? undefined : new Date().toISOString(),
    });
  }

  const projectId = project.id;

  function submitTask() {
    if (!newTask.trim()) return;
    addTask({ title: newTask.trim(), priority: "P2", status: "todo", tags: [], project_id: projectId });
    setNewTask("");
  }

  function submitNote() {
    if (!newNote.trim()) return;
    addNote({ content: newNote.trim(), type: "note", tags: [], project_id: projectId });
    setNewNote("");
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <Link href="/projects" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Projects
      </Link>

      <div className="flex flex-col gap-4">
        {project.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_image}
            alt=""
            className="h-32 w-full rounded-2xl object-cover"
          />
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex size-9 shrink-0 items-center justify-center rounded-xl text-xl hover:bg-muted">
                  {project.emoji ?? "🗂️"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <EmojiPicker value={project.emoji} onChange={(e) => updateProject(project.id, { emoji: e })} />
              </PopoverContent>
            </Popover>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => name.trim() && updateProject(project.id, { name: name.trim() })}
              className="border-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => {
              removeProject(project.id);
              router.push("/projects");
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusSelect
            value={project.status}
            onChange={(s: ProjectStatus) => updateProject(project.id, { status: s })}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarIcon className="size-3.5" />
                {project.deadline
                  ? format(new Date(project.deadline), "d MMM yyyy", { locale: fr })
                  : "Échéance"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                locale={fr}
                selected={project.deadline ? new Date(project.deadline) : undefined}
                onSelect={(date) =>
                  updateProject(project.id, { deadline: date ? format(date, "yyyy-MM-dd") : undefined })
                }
              />
            </PopoverContent>
          </Popover>

          <Input
            type="number"
            placeholder="Budget (€)"
            defaultValue={project.budget}
            onBlur={(e) =>
              updateProject(project.id, { budget: e.target.value ? Number(e.target.value) : undefined })
            }
            className="h-8 w-32"
          />

          <Select
            value={project.type}
            onValueChange={(v) =>
              updateProject(project.id, { type: v as ProjectType, client_id: v === "personal" ? undefined : project.client_id })
            }
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personnel</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>

          {project.type === "client" && (
            <Select
              value={project.client_id ?? "none"}
              onValueChange={(v) => updateProject(project.id, { client_id: v === "none" ? undefined : v })}
            >
              <SelectTrigger size="sm" className="w-40">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun client</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {folders.length > 0 && (
            <Select
              value={project.folder_id ?? "none"}
              onValueChange={(v) => updateProject(project.id, { folder_id: v === "none" ? undefined : v })}
            >
              <SelectTrigger size="sm" className="w-40">
                <SelectValue placeholder="Dossier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun dossier</SelectItem>
                {folders.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.emoji ? `${f.emoji} ` : ""}
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            {projectColors.map((c) => (
              <button
                key={c}
                onClick={() =>
                  updateProject(project.id, { color: project.color === c ? undefined : c })
                }
                className={cn(
                  "size-5 rounded-full ring-2 ring-offset-1 ring-offset-background transition-transform hover:scale-110",
                  project.color === c ? "ring-foreground/40" : "ring-transparent"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => updateProject(project.id, { description: description.trim() || undefined })}
          placeholder="Description du projet…"
          rows={3}
          className="resize-none border-none px-0 shadow-none focus-visible:ring-0"
        />

        <Input
          autoComplete="off"
          defaultValue={project.cover_image}
          onBlur={(e) => updateProject(project.id, { cover_image: e.target.value.trim() || undefined })}
          placeholder="URL d'une image de couverture (optionnel)"
          className="h-8 text-xs"
        />

        <div>
          <div className="flex items-center gap-3">
            <Slider
              value={[progress]}
              max={100}
              step={5}
              onValueChange={([v]) => updateProject(project.id, { progress_override: v })}
              className="flex-1"
            />
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {progress}%
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {isManualProgress ? (
              <>
                <span>Progression manuelle</span>
                <button
                  onClick={() => updateProject(project.id, { progress_override: undefined })}
                  className="flex items-center gap-0.5 text-primary hover:underline"
                >
                  <RotateCcw className="size-2.5" /> Revenir au calcul automatique
                </button>
              </>
            ) : (
              <span>Calculée depuis {tasks.length} tâche{tasks.length > 1 ? "s" : ""} liée{tasks.length > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">Tâches</p>
          <div className="glass shadow-soft flex flex-col gap-1 rounded-2xl p-2">
            <div className="flex items-center gap-2 px-1 py-1">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitTask()}
                placeholder="Ajouter une tâche à ce projet…"
                className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
            {tasks.length === 0 ? (
              <p className="px-2 pb-2 text-sm text-muted-foreground">Aucune tâche liée pour l&apos;instant.</p>
            ) : (
              tasks.map((task) => <TaskRow key={task.id} task={task} onToggle={toggleTask} />)
            )}
          </div>
        </div>

        <div>
          <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">Notes</p>
          <div className="flex flex-col gap-2 rounded-2xl border border-border/60 p-3">
            <div className="flex gap-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note…"
                rows={2}
                className="text-sm"
              />
            </div>
            <Button size="sm" variant="secondary" className="w-fit" onClick={submitNote}>
              Ajouter
            </Button>
            {notes.length > 0 && (
              <div className="mt-1 flex flex-col gap-2 border-t border-border/60 pt-2">
                {notes.map((note) => (
                  <p key={note.id} className="text-sm text-foreground/80">
                    {note.content}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
