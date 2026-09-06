-- NOVA — enable Realtime replication for every table synced by DataSync
-- Without this, postgres_changes subscriptions never fire and devices only
-- catch up when a tab regains focus or the network reconnects.
-- Apply with: supabase db push (once a Supabase project is linked)

alter publication supabase_realtime add table
  public.tasks,
  public.task_categories,
  public.projects,
  public.project_folders,
  public.goals,
  public.milestones,
  public.notes,
  public.transactions,
  public.clients,
  public.habits,
  public.habit_entries,
  public.journal_entries,
  public.subjects,
  public.course_notes;
