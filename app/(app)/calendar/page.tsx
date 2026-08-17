"use client";

import { useMemo, useState } from "react";
import { format, addDays, addWeeks, addMonths, isToday as isTodayFn } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ChevronDown, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayView } from "@/components/calendar/day-view";
import { WeekView } from "@/components/calendar/week-view";
import { MonthView } from "@/components/calendar/month-view";
import { TaskEditorSheet } from "@/components/calendar/task-editor-sheet";
import { CategoryManager } from "@/components/calendar/category-manager";
import { TaskRow } from "@/components/shared/task-row";
import { useTasksStore } from "@/lib/store/tasks";
import { useProjectsStore } from "@/lib/store/projects";
import { cn } from "@/lib/utils";

type ViewMode = "day" | "week" | "month";

export default function CalendarPage() {
  const tasks = useTasksStore((s) => s.items);
  const updateTask = useTasksStore((s) => s.update);
  const projects = useProjectsStore((s) => s.items);

  const [view, setView] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showUnplanned, setShowUnplanned] = useState(false);

  const unplanned = useMemo(() => tasks.filter((t) => t.status === "todo" && !t.due_date), [tasks]);

  function projectName(id?: string) {
    return id ? projects.find((p) => p.id === id)?.name : undefined;
  }

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, {
      status: task.status === "done" ? "todo" : "done",
      completed_at: task.status === "done" ? undefined : new Date().toISOString(),
    });
  }

  function goPrev() {
    setSelectedDate((d) => (view === "day" ? addDays(d, -1) : view === "week" ? addWeeks(d, -1) : addMonths(d, -1)));
  }
  function goNext() {
    setSelectedDate((d) => (view === "day" ? addDays(d, 1) : view === "week" ? addWeeks(d, 1) : addMonths(d, 1)));
  }
  function selectDay(date: Date) {
    setSelectedDate(date);
    setView("day");
  }

  const dayLabel = format(selectedDate, "EEEE d MMMM", { locale: fr });
  const headerLabel =
    view === "day"
      ? isTodayFn(selectedDate)
        ? dayLabel
        : format(selectedDate, "d MMMM yyyy", { locale: fr })
      : view === "week"
        ? `Semaine du ${format(selectedDate, "d MMMM", { locale: fr })}`
        : format(selectedDate, "MMMM yyyy", { locale: fr });

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm capitalize text-muted-foreground">
            {view === "day" && isTodayFn(selectedDate) ? "Aujourd'hui" : ""}
          </p>
          <h1 className="text-3xl font-semibold capitalize tracking-tight">{headerLabel}</h1>
        </div>

        <div className="flex items-center gap-3">
          <CategoryManager />

          <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="day">Jour</TabsTrigger>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon-sm" onClick={goPrev}>
              <ChevronLeft className="size-4" />
            </Button>
            {!isTodayFn(selectedDate) && (
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                Aujourd&apos;hui
              </Button>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <CalendarIcon className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  locale={fr}
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon-sm" onClick={goNext}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {view === "day" && <DayView date={selectedDate} onOpenTask={setSelectedTaskId} />}
      {view === "week" && (
        <WeekView date={selectedDate} onSelectDay={selectDay} onOpenTask={setSelectedTaskId} />
      )}
      {view === "month" && (
        <MonthView date={selectedDate} onSelectDay={selectDay} onOpenTask={setSelectedTaskId} />
      )}

      {unplanned.length > 0 && (
        <div>
          <button
            onClick={() => setShowUnplanned((v) => !v)}
            className="mb-1.5 flex items-center gap-1 px-1 text-xs font-medium text-muted-foreground"
          >
            Non planifiées · {unplanned.length}
            <ChevronDown className={cn("size-3.5 transition-transform", showUnplanned && "rotate-180")} />
          </button>
          {showUnplanned && (
            <div className="flex flex-col rounded-2xl border border-border/60 p-2">
              {unplanned.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onOpen={setSelectedTaskId}
                  subtitle={projectName(task.project_id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <TaskEditorSheet taskId={selectedTaskId} onOpenChange={(v) => !v && setSelectedTaskId(null)} />
    </div>
  );
}
