"use client";

import { useMemo, useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskRow } from "@/components/shared/task-row";
import { motion } from "motion/react";
import { useGoalsStore, useMilestonesStore } from "@/lib/store/goals";
import { useTasksStore } from "@/lib/store/tasks";
import { useProjectsStore } from "@/lib/store/projects";
import { goalProgress } from "@/lib/derived";
import { cn } from "@/lib/utils";

export function GoalDetailSheet({
  goalId,
  onOpenChange,
}: {
  goalId: string | null;
  onOpenChange: (v: boolean) => void;
}) {
  const goal = useGoalsStore((s) => s.items.find((g) => g.id === goalId));
  const updateGoal = useGoalsStore((s) => s.update);
  const removeGoal = useGoalsStore((s) => s.remove);

  const allMilestones = useMilestonesStore((s) => s.items);
  const addMilestone = useMilestonesStore((s) => s.add);
  const updateMilestone = useMilestonesStore((s) => s.update);
  const removeMilestone = useMilestonesStore((s) => s.remove);

  const allTasks = useTasksStore((s) => s.items);
  const addTask = useTasksStore((s) => s.add);
  const updateTask = useTasksStore((s) => s.update);

  const allProjects = useProjectsStore((s) => s.items);
  const updateProject = useProjectsStore((s) => s.update);

  const [newMilestone, setNewMilestone] = useState("");
  const [newTask, setNewTask] = useState("");

  const milestones = useMemo(
    () => (goal ? allMilestones.filter((m) => m.goal_id === goal.id).sort((a, b) => a.order - b.order) : []),
    [allMilestones, goal]
  );
  const tasks = useMemo(
    () => (goal ? allTasks.filter((t) => t.goal_id === goal.id) : []),
    [allTasks, goal]
  );
  const linkedProjects = useMemo(
    () => (goal ? allProjects.filter((p) => p.goal_id === goal.id) : []),
    [allProjects, goal]
  );
  const unlinkedProjects = useMemo(
    () => (goal ? allProjects.filter((p) => p.goal_id !== goal.id) : []),
    [allProjects, goal]
  );

  if (!goal) return null;

  const progress = goalProgress(allMilestones, goal.id);

  function submitMilestone() {
    if (!newMilestone.trim() || !goal) return;
    addMilestone({ goal_id: goal.id, title: newMilestone.trim(), done: false, order: milestones.length });
    setNewMilestone("");
  }

  function submitTask() {
    if (!newTask.trim() || !goal) return;
    addTask({ title: newTask.trim(), priority: "P2", status: "todo", tags: [], goal_id: goal.id });
    setNewTask("");
  }

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, {
      status: task.status === "done" ? "todo" : "done",
      completed_at: task.status === "done" ? undefined : new Date().toISOString(),
    });
  }

  return (
    <Sheet open={!!goalId} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg gap-0 overflow-y-auto p-5">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Modifier l&apos;objectif</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <Input
              defaultValue={goal.title}
              onBlur={(e) => e.target.value.trim() && updateGoal(goal.id, { title: e.target.value.trim() })}
              className="border-none px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => {
                removeGoal(goal.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <Textarea
            defaultValue={goal.description}
            onBlur={(e) => updateGoal(goal.id, { description: e.target.value.trim() || undefined })}
            placeholder="Description de l'objectif…"
            rows={2}
            className="resize-none border-none px-0 shadow-none focus-visible:ring-0"
          />

          <div className="flex items-center gap-3">
            <Select value={goal.period} onValueChange={(v) => updateGoal(goal.id, { period: v as typeof goal.period })}>
              <SelectTrigger size="sm" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Annuel</SelectItem>
                <SelectItem value="quarter">Trimestriel</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              defaultValue={goal.deadline}
              onBlur={(e) => updateGoal(goal.id, { deadline: e.target.value || undefined })}
              className="h-8 w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-1.5" />
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{progress}%</span>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Jalons</p>
            <div className="flex flex-col gap-1 rounded-2xl border border-border/60 p-2">
              <div className="flex items-center gap-2 px-1">
                <Input
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitMilestone()}
                  placeholder="Ajouter un jalon…"
                  className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0"
                />
                <Button variant="ghost" size="icon-sm" onClick={submitMilestone}>
                  <Plus className="size-3.5" />
                </Button>
              </div>
              {milestones.map((m) => (
                <div key={m.id} className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                  <button
                    onClick={() => updateMilestone(m.id, { done: !m.done })}
                    className={cn(
                      "flex size-4.5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      m.done ? "border-primary bg-primary" : "border-border hover:border-primary/60"
                    )}
                  >
                    {m.done && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-2 rounded-full bg-primary-foreground" />
                    )}
                  </button>
                  <span className={cn("flex-1 text-sm", m.done && "text-muted-foreground/60 line-through")}>
                    {m.title}
                  </span>
                  <button
                    onClick={() => removeMilestone(m.id)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Tâches liées</p>
            <div className="flex flex-col gap-1 rounded-2xl border border-border/60 p-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitTask()}
                placeholder="Ajouter une tâche…"
                className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0"
              />
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Projets associés</p>
            <div className="flex flex-col gap-2">
              {linkedProjects.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-sm">
                  {p.name}
                  <button onClick={() => updateProject(p.id, { goal_id: undefined })}>
                    <X className="size-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
              {unlinkedProjects.length > 0 && (
                <Select onValueChange={(v) => updateProject(v, { goal_id: goal.id })}>
                  <SelectTrigger size="sm" className="w-full">
                    <SelectValue placeholder="Associer un projet existant…" />
                  </SelectTrigger>
                  <SelectContent>
                    {unlinkedProjects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
