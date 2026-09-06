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
  // Ids removed locally, kept until a hydrate confirms Supabase has also
  // dropped them — prevents a stale copy on another device from being
  // resurrected (and re-pushed to the cloud) by the next catch-up pull.
  deletedIds: string[];
  // Ids this device has actually seen in Supabase as of its last pull. If a
  // local item is in this set but missing from the next pull, another
  // device deleted it — that's a confirmed delete, not a pending write, so
  // it gets dropped locally instead of pushed back to the cloud.
  knownRemoteIds: string[];
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
        deletedIds: [],
        knownRemoteIds: [],
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
          set((state) => ({
            items: state.items.filter((entity) => entity.id !== id),
            deletedIds: state.deletedIds.includes(id) ? state.deletedIds : [...state.deletedIds, id],
          }));
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

          const { items: local, deletedIds, knownRemoteIds } = get();
          const deletedSet = new Set(deletedIds);
          const knownSet = new Set(knownRemoteIds);
          const remoteIds = new Set(remote.map((r) => r.id));

          const merged = new Map<string, T>();
          for (const item of local) {
            if (deletedSet.has(item.id)) continue; // we deleted it — don't resurrect
            // Previously confirmed to exist remotely, but gone from this
            // pull: another device deleted it. Drop it instead of treating
            // the absence as "hasn't synced yet" and pushing it back.
            if (knownSet.has(item.id) && !remoteIds.has(item.id)) continue;
            merged.set(item.id, item);
          }
          for (const item of remote) {
            // Skip rows we deleted locally — remote just hasn't caught up
            // yet, so treating them as live here would resurrect them.
            if (deletedSet.has(item.id)) continue;
            const existing = merged.get(item.id);
            if (!existing || new Date(item.updated_at) >= new Date(existing.updated_at)) {
              merged.set(item.id, item);
            }
          }

          const result = Array.from(merged.values());

          // Re-fire the delete for any tombstone Supabase still has (the
          // original syncRemove call may never have reached the server if
          // this device went offline right after deleting); drop tombstones
          // that are already gone everywhere so the list doesn't grow forever.
          const stillRemote = remote.filter((r) => deletedSet.has(r.id));
          for (const r of stillRemote) syncRemove(table, r.id);
          const nextDeletedIds = stillRemote.map((r) => r.id);

          set({ items: result, deletedIds: nextDeletedIds, knownRemoteIds: Array.from(remoteIds) });

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
            if (state.deletedIds.includes(entity.id)) return state;
            const exists = state.items.some((e) => e.id === entity.id);
            return {
              items: exists
                ? state.items.map((e) => (e.id === entity.id ? entity : e))
                : [...state.items, entity],
            };
          });
        },
        applyRemoteDelete: (id) => {
          set((state) => ({
            items: state.items.filter((e) => e.id !== id),
            deletedIds: state.deletedIds.filter((d) => d !== id),
          }));
        },
      }),
      { name: storageKey }
    )
  );
}
