"use client";

import { useMemo } from "react";
import { Lightbulb, StickyNote } from "lucide-react";
import { GreetingHeader } from "@/components/home/greeting-header";
import { SpotlightCard } from "@/components/home/spotlight-card";
import { SectionCard } from "@/components/home/section-card";
import { TaskRow } from "@/components/shared/task-row";
import { ProjectCard } from "@/components/projects/project-card";
import { GoalCard } from "@/components/goals/goal-card";
import { computeSpotlight } from "@/lib/home-intelligence";
import { useTasksStore } from "@/lib/store/tasks";
import { useProjectsStore } from "@/lib/store/projects";
import { useGoalsStore, useMilestonesStore } from "@/lib/store/goals";
import { useNotesStore } from "@/lib/store/notes";
import { usePreferencesStore } from "@/lib/store/preferences";

export default function HomePage() {
  const firstName = usePreferencesStore((s) => s.preferences.first_name);

  const tasks = useTasksStore((s) => s.items);
  const updateTask = useTasksStore((s) => s.update);
  const projects = useProjectsStore((s) => s.items);
  const goals = useGoalsStore((s) => s.items);
  const milestones = useMilestonesStore((s) => s.items);
  const notes = useNotesStore((s) => s.items);

  const spotlight = useMemo(
    () => computeSpotlight(tasks, projects, goals, milestones),
    [tasks, projects, goals, milestones]
  );

  const priorityTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status === "todo")
        .sort((a, b) => a.priority.localeCompare(b.priority))
        .slice(0, 5),
    [tasks]
  );

  const activeProjects = useMemo(
    () => projects.filter((p) => p.status === "active" || p.status === "planning").slice(0, 3),
    [projects]
  );

  const recentGoals = goals.slice(0, 2);
  const recentNotes = notes.slice(-3).reverse();

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, {
      status: task.status === "done" ? "todo" : "done",
      completed_at: task.status === "done" ? undefined : new Date().toISOString(),
    });
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <GreetingHeader firstName={firstName} />

      <SpotlightCard content={spotlight} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Priorités" href="/calendar" empty={priorityTasks.length === 0}>
            <div className="flex flex-col">
              {priorityTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Notes & idées" href="/creative" empty={recentNotes.length === 0}>
          <div className="flex flex-col gap-3">
            {recentNotes.map((note) => (
              <div key={note.id} className="flex items-start gap-2 px-1 text-sm">
                {note.type === "idea" ? (
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                ) : (
                  <StickyNote className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="line-clamp-2 text-foreground/80">{note.content}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Projets actifs" href="/projects" empty={activeProjects.length === 0}>
          <div className="grid gap-3 sm:grid-cols-2">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Objectifs" href="/goals" empty={recentGoals.length === 0}>
          <div className="grid gap-3 sm:grid-cols-2">
            {recentGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </SectionCard>
      </div>

      {tasks.length === 0 && projects.length === 0 && goals.length === 0 && (
        <p className="px-1 text-center text-sm text-muted-foreground">
          Utilise la capture rapide (bouton +) pour commencer à remplir ton espace.
        </p>
      )}
    </div>
  );
}
