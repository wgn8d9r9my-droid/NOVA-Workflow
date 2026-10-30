"use client";

import { useMemo, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TodoSidebar } from "@/components/todo/todo-sidebar";
import { TodoRow } from "@/components/todo/todo-row";
import { TodoEditorSheet } from "@/components/todo/todo-editor-sheet";
import { useTodosStore, useTodoListsStore } from "@/lib/store/todos";
import { dateKey, groupOpenTodos, matchesView } from "@/lib/todo-derived";
import { cn } from "@/lib/utils";
import type { TodoItem } from "@/types/entities";

const TONE_TEXT = {
  overdue: "text-destructive",
  today: "text-primary",
  soon: "text-foreground/80",
  normal: "text-muted-foreground",
  none: "text-muted-foreground",
} as const;

const SMART_TITLES: Record<string, string> = {
  all: "Toutes les tâches",
  today: "Aujourd'hui",
  upcoming: "À venir",
  nodate: "Sans échéance",
  done: "Terminées",
};

export default function TodoPage() {
  const todos = useTodosStore((s) => s.items);
  const addTodo = useTodosStore((s) => s.add);
  const updateTodo = useTodosStore((s) => s.update);
  const lists = useTodoListsStore((s) => s.items);

  const [view, setView] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [quickDate, setQuickDate] = useState<string | undefined>(undefined);
  const [showDone, setShowDone] = useState(false);

  const currentList = lists.find((l) => l.id === view);
  const isListView = !!currentList;
  const title = currentList ? `${currentList.emoji ?? ""} ${currentList.name}`.trim() : (SMART_TITLES[view] ?? "To-do");

  const { groups, done } = useMemo(() => {
    const open = todos.filter((t) => t.status === "todo" && view !== "done" && matchesView(t, view));
    const doneItems = todos
      .filter((t) => t.status === "done" && (view === "done" || view === "all" || isListView) && matchesView(t, view))
      .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""));
    return { groups: groupOpenTodos(open), done: doneItems };
  }, [todos, view, isListView]);

  function listFor(item: TodoItem) {
    return item.list_id ? lists.find((l) => l.id === item.list_id) : undefined;
  }

  function toggle(item: TodoItem) {
    const isDone = item.status === "done";
    updateTodo(item.id, {
      status: isDone ? "todo" : "done",
      completed_at: isDone ? undefined : new Date().toISOString(),
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    setValue("");
    const due = quickDate ?? (view === "today" ? dateKey(new Date()) : undefined);
    setQuickDate(undefined);
    addTodo({
      title: text,
      priority: "P2",
      status: "todo",
      subtasks: [],
      list_id: isListView ? view : undefined,
      due_date: due,
    });
  }

  const doneVisible = view === "done" || showDone;
  const empty = groups.length === 0 && (view === "done" ? done.length === 0 : true);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">To-do</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Tes tâches, avec échéances, couleurs et listes.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <TodoSidebar items={todos} view={view} onSelect={setView} />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

          <form onSubmit={submit} className="glass shadow-soft flex items-center gap-2 rounded-2xl px-3 py-2">
            <Plus className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ajouter une tâche…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                  <CalendarIcon className="size-3.5" />
                  {quickDate ? format(parseISO(quickDate), "d MMM", { locale: fr }) : "Échéance"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="flex gap-1.5 border-b border-border/50 p-2">
                  {[
                    { label: "Aujourd'hui", v: dateKey(new Date()) },
                    { label: "Demain", v: dateKey(addDays(new Date(), 1)) },
                  ].map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => setQuickDate(q.v)}
                      className="rounded-full border border-border/60 px-2.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
                <Calendar
                  mode="single"
                  locale={fr}
                  selected={quickDate ? parseISO(quickDate) : undefined}
                  onSelect={(d) => setQuickDate(d ? format(d, "yyyy-MM-dd") : undefined)}
                />
              </PopoverContent>
            </Popover>
            {quickDate && (
              <button
                type="button"
                onClick={() => setQuickDate(undefined)}
                aria-label="Retirer l'échéance"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
            <Button type="submit" size="sm" disabled={!value.trim()}>
              Ajouter
            </Button>
          </form>

          {empty && (
            <p className="px-1 py-10 text-center text-sm text-muted-foreground">
              {todos.length === 0 ? "Aucune tâche pour l'instant — ajoute la première ci-dessus." : "Rien ici — tout est fait."}
            </p>
          )}

          {groups.map((group) => (
            <section key={group.key}>
              <p className={cn("mb-1.5 flex items-center gap-2 px-1 text-xs font-medium", TONE_TEXT[group.tone])}>
                {group.label}
                <span className="text-muted-foreground">{group.items.length}</span>
              </p>
              <div className="glass shadow-soft flex flex-col rounded-2xl p-1.5">
                {group.items.map((item) => (
                  <TodoRow
                    key={item.id}
                    item={item}
                    list={listFor(item)}
                    showList={!isListView}
                    onToggle={toggle}
                    onOpen={setOpenId}
                  />
                ))}
              </div>
            </section>
          ))}

          {done.length > 0 && (
            <section>
              {view !== "done" && (
                <button
                  onClick={() => setShowDone((v) => !v)}
                  className="mb-1.5 flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className={cn("size-3.5 transition-transform", !doneVisible && "-rotate-90")} />
                  Terminées <span>{done.length}</span>
                </button>
              )}
              {doneVisible && (
                <div className="glass shadow-soft flex flex-col rounded-2xl p-1.5">
                  {done.map((item) => (
                    <TodoRow
                      key={item.id}
                      item={item}
                      list={listFor(item)}
                      showList={!isListView}
                      onToggle={toggle}
                      onOpen={setOpenId}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <TodoEditorSheet todoId={openId} onOpenChange={(v) => !v && setOpenId(null)} />
    </div>
  );
}
