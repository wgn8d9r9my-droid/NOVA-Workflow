import { createEntityStore } from "./create-entity-store";
import type { Subject, CourseNote } from "@/types/entities";

export const useSubjectsStore = createEntityStore<Subject>("nova.subjects", "subjects");
export const useCourseNotesStore = createEntityStore<CourseNote>("nova.course_notes", "course_notes");
