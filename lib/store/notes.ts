import { createEntityStore } from "./create-entity-store";
import type { Note } from "@/types/entities";

export const useNotesStore = createEntityStore<Note>("nova.notes", "notes");
