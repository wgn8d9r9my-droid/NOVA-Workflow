"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CheckSquare, FolderKanban, Target, StickyNote, Lightbulb } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { navItems } from "@/lib/nav-items";
import { useTasksStore } from "@/lib/store/tasks";
import { useProjectsStore } from "@/lib/store/projects";
import { useGoalsStore } from "@/lib/store/goals";
import { useNotesStore } from "@/lib/store/notes";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const tasks = useTasksStore((s) => s.items);
  const projects = useProjectsStore((s) => s.items);
  const goals = useGoalsStore((s) => s.items);
  const notes = useNotesStore((s) => s.items);

  const openTasks = useMemo(() => tasks.filter((t) => t.status === "todo").slice(0, 8), [tasks]);

  function go(href: string) {
    router.push(href);
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Recherche" description="Rechercher dans NOVA">
      <CommandInput placeholder="Rechercher une tâche, un projet, une idée…" />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem key={item.href} onSelect={() => go(item.href)}>
              <item.icon />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {openTasks.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Tâches">
              {openTasks.map((t) => (
                <CommandItem key={t.id} onSelect={() => go("/calendar")}>
                  <CheckSquare />
                  {t.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {projects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projets">
              {projects.slice(0, 6).map((p) => (
                <CommandItem key={p.id} onSelect={() => go(`/projects/${p.id}`)}>
                  <FolderKanban />
                  {p.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {goals.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Objectifs">
              {goals.slice(0, 6).map((g) => (
                <CommandItem key={g.id} onSelect={() => go("/goals")}>
                  <Target />
                  {g.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {notes.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Notes & idées">
              {notes.slice(0, 6).map((n) => (
                <CommandItem key={n.id} onSelect={() => go("/creative")}>
                  {n.type === "idea" ? <Lightbulb /> : <StickyNote />}
                  {n.title || n.content.slice(0, 60)}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
