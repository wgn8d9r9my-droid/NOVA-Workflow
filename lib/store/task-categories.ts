import { createEntityStore } from "./create-entity-store";
import type { TaskCategory } from "@/types/entities";

export const useTaskCategoriesStore = createEntityStore<TaskCategory>("nova.task_categories", "task_categories");
