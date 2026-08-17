"use client";

import { useId } from "react";
import { WidgetCard } from "@/components/home/widget-card";

export function ActivityCard({ data }: { data: { label: string; value: number }[] }) {
  const gradientId = useId();
  const max = Math.max(1, ...data.map((d) => d.value));
  const width = 260;
  const height = 64;
  const step = data.length > 1 ? width / (data.length - 1) : width;

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - (d.value / max) * (height - 8) - 4;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <WidgetCard title="Activité" href="/calendar" hrefLabel="Cette semaine">
      <div className="mb-2 flex items-baseline gap-1.5">
        <span className="text-xl font-semibold tabular-nums">{total}</span>
        <span className="text-xs text-muted-foreground">tâches terminées</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="mt-1.5 flex justify-between">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] uppercase text-muted-foreground">
            {d.label}
          </span>
        ))}
      </div>
    </WidgetCard>
  );
}
