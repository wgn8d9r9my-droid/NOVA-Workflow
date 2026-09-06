"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { usePreferencesStore } from "@/lib/store/preferences";
import { accentColors } from "@/lib/accent-colors";

const ACCENT_PROPERTIES = ["--primary", "--sidebar-primary", "--accent-foreground", "--glow", "--ring", "--sidebar-ring"];

export function ApplyPreferences() {
  const accentColor = usePreferencesStore((s) => s.preferences.accent_color);
  const density = usePreferencesStore((s) => s.preferences.density);
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  useEffect(() => {
    const root = document.documentElement.style;

    // "Passion" ships its own fixed rose accent baked into the .passion CSS
    // class — clear any inline override so it isn't fought by the user's
    // global accent-color preference (inline styles always win over it).
    if (currentTheme === "passion") {
      for (const prop of ACCENT_PROPERTIES) root.removeProperty(prop);
      return;
    }

    const preset = accentColors.find((c) => c.value === accentColor);
    root.setProperty("--primary", accentColor);
    root.setProperty("--sidebar-primary", accentColor);
    root.setProperty("--accent-foreground", accentColor);
    if (preset) {
      root.setProperty("--glow", preset.glow);
      root.setProperty("--ring", preset.glow);
      root.setProperty("--sidebar-ring", preset.glow);
    }
  }, [accentColor, currentTheme]);

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  return null;
}
