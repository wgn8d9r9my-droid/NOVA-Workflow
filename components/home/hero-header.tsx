"use client";

import { Clock, CalendarDays } from "lucide-react";
import { useWeather } from "@/hooks/use-weather";
import { useNow } from "@/hooks/use-now";

function getGreeting(hour: number) {
  if (hour < 5) return "Bonne nuit";
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

function InfoPill({
  icon: Icon,
  primary,
  secondary,
}: {
  icon: typeof Clock;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="glass shadow-soft flex items-center gap-2.5 rounded-2xl px-3.5 py-2">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="leading-tight">
        <p className="text-sm font-medium capitalize">{primary}</p>
        <p className="text-xs capitalize text-muted-foreground">{secondary}</p>
      </div>
    </div>
  );
}

export function HeroHeader({ firstName }: { firstName: string }) {
  const weather = useWeather();
  const now = useNow();

  const dateLabel = now?.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const dayLabel = now?.toLocaleDateString("fr-FR", { weekday: "long" });
  const timeLabel = now?.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-4xl font-semibold leading-tight tracking-tight sm:text-[2.75rem]">
          {getGreeting(now?.getHours() ?? 12)}, {firstName || "toi"}
          <span className="text-primary">.</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Concentre-toi. Crée. Élève ton niveau.</p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {now && <InfoPill icon={Clock} primary={timeLabel!} secondary="Heure locale" />}
        {weather && (
          <InfoPill
            icon={weather.icon}
            primary={`${weather.temperature}°`}
            secondary={weather.label}
          />
        )}
        {now && <InfoPill icon={CalendarDays} primary={dayLabel!} secondary={dateLabel!} />}
      </div>
    </div>
  );
}
