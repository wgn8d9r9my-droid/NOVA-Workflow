-- NOVA — initial schema
-- Apply with: supabase db push (once a Supabase project is linked)
-- Every table is scoped to auth.uid() via Row Level Security.

create extension if not exists "pgcrypto";

-- =========================================================================
-- user_preferences
-- =========================================================================
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  onboarding_done boolean not null default false,
  accent_color text not null default '#104090',
  density text not null default 'comfortable' check (density in ('comfortable', 'compact')),
  focus_areas text[] not null default '{}',
  home_widget_order text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- goals
-- =========================================================================
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  period text not null default 'year' check (period in ('year', 'quarter', 'custom')),
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal_id uuid not null references public.goals (id) on delete cascade,
  title text not null,
  done boolean not null default false,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- clients (Business)
-- =========================================================================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  company text,
  email text,
  phone text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- project_folders
-- =========================================================================
create table if not exists public.project_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#104090',
  emoji text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- projects
-- =========================================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'idea'
    check (status in ('idea', 'planning', 'active', 'paused', 'completed', 'archived')),
  type text not null default 'personal' check (type in ('personal', 'client')),
  deadline date,
  budget numeric,
  client_id uuid references public.clients (id) on delete set null,
  goal_id uuid references public.goals (id) on delete set null,
  folder_id uuid references public.project_folders (id) on delete set null,
  emoji text,
  color text,
  cover_image text,
  progress_override smallint check (progress_override between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- task_categories (Pro / Perso / Santé, user-defined, colored)
-- =========================================================================
create table if not exists public.task_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#104090',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- tasks
-- =========================================================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'P2' check (priority in ('P1', 'P2', 'P3')),
  status text not null default 'todo' check (status in ('todo', 'done')),
  due_date date,
  due_time time,
  end_time time,
  duration_minutes integer,
  category_id uuid references public.task_categories (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  goal_id uuid references public.goals (id) on delete set null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Existing databases: create table above is a no-op once the table already
-- exists, so add the new columns explicitly too.
alter table public.tasks add column if not exists end_time time;
alter table public.tasks add column if not exists category_id uuid references public.task_categories (id) on delete set null;

-- =========================================================================
-- notes (notes + ideas, Creative Lab)
-- =========================================================================
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  content text not null,
  type text not null default 'note' check (type in ('note', 'idea')),
  project_id uuid references public.projects (id) on delete set null,
  tags text[] not null default '{}',
  converted_to_project_id uuid references public.projects (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- journal_entries (private)
-- =========================================================================
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  mood text,
  tags text[] not null default '{}',
  date date not null default current_date,
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- transactions (Finances + Business revenue)
-- =========================================================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric not null,
  category text not null default 'other',
  date date not null default current_date,
  description text,
  source_type text not null default 'personal' check (source_type in ('personal', 'business')),
  project_id uuid references public.projects (id) on delete set null,
  client_id uuid references public.clients (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- habits
-- =========================================================================
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  icon text,
  target_frequency integer not null default 7,
  color text not null default '#104090',
  fields jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id uuid not null references public.habits (id) on delete cascade,
  date date not null default current_date,
  done boolean not null default true,
  note text,
  values jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, date)
);

-- =========================================================================
-- events (calendar)
-- =========================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  project_id uuid references public.projects (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- notifications
-- =========================================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  message text not null,
  read boolean not null default false,
  related_entity jsonb,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- ai_actions_log (Nova AI audit trail)
-- =========================================================================
create table if not exists public.ai_actions_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action_type text not null,
  payload jsonb not null default '{}',
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- Indexes
-- =========================================================================
create index if not exists task_categories_user_id_idx on public.task_categories (user_id);
create index if not exists tasks_category_id_idx on public.tasks (category_id);
create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_project_id_idx on public.tasks (project_id);
create index if not exists tasks_goal_id_idx on public.tasks (goal_id);
create index if not exists tasks_due_date_idx on public.tasks (due_date);
create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists projects_status_idx on public.projects (status);
create index if not exists milestones_goal_id_idx on public.milestones (goal_id);
create index if not exists notes_user_id_idx on public.notes (user_id);
create index if not exists notes_project_id_idx on public.notes (project_id);
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_date_idx on public.transactions (date);
create index if not exists habit_entries_habit_id_idx on public.habit_entries (habit_id);
create index if not exists events_user_id_idx on public.events (user_id);
create index if not exists journal_entries_user_id_idx on public.journal_entries (user_id);

-- =========================================================================
-- Row Level Security — every table is private to its owner
-- =========================================================================
alter table public.user_preferences enable row level security;
alter table public.goals enable row level security;
alter table public.milestones enable row level security;
alter table public.clients enable row level security;
alter table public.project_folders enable row level security;
alter table public.projects enable row level security;
alter table public.task_categories enable row level security;
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.journal_entries enable row level security;
alter table public.transactions enable row level security;
alter table public.habits enable row level security;
alter table public.habit_entries enable row level security;
alter table public.events enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_actions_log enable row level security;

drop policy if exists "own row" on public.user_preferences;
create policy "own row" on public.user_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.goals;
create policy "own rows" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.milestones;
create policy "own rows" on public.milestones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.clients;
create policy "own rows" on public.clients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.project_folders;
create policy "own rows" on public.project_folders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.projects;
create policy "own rows" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.task_categories;
create policy "own rows" on public.task_categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.tasks;
create policy "own rows" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.notes;
create policy "own rows" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.journal_entries;
create policy "own rows" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.transactions;
create policy "own rows" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.habits;
create policy "own rows" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.habit_entries;
create policy "own rows" on public.habit_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.events;
create policy "own rows" on public.events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.notifications;
create policy "own rows" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.ai_actions_log;
create policy "own rows" on public.ai_actions_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- Auto-create a user_preferences row on signup
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
