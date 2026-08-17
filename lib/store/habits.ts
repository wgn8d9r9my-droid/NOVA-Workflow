import { createEntityStore } from "./create-entity-store";
import type { Habit, HabitEntry } from "@/types/entities";

export const useHabitsStore = createEntityStore<Habit>("nova.habits", "habits");
export const useHabitEntriesStore = createEntityStore<HabitEntry>("nova.habit_entries", "habit_entries");
