import Link from "next/link";
import { isToday, isYesterday, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Lightbulb } from "lucide-react";
import { WidgetCard } from "@/components/home/widget-card";
import type { Note } from "@/types/entities";

function relativeDay(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return "Aujourd'hui";
  if (isYesterday(d)) return "Hier";
  return format(d, "d MMM", { locale: fr });
}

export function IdeasCard({ ideas }: { ideas: Note[] }) {
  return (
    <WidgetCard title="Idées récentes" href="/creative" empty={ideas.length === 0}>
      <div className="flex flex-col gap-2.5">
        {ideas.map((idea) => (
          <Link
            key={idea.id}
            href="/creative"
            className="flex items-start gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
          >
            <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-[13px] text-foreground/85">
              {idea.title || idea.content}
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground">{relativeDay(idea.created_at)}</span>
          </Link>
        ))}
      </div>
    </WidgetCard>
  );
}
