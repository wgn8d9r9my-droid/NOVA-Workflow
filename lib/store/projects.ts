import { createEntityStore } from "./create-entity-store";
import type { Project, ProjectFolder } from "@/types/entities";

export const useProjectsStore = createEntityStore<Project>("nova.projects");
export const useProjectFoldersStore = createEntityStore<ProjectFolder>("nova.project_folders");
