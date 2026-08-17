"use client";

import { CheckSquare, StickyNote, Lightbulb, Receipt, FolderPlus, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useUIStore, type CaptureType } from "@/lib/store/ui";

const ACTIONS: { type: CaptureType; label: string; icon: typeof CheckSquare; ready: boolean }[] = [
  { type: "task", label: "Tâche", icon: CheckSquare, ready: true },
  { type: "note", label: "Note", icon: StickyNote, ready: true },
  { type: "idea", label: "Idée", icon: Lightbulb, ready: true },
  { type: "expense", label: "Dépense", icon: Receipt, ready: false },
  { type: "project", label: "Projet", icon: FolderPlus, ready: true },
  { type: "journal", label: "Journal", icon: BookOpen, ready: false },
];

export function QuickActionsCard() {
  const openCapture = useUIStore((s) => s.openCapture);

  return (
    <div className="glass shadow-soft rounded-3xl p-4">
      <h3 className="mb-2.5 px-0.5 text-[13px] font-medium text-foreground/80">Actions rapides</h3>
      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map((action) => (
          <button
            key={action.type}
            onClick={() => (action.ready ? openCapture(action.type) : toast("Ce module arrive bientôt"))}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-background/40 px-2 py-3 text-center text-[11px] text-foreground/75 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <action.icon className="size-[18px]" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
