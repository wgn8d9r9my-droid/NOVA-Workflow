import { createEntityStore } from "./create-entity-store";
import type { TodoItem, TodoList } from "@/types/entities";

export const useTodosStore = createEntityStore<TodoItem>("nova.todos", "todos");
export const useTodoListsStore = createEntityStore<TodoList>("nova.todo_lists", "todo_lists");
