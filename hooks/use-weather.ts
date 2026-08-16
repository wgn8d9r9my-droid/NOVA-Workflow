import { useEffect, useState } from "react";
import { fetchWeather, type WeatherInfo } from "@/lib/weather";

export function useWeather() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const result = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
        setWeather(result);
      },
      () => {},
      { timeout: 5000 }
    );
  }, []);

  return weather;
}
