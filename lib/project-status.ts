import type { ProjectStatus } from "@/types/entities";

export const projectStatusMeta: Record<ProjectStatus, { label: string; className: string }> = {
  idea: { label: "Idée", className: "bg-muted text-muted-foreground" },
  planning: { label: "Planification", className: "bg-accent text-accent-foreground" },
  active: { label: "Actif", className: "bg-primary/10 text-primary" },
  paused: { label: "En pause", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  completed: { label: "Terminé", className: "bg-positive/10 text-positive" },
  archived: { label: "Archivé", className: "bg-muted text-muted-foreground/60" },
};

export const projectStatusOrder: ProjectStatus[] = [
  "idea",
  "planning",
  "active",
  "paused",
  "completed",
  "archived",
];
