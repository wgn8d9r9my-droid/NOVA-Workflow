import { create } from "zustand";
import { persist } from "zustand/middleware";
import { syncUpsertSingleton, syncPullSingleton } from "@/lib/sync";
import type { UserPreferences } from "@/types/entities";

interface PreferencesState {
  preferences: UserPreferences;
  setPreferences: (patch: Partial<UserPreferences>) => void;
  hydrateFromRemote: () => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  first_name: "",
  onboarding_done: false,
  accent_color: "#104090",
  density: "comfortable",
  focus_areas: [],
  home_widget_order: ["priority-tasks", "spotlight", "projects", "goals", "habits"],
};

const TABLE = "user_preferences";

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      setPreferences: (patch) => {
        const next = { ...get().preferences, ...patch };
        set({ preferences: next });
        syncUpsertSingleton(TABLE, next);
      },
      // A fresh Supabase account gets an empty preferences row auto-created on
      // signup. If this device already has real local onboarding data, that
      // local state wins and gets pushed up rather than being wiped by the
      // blank remote row — the reverse (a second device pulling real remote
      // data down) still works normally.
      hydrateFromRemote: async () => {
        const remote = await syncPullSingleton<UserPreferences>(TABLE);
        if (!remote) return;
        const local = get().preferences;
        const remoteIsBlank = !remote.onboarding_done && !remote.first_name;
        if (remoteIsBlank && local.onboarding_done) {
          syncUpsertSingleton(TABLE, local);
          return;
        }
        set({ preferences: { ...defaultPreferences, ...remote } });
      },
    }),
    { name: "nova.preferences" }
  )
);
