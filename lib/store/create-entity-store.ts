import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

export function createEntityStore<T extends BaseEntity>(storageKey: string) {
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
          return entity;
        },
        update: (id, patch) => {
          set((state) => ({
            items: state.items.map((entity) =>
              entity.id === id
                ? { ...entity, ...patch, updated_at: new Date().toISOString() }
                : entity
            ),
          }));
        },
        remove: (id) => {
          set((state) => ({ items: state.items.filter((entity) => entity.id !== id) }));
        },
        get: (id) => get().items.find((entity) => entity.id === id),
      }),
      { name: storageKey }
    )
  );
}
