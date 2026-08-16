"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { useTasksStore } from "@/lib/store/tasks";
import { projectProgress } from "@/lib/derived";
import { projectStatusMeta } from "@/lib/project-status";
import type { Project } from "@/types/entities";
import { cn } from "@/lib/utils";

export function ProjectList({ projects }: { projects: Project[] }) {
  const tasks = useTasksStore((s) => s.items);

  return (
    <div className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card">
      {projects.map((project) => {
        const status = projectStatusMeta[project.status];
        const progress = projectProgress(tasks, project);
        return (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{project.name}</span>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", status.className)}>
              {status.label}
            </span>
            <div className="hidden w-28 shrink-0 items-center gap-2 sm:flex">
              <Progress value={progress} className="h-1.5" />
              <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                {progress}%
              </span>
            </div>
            <span className="hidden w-20 shrink-0 text-right text-xs text-muted-foreground md:inline">
              {project.deadline ? format(new Date(project.deadline), "d MMM", { locale: fr }) : "—"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
