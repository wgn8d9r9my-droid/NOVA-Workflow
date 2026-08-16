import { createEntityStore } from "./create-entity-store";
import type { Task } from "@/types/entities";

export const useTasksStore = createEntityStore<Task>("nova.tasks");
