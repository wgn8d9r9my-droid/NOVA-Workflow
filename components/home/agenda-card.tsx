import { WidgetCard } from "@/components/home/widget-card";
import type { Task } from "@/types/entities";

const PALETTE = ["#104090", "#7793ed", "#2e5cb8", "#a9bbf5", "#4a6cc4"];

function colorFor(seed: string, override?: string) {
  if (override) return override;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function AgendaCard({
  tasks,
  projectName,
  projectColor,
}: {
  tasks: Task[];
  projectName: (id?: string) => string | undefined;
  projectColor: (id?: string) => string | undefined;
}) {
  return (
    <WidgetCard
      title="Agenda du jour"
      href="/calendar"
      empty={tasks.length === 0}
      emptyLabel="Rien de programmé aujourd'hui."
    >
      <div className="flex flex-col gap-3">
        {tasks.map((task) => {
          const color = colorFor(task.id, projectColor(task.project_id));
          return (
            <div key={task.id} className="flex items-start gap-3">
              <div className="flex w-11 shrink-0 flex-col items-end pt-0.5">
                <span className="text-xs font-medium tabular-nums">{task.due_time}</span>
              </div>
              <span className="mt-0.5 h-full min-h-[32px] w-[3px] shrink-0 rounded-full" style={{ background: color }} />
              <div className="min-w-0 flex-1 pb-0.5">
                <p className="truncate text-[13px] font-medium leading-tight">{task.title}</p>
                {projectName(task.project_id) && (
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {projectName(task.project_id)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
