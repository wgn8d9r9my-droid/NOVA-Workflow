import { createEntityStore } from "./create-entity-store";
import type { Goal, Milestone } from "@/types/entities";

export const useGoalsStore = createEntityStore<Goal>("nova.goals", "goals");
export const useMilestonesStore = createEntityStore<Milestone>("nova.milestones", "milestones");
