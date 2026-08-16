import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserPreferences } from "@/types/entities";

interface PreferencesState {
  preferences: UserPreferences;
  setPreferences: (patch: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  first_name: "",
  onboarding_done: false,
  accent_color: "#104090",
  density: "comfortable",
  focus_areas: [],
  home_widget_order: ["priority-tasks", "spotlight", "projects", "goals", "habits"],
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      setPreferences: (patch) =>
        set((state) => ({ preferences: { ...state.preferences, ...patch } })),
    }),
    { name: "nova.preferences" }
  )
);
