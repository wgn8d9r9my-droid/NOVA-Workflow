"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/lib/store/preferences";
import { accentColors } from "@/lib/accent-colors";

export function ApplyPreferences() {
  const accentColor = usePreferencesStore((s) => s.preferences.accent_color);
  const density = usePreferencesStore((s) => s.preferences.density);

  useEffect(() => {
    const preset = accentColors.find((c) => c.value === accentColor);
    const root = document.documentElement.style;
    root.setProperty("--primary", accentColor);
    root.setProperty("--sidebar-primary", accentColor);
    root.setProperty("--accent-foreground", accentColor);
    if (preset) {
      root.setProperty("--glow", preset.glow);
      root.setProperty("--ring", preset.glow);
      root.setProperty("--sidebar-ring", preset.glow);
    }
  }, [accentColor]);

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  return null;
}
