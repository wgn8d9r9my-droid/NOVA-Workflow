-- NOVA — To-do module (lists + items)
-- Safe to run more than once.

create table if not exists public.todo_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#104090',
  emoji text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  list_id uuid references public.todo_lists (id) on delete set null,
  title text not null,
  notes text,
  priority text not null default 'P2',
  status text not null default 'todo',
  due_date date,
  due_time text,
  color text,
  subtasks jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists todo_lists_user_id_idx on public.todo_lists (user_id);
create index if not exists todos_user_id_idx on public.todos (user_id);
create index if not exists todos_list_id_idx on public.todos (list_id);

alter table public.todo_lists enable row level security;
alter table public.todos enable row level security;

drop policy if exists "own rows" on public.todo_lists;
create policy "own rows" on public.todo_lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.todos;
create policy "own rows" on public.todos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Realtime (skipped for tables that are already published)
do $$
declare t text;
begin
  foreach t in array array['todo_lists', 'todos'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- Make PostgREST pick up the new tables immediately
notify pgrst, 'reload schema';
