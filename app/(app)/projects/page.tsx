"use client";

import { useMemo, useState } from "react";
import { Plus, LayoutGrid, Kanban, List as ListIcon, GanttChartSquare, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { FolderFormDialog } from "@/components/projects/folder-form-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { ProjectList } from "@/components/projects/project-list";
import { useProjectsStore, useProjectFoldersStore } from "@/lib/store/projects";
import { projectStatusMeta, projectStatusOrder } from "@/lib/project-status";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/entities";

type ViewMode = "cards" | "kanban" | "list";

export default function ProjectsPage() {
  const projects = useProjectsStore((s) => s.items);
  const folders = useProjectFoldersStore((s) => s.items);
  const [view, setView] = useState<ViewMode>("cards");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [folderFilter, setFolderFilter] = useState<string | "all">("all");

  const filtered = useMemo(() => {
    let result = projects;
    if (statusFilter !== "all") result = result.filter((p) => p.status === statusFilter);
    if (folderFilter !== "all") result = result.filter((p) => p.folder_id === folderFilter);
    return result;
  }, [projects, statusFilter, folderFilter]);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <div className="flex gap-2">
          <FolderFormDialog
            trigger={
              <Button size="sm" variant="outline" className="gap-1.5">
                <FolderPlus className="size-4" /> Dossier
              </Button>
            }
          />
          <ProjectFormDialog
            trigger={
              <Button size="sm" className="gap-1.5">
                <Plus className="size-4" /> Nouveau projet
              </Button>
            }
          />
        </div>
      </div>

      {folders.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFolderFilter("all")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              folderFilter === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 text-muted-foreground hover:bg-muted"
            )}
          >
            Tous les dossiers
          </button>
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setFolderFilter(folder.id)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                folderFilter === folder.id
                  ? "text-white"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
              style={folderFilter === folder.id ? { backgroundColor: folder.color, borderColor: folder.color } : undefined}
            >
              {folder.emoji && <span>{folder.emoji}</span>}
              {folder.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatusFilter("all")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              statusFilter === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 text-muted-foreground hover:bg-muted"
            )}
          >
            Tous
          </button>
          {projectStatusOrder.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                statusFilter === status
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
            >
              {projectStatusMeta[status].label}
            </button>
          ))}
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="cards" className="gap-1.5">
              <LayoutGrid className="size-3.5" /> Cards
            </TabsTrigger>
            <TabsTrigger value="kanban" className="gap-1.5">
              <Kanban className="size-3.5" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-1.5">
              <ListIcon className="size-3.5" /> Liste
            </TabsTrigger>
            <TabsTrigger value="timeline" disabled className="gap-1.5 opacity-40">
              <GanttChartSquare className="size-3.5" /> Timeline
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <p className="px-1 py-12 text-center text-sm text-muted-foreground">
          Aucun projet ici — crée le premier avec le bouton ci-dessus.
        </p>
      ) : view === "cards" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : view === "kanban" ? (
        <KanbanBoard projects={filtered} />
      ) : (
        <ProjectList projects={filtered} />
      )}
    </div>
  );
}
