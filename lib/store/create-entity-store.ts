import { create } from "zustand";
import { persist } from "zustand/middleware";
import { syncInsert, syncUpdate, syncRemove, syncPullAll } from "@/lib/sync";

interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

interface EntityState<T extends BaseEntity> {
  items: T[];
  add: (item: Omit<T, "id" | "created_at" | "updated_at">) => T;
  update: (id: string, patch: Partial<Omit<T, "id" | "created_at">>) => void;
  remove: (id: string) => void;
  get: (id: string) => T | undefined;
  hydrateFromRemote: () => Promise<void>;
  applyRemoteUpsert: (entity: T) => void;
  applyRemoteDelete: (id: string) => void;
}

export function createEntityStore<T extends BaseEntity>(storageKey: string, table?: string) {
  return create<EntityState<T>>()(
    persist(
      (set, get) => ({
        items: [],
        add: (item) => {
          const now = new Date().toISOString();
          const entity = {
            ...item,
            id: crypto.randomUUID(),
            created_at: now,
            updated_at: now,
          } as T;
          set((state) => ({ items: [...state.items, entity] }));
          if (table) syncInsert(table, entity);
          return entity;
        },
        update: (id, patch) => {
          const updated_at = new Date().toISOString();
          set((state) => ({
            items: state.items.map((entity) =>
              entity.id === id ? { ...entity, ...patch, updated_at } : entity
            ),
          }));
          if (table) syncUpdate(table, id, { ...patch, updated_at });
        },
        remove: (id) => {
          set((state) => ({ items: state.items.filter((entity) => entity.id !== id) }));
          if (table) syncRemove(table, id);
        },
        get: (id) => get().items.find((entity) => entity.id === id),

        // Merges remote rows into local state — never blindly overwrites, so a
        // device that already has local data seeds the cloud on first login
        // instead of losing everything to an empty remote table.
        hydrateFromRemote: async () => {
          if (!table) return;
          const remote = await syncPullAll<T>(table);
          if (remote === null) return;

          const local = get().items;
          const merged = new Map<string, T>();
          for (const item of local) merged.set(item.id, item);
          for (const item of remote) {
            const existing = merged.get(item.id);
            if (!existing || new Date(item.updated_at) >= new Date(existing.updated_at)) {
              merged.set(item.id, item);
            }
          }

          const result = Array.from(merged.values());
          set({ items: result });

          for (const item of result) {
            const remoteMatch = remote.find((r) => r.id === item.id);
            if (!remoteMatch) {
              syncInsert(table, item);
            } else if (new Date(item.updated_at) > new Date(remoteMatch.updated_at)) {
              syncUpdate(table, item.id, item);
            }
          }
        },
        applyRemoteUpsert: (entity) => {
          set((state) => {
            const exists = state.items.some((e) => e.id === entity.id);
            return {
              items: exists
                ? state.items.map((e) => (e.id === entity.id ? entity : e))
                : [...state.items, entity],
            };
          });
        },
        applyRemoteDelete: (id) => {
          set((state) => ({ items: state.items.filter((e) => e.id !== id) }));
        },
      }),
      { name: storageKey }
    )
  );
}
