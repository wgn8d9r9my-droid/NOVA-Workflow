"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/shared/emoji-picker";
import { cn } from "@/lib/utils";
import { useProjectFoldersStore } from "@/lib/store/projects";
import { projectColors } from "@/lib/project-colors";

export function FolderFormDialog({ trigger }: { trigger: ReactNode }) {
  const addFolder = useProjectFoldersStore((s) => s.add);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(projectColors[0]);
  const [emoji, setEmoji] = useState<string | undefined>(undefined);

  function reset() {
    setName("");
    setColor(projectColors[0]);
    setEmoji(undefined);
  }

  function submit() {
    if (!name.trim()) return;
    addFolder({ name: name.trim(), color, emoji });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau dossier</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            autoFocus
            autoComplete="off"
            placeholder="Ex. Clients 2026, Perso, YouTube…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Couleur</p>
            <div className="flex gap-2">
              {projectColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "size-7 rounded-full ring-2 ring-offset-2 ring-offset-popover transition-transform hover:scale-105",
                    color === c ? "ring-foreground/40" : "ring-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Emoji (optionnel)</p>
            <EmojiPicker value={emoji} onChange={setEmoji} />
          </div>

          <Button onClick={submit} disabled={!name.trim()} className="mt-1">
            Créer le dossier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
