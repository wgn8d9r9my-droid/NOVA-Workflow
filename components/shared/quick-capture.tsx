"use client";

import { useState } from "react";
import { CheckSquare, StickyNote, Lightbulb, FolderPlus, Receipt, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import { useNotesStore } from "@/lib/store/notes";
import { useProjectsStore } from "@/lib/store/projects";
import type { Priority } from "@/types/entities";

type CaptureType = "task" | "note" | "idea" | "project" | "expense" | "journal";

const types: { id: CaptureType; label: string; icon: typeof CheckSquare; ready: boolean }[] = [
  { id: "task", label: "Tâche", icon: CheckSquare, ready: true },
  { id: "note", label: "Note", icon: StickyNote, ready: true },
  { id: "idea", label: "Idée", icon: Lightbulb, ready: true },
  { id: "project", label: "Projet", icon: FolderPlus, ready: true },
  { id: "expense", label: "Dépense", icon: Receipt, ready: false },
  { id: "journal", label: "Journal", icon: BookOpen, ready: false },
];

export function QuickCapture({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [type, setType] = useState<CaptureType | null>(null);
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<Priority>("P2");

  const addTask = useTasksStore((s) => s.add);
  const addNote = useNotesStore((s) => s.add);
  const addProject = useProjectsStore((s) => s.add);

  function reset() {
    setType(null);
    setValue("");
    setPriority("P2");
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v);
    if (!v) reset();
  }

  function submit() {
    if (!value.trim() || !type) return;
    switch (type) {
      case "task":
        addTask({ title: value.trim(), priority, status: "todo", tags: [] });
        toast.success("Tâche ajoutée");
        break;
      case "note":
        addNote({ content: value.trim(), type: "note", tags: [] });
        toast.success("Note ajoutée");
        break;
      case "idea":
        addNote({ content: value.trim(), type: "idea", tags: [] });
        toast.success("Idée capturée");
        break;
      case "project":
        addProject({ name: value.trim(), status: "idea", type: "personal" });
        toast.success("Projet créé");
        break;
    }
    handleOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="glass shadow-float mx-auto mb-4 max-w-lg rounded-4xl border-none p-5 sm:mb-6"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-base">
            {type ? `Nouvelle ${types.find((t) => t.id === type)?.label.toLowerCase()}` : "Capture rapide"}
          </SheetTitle>
        </SheetHeader>

        {!type ? (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  if (!t.ready) {
                    toast("Ce module arrive bientôt");
                    return;
                  }
                  setType(t.id);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-4 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  !t.ready && "opacity-40"
                )}
              >
                <t.icon className="size-5" />
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {type === "note" || type === "idea" ? (
              <Textarea
                autoFocus
                placeholder={type === "idea" ? "Décris ton idée…" : "Écris ta note…"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
                }}
                rows={4}
              />
            ) : (
              <Input
                autoFocus
                placeholder={type === "project" ? "Nom du projet…" : "Qu'as-tu à faire ?"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
              />
            )}

            {type === "task" && (
              <div className="flex gap-1.5">
                {(["P1", "P2", "P3"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      priority === p
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setType(null)}>
                Retour
              </Button>
              <Button size="sm" onClick={submit} disabled={!value.trim()}>
                Ajouter
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
