import { createEntityStore } from "./create-entity-store";
import type { JournalEntry } from "@/types/entities";

export const useJournalStore = createEntityStore<JournalEntry>("nova.journal");
