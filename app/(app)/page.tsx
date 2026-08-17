"use client";

import { useMemo } from "react";
import { isToday, startOfWeek, addDays, isSameDay } from "date-fns";
import { HeroHeader } from "@/components/home/hero-header";
import { QuoteCard } from "@/components/home/quote-card";
import { PrioritiesCard } from "@/components/home/priorities-card";
import { ProjectsOverviewCard } from "@/components/home/projects-overview-card";
import { WeekFocusCard } from "@/components/home/week-focus-card";
import { ActivityCard } from "@/components/home/activity-card";
import { FinancesCard } from "@/components/home/finances-card";
import { HabitsCard } from "@/components/home/habits-card";
import { GoalsCard } from "@/components/home/goals-card";
import { IdeasCard } from "@/components/home/ideas-card";
import { NovaCard } from "@/components/home/nova-card";
import { AgendaCard } from "@/components/home/agenda-card";
import { TasksCard } from "@/components/home/tasks-card";
import { QuickActionsCard } from "@/components/home/quick-actions-card";
import { computeSpotlight, weeklyActivity, weeklyCompletion } from "@/lib/home-intelligence";
import { projectProgress, goalProgress } from "@/lib/derived";
import { inMonth, summary } from "@/lib/finance-derived";
import { useTasksStore } from "@/lib/store/tasks";
import { useProjectsStore } from "@/lib/store/projects";
import { useGoalsStore, useMilestonesStore } from "@/lib/store/goals";
import { useNotesStore } from "@/lib/store/notes";
import { useHabitsStore, useHabitEntriesStore } from "@/lib/store/habits";
import { useTransactionsStore } from "@/lib/store/finances";
import { usePreferencesStore } from "@/lib/store/preferences";

export default function HomePage() {
  const firstName = usePreferencesStore((s) => s.preferences.first_name);

  const tasks = useTasksStore((s) => s.items);
  const updateTask = useTasksStore((s) => s.update);
  const projects = useProjectsStore((s) => s.items);
  const goals = useGoalsStore((s) => s.items);
  const milestones = useMilestonesStore((s) => s.items);
  const notes = useNotesStore((s) => s.items);
  const habits = useHabitsStore((s) => s.items);
  const habitEntries = useHabitEntriesStore((s) => s.items);
  const transactions = useTransactionsStore((s) => s.items);

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, {
      status: task.status === "done" ? "todo" : "done",
      completed_at: task.status === "done" ? undefined : new Date().toISOString(),
    });
  }

  const priorityTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status === "todo")
        .sort((a, b) => a.priority.localeCompare(b.priority))
        .slice(0, 5),
    [tasks]
  );

  const activeProjects = useMemo(
    () => projects.filter((p) => p.status === "active" || p.status === "planning").slice(0, 4),
    [projects]
  );

  const spotlight = useMemo(
    () => computeSpotlight(tasks, projects, goals, milestones),
    [tasks, projects, goals, milestones]
  );
  const weekProgress = useMemo(() => weeklyCompletion(tasks), [tasks]);
  const activityData = useMemo(() => weeklyActivity(tasks), [tasks]);

  const now = new Date();
  const monthly = useMemo(() => inMonth(transactions, now.getFullYear(), now.getMonth()), [transactions]);
  const { income, expense, balance } = useMemo(() => summary(monthly), [monthly]);
  const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const habitRows = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return habits.slice(0, 4).map((habit) => {
      const entries = habitEntries.filter((e) => e.habit_id === habit.id && e.done);
      const days = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(weekStart, i);
        return entries.some((e) => isSameDay(new Date(e.date), day));
      });
      return { habit, days, count: days.filter(Boolean).length };
    });
  }, [habits, habitEntries]);

  const goalRows = useMemo(
    () => goals.slice(0, 4).map((goal) => ({ goal, progress: goalProgress(milestones, goal.id) })),
    [goals, milestones]
  );

  const ideas = useMemo(
    () =>
      notes
        .filter((n) => n.type === "idea")
        .slice(-4)
        .reverse(),
    [notes]
  );

  const todaysAgenda = useMemo(
    () =>
      tasks
        .filter((t) => t.due_date && isToday(new Date(t.due_date)) && t.due_time)
        .sort((a, b) => (a.due_time ?? "").localeCompare(b.due_time ?? "")),
    [tasks]
  );

  const upcomingTasks = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = addDays(start, 6);
    return tasks
      .filter((t) => t.due_date && new Date(t.due_date) >= start && new Date(t.due_date) <= end)
      .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));
  }, [tasks]);

  function projectName(id?: string) {
    return id ? projects.find((p) => p.id === id)?.name : undefined;
  }
  function projectColor(id?: string) {
    return id ? projects.find((p) => p.id === id)?.color : undefined;
  }

  return (
    <div className="grid gap-5 pb-6 xl:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="lg:flex-1">
            <HeroHeader firstName={firstName} />
          </div>
          <div className="flex lg:w-[300px]">
            <QuoteCard />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <PrioritiesCard tasks={priorityTasks} onToggle={toggleTask} />
          <ProjectsOverviewCard projects={activeProjects} progressOf={(p) => projectProgress(tasks, p)} />
          <WeekFocusCard content={spotlight} progress={weekProgress} />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <ActivityCard data={activityData} />
          <FinancesCard income={income} expense={expense} balance={balance} monthLabel={monthLabel} />
          <HabitsCard rows={habitRows} />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <GoalsCard rows={goalRows} />
          <IdeasCard ideas={ideas} />
          <NovaCard />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <AgendaCard tasks={todaysAgenda} projectName={projectName} projectColor={projectColor} />
        <TasksCard
          tasks={upcomingTasks.filter((t) => t.status === "todo").slice(0, 6)}
          done={upcomingTasks.filter((t) => t.status === "done").length}
          total={upcomingTasks.length}
          onToggle={toggleTask}
        />
        <QuickActionsCard />
      </div>
    </div>
  );
}
