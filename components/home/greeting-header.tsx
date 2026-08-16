"use client";

import { useWeather } from "@/hooks/use-weather";

function getGreeting(hour: number) {
  if (hour < 5) return "Bonne nuit";
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

export function GreetingHeader({ firstName }: { firstName: string }) {
  const weather = useWeather();
  const now = new Date();

  const date = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm capitalize text-muted-foreground">{date}</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {getGreeting(now.getHours())}, {firstName}
        </h1>
      </div>

      {weather && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <weather.icon className="size-4" />
          <span>
            {weather.temperature}° · {weather.label}
          </span>
        </div>
      )}
    </div>
  );
}
