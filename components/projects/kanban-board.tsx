"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { StatusSelect } from "@/components/projects/status-select";
import { useProjectsStore } from "@/lib/store/projects";
import { useTasksStore } from "@/lib/store/tasks";
import { projectProgress } from "@/lib/derived";
import { projectStatusMeta, projectStatusOrder } from "@/lib/project-status";
import type { Project, ProjectStatus } from "@/types/entities";

export function KanbanBoard({ projects }: { projects: Project[] }) {
  const updateProject = useProjectsStore((s) => s.update);
  const tasks = useTasksStore((s) => s.items);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {projectStatusOrder.map((status) => {
        const columnProjects = projects.filter((p) => p.status === status);
        return (
          <div key={status} className="w-64 shrink-0">
            <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">
              {projectStatusMeta[status].label} · {columnProjects.length}
            </p>
            <div className="flex flex-col gap-2">
              {columnProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-border/60 bg-card p-3 shadow-soft"
                >
                  <Link href={`/projects/${project.id}`} className="line-clamp-2 text-sm font-medium hover:text-primary">
                    {project.name}
                  </Link>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={projectProgress(tasks, project)} className="h-1.5" />
                  </div>
                  <div className="mt-2.5">
                    <StatusSelect
                      value={project.status}
                      onChange={(s: ProjectStatus) => updateProject(project.id, { status: s })}
                    />
                  </div>
                </div>
              ))}
              {columnProjects.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                  Vide
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
