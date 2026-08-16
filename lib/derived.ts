import type { Task, Milestone, Project } from "@/types/entities";

export function projectProgress(tasks: Task[], project: Pick<Project, "id" | "progress_override">): number {
  if (project.progress_override != null) return project.progress_override;
  const linked = tasks.filter((t) => t.project_id === project.id);
  if (linked.length === 0) return 0;
  return Math.round((linked.filter((t) => t.status === "done").length / linked.length) * 100);
}

export function goalProgress(milestones: Milestone[], goalId: string): number {
  const linked = milestones.filter((m) => m.goal_id === goalId);
  if (linked.length === 0) return 0;
  return Math.round((linked.filter((m) => m.done).length / linked.length) * 100);
}
