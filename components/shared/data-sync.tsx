"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { useTasksStore } from "@/lib/store/tasks";
import { useProjectsStore, useProjectFoldersStore } from "@/lib/store/projects";
import { useGoalsStore, useMilestonesStore } from "@/lib/store/goals";
import { useNotesStore } from "@/lib/store/notes";
import { useTransactionsStore, useClientsStore } from "@/lib/store/finances";
import { useHabitsStore, useHabitEntriesStore } from "@/lib/store/habits";
import { useJournalStore } from "@/lib/store/journal";

const ENTITY_STORES = [
  { table: "tasks", store: useTasksStore },
  { table: "projects", store: useProjectsStore },
  { table: "project_folders", store: useProjectFoldersStore },
  { table: "goals", store: useGoalsStore },
  { table: "milestones", store: useMilestonesStore },
  { table: "notes", store: useNotesStore },
  { table: "transactions", store: useTransactionsStore },
  { table: "clients", store: useClientsStore },
  { table: "habits", store: useHabitsStore },
  { table: "habit_entries", store: useHabitEntriesStore },
  { table: "journal_entries", store: useJournalStore },
] as const;

/** Bootstraps cloud sync once a user is authenticated: pulls + merges remote
 * data on login, then keeps every table live-updated across devices via
 * Supabase Realtime. Renders nothing. */
export function DataSync() {
  const { user } = useSupabaseUser();

  useEffect(() => {
    if (!supabaseConfigured || !user) return;

    let cancelled = false;

    if (!cancelled) {
      Promise.all(ENTITY_STORES.map(({ store }) => store.getState().hydrateFromRemote()));
    }

    const supabase = createClient();
    const channels = ENTITY_STORES.map(({ table, store }) =>
      supabase
        .channel(`sync:${table}:${user.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table, filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.eventType === "DELETE") {
              store.getState().applyRemoteDelete((payload.old as { id: string }).id);
            } else {
              store.getState().applyRemoteUpsert(payload.new as never);
            }
          }
        )
        .subscribe()
    );

    return () => {
      cancelled = true;
      for (const channel of channels) supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
}
