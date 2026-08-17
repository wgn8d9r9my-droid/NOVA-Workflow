import Link from "next/link";
import { coverMesh } from "@/lib/cover-gradients";
import { WidgetCard } from "@/components/home/widget-card";
import type { Project } from "@/types/entities";

export function ProjectsOverviewCard({
  projects,
  progressOf,
}: {
  projects: Project[];
  progressOf: (project: Project) => number;
}) {
  return (
    <WidgetCard title="Projets en cours" badge={projects.length} href="/projects" empty={projects.length === 0}>
      <div className="flex flex-col gap-1">
        {projects.map((project) => {
          const progress = progressOf(project);
          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center gap-2.5 rounded-xl px-1 py-1.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
            >
              <span
                className={`grain flex size-8 shrink-0 items-center justify-center rounded-lg text-sm ${
                  project.color ? "" : coverMesh(project.id)
                }`}
                style={project.color ? { background: project.color } : undefined}
              >
                <span className="relative z-10">{project.emoji ?? "📁"}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{project.name}</p>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-[11px] font-medium tabular-nums text-muted-foreground">
                {progress}%
              </span>
            </Link>
          );
        })}
      </div>
    </WidgetCard>
  );
}
