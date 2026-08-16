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

export function ProjectCard({ project }: { project: Project }) {
  const tasks = useTasksStore((s) => s.items);
  const progress = projectProgress(tasks, project);
  const status = projectStatusMeta[project.status];

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-float"
      style={project.color ? { borderTopColor: project.color, borderTopWidth: 3 } : undefined}
    >
      {project.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.cover_image} alt="" className="h-24 w-full object-cover" />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-1 flex items-center gap-1.5 text-sm font-medium">
            {project.emoji && <span>{project.emoji}</span>}
            {project.name}
          </h4>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
              status.className
            )}
          >
            {status.label}
          </span>
        </div>

        {project.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <Progress value={progress} className="h-1.5" />
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{progress}%</span>
        </div>

        {project.deadline && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Échéance {format(new Date(project.deadline), "d MMM", { locale: fr })}
          </p>
        )}
      </div>
    </Link>
  );
}
