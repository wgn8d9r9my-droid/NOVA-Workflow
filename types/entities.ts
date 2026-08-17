export type Priority = "P1" | "P2" | "P3";

export type TaskStatus = "todo" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  due_date?: string; // ISO date (yyyy-mm-dd)
  due_time?: string; // HH:mm, 24h — start time
  end_time?: string; // HH:mm, 24h — set only for a ranged event
  category_id?: string;
  project_id?: string;
  goal_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus =
  | "idea"
  | "planning"
  | "active"
  | "paused"
  | "completed"
  | "archived";

export type ProjectType = "personal" | "client";

export interface ProjectFolder {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  type: ProjectType;
  deadline?: string;
  budget?: number;
  client_id?: string;
  goal_id?: string;
  folder_id?: string;
  emoji?: string;
  color?: string;
  cover_image?: string;
  progress_override?: number; // 0-100, manual override; falls back to task-derived progress when unset
  created_at: string;
  updated_at: string;
}

export type GoalPeriod = "year" | "quarter" | "custom";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  period: GoalPeriod;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  done: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export type NoteType = "note" | "idea";

export interface Note {
  id: string;
  content: string;
  title?: string;
  type: NoteType;
  project_id?: string;
  tags: string[];
  converted_to_project_id?: string;
  created_at: string;
  updated_at: string;
}

export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
}

export type TransactionType = "income" | "expense";
export type TransactionSource = "personal" | "business";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO date
  description?: string;
  source_type: TransactionSource;
  project_id?: string;
  client_id?: string;
  created_at: string;
  updated_at: string;
}

export type HabitFieldType = "select" | "text" | "number";

export interface HabitField {
  id: string;
  label: string;
  type: HabitFieldType;
  options?: string[]; // for type "select"
}

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  color: string;
  target_frequency: number; // times per week
  fields: HabitField[];
  created_at: string;
  updated_at: string;
}

export interface HabitEntry {
  id: string;
  habit_id: string;
  date: string; // ISO date
  done: boolean;
  note?: string;
  values: Record<string, string>; // keyed by HabitField.id
  created_at: string;
  updated_at: string;
}

export type Mood = "great" | "good" | "neutral" | "low" | "bad";

export interface JournalEntry {
  id: string;
  content: string;
  mood?: Mood;
  tags: string[];
  date: string; // ISO date
  created_at: string;
  updated_at: string;
}

export type Density = "comfortable" | "compact";

export interface UserPreferences {
  first_name: string;
  onboarding_done: boolean;
  accent_color: string;
  density: Density;
  focus_areas: string[];
  home_widget_order: string[];
}
