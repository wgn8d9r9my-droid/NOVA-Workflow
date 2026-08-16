import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, type LucideIcon } from "lucide-react";

export interface WeatherInfo {
  temperature: number;
  label: string;
  icon: LucideIcon;
}

function describeCode(code: number): { label: string; icon: LucideIcon } {
  if (code === 0) return { label: "Ciel dégagé", icon: Sun };
  if ([1, 2].includes(code)) return { label: "Plutôt clair", icon: Sun };
  if (code === 3) return { label: "Nuageux", icon: Cloud };
  if ([45, 48].includes(code)) return { label: "Brumeux", icon: CloudFog };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code))
    return { label: "Pluvieux", icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Neigeux", icon: CloudSnow };
  if ([95, 96, 99].includes(code)) return { label: "Orageux", icon: CloudLightning };
  return { label: "Variable", icon: Cloud };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherInfo | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const { label, icon } = describeCode(data.current.weather_code);
    return { temperature: Math.round(data.current.temperature_2m), label, icon };
  } catch {
    return null;
  }
}
