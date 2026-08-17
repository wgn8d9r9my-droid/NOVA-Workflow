import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SpotlightContent } from "@/lib/home-intelligence";

export function WeekFocusCard({
  content,
  progress,
}: {
  content: SpotlightContent;
  progress: number;
}) {
  return (
    <Link
      href={content.href}
      className="grain shadow-soft group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl p-5 text-white cover-mesh-1"
    >
      <div className="relative z-10 flex items-start justify-between">
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
          Focus de la semaine
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-lg font-semibold leading-snug">{content.title}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-white/70">{content.description}</p>

        <div className="mt-3.5 flex items-center gap-2.5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] font-medium tabular-nums text-white/80">{progress}%</span>
        </div>
      </div>
    </Link>
  );
}
