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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectsStore, useProjectFoldersStore } from "@/lib/store/projects";
import { useClientsStore } from "@/lib/store/finances";
import { projectStatusMeta, projectStatusOrder } from "@/lib/project-status";
import { projectColors } from "@/lib/project-colors";
import { EmojiPicker } from "@/components/shared/emoji-picker";
import { cn } from "@/lib/utils";
import type { ProjectStatus, ProjectType } from "@/types/entities";

export function ProjectFormDialog({ trigger }: { trigger: ReactNode }) {
  const addProject = useProjectsStore((s) => s.add);
  const clients = useClientsStore((s) => s.items);
  const folders = useProjectFoldersStore((s) => s.items);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProjectType>("personal");
  const [status, setStatus] = useState<ProjectStatus>("idea");
  const [deadline, setDeadline] = useState("");
  const [clientId, setClientId] = useState("none");
  const [folderId, setFolderId] = useState("none");
  const [emoji, setEmoji] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);

  function reset() {
    setName("");
    setDescription("");
    setType("personal");
    setStatus("idea");
    setDeadline("");
    setClientId("none");
    setFolderId("none");
    setEmoji(undefined);
    setColor(undefined);
  }

  function submit() {
    if (!name.trim()) return;
    addProject({
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      status,
      deadline: deadline || undefined,
      client_id: type === "client" && clientId !== "none" ? clientId : undefined,
      folder_id: folderId === "none" ? undefined : folderId,
      emoji,
      color,
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau projet</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            autoFocus
            placeholder="Nom du projet"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Description (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Type</p>
              <Select value={type} onValueChange={(v) => setType(v as ProjectType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personnel</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Statut</p>
              <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projectStatusOrder.map((s) => (
                    <SelectItem key={s} value={s}>
                      {projectStatusMeta[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Échéance (optionnel)</p>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          {folders.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Dossier (optionnel)</p>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun dossier</SelectItem>
                  {folders.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.emoji ? `${f.emoji} ` : ""}
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Couleur (optionnel)</p>
            <div className="flex gap-2">
              {projectColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(color === c ? undefined : c)}
                  className={cn(
                    "size-6 rounded-full ring-2 ring-offset-2 ring-offset-popover transition-transform hover:scale-105",
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

          {type === "client" && clients.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Client (optionnel)</p>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={submit} disabled={!name.trim()} className="mt-1">
            Créer le projet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
