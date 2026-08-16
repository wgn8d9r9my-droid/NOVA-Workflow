"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientsStore } from "@/lib/store/finances";
import { useProjectsStore } from "@/lib/store/projects";
import { useTransactionsStore } from "@/lib/store/finances";
import { clientRevenue, formatEUR } from "@/lib/finance-derived";
import { projectStatusMeta } from "@/lib/project-status";
import type { ClientStatus } from "@/types/entities";

export function ClientDetailSheet({
  clientId,
  onOpenChange,
}: {
  clientId: string | null;
  onOpenChange: (v: boolean) => void;
}) {
  const client = useClientsStore((s) => s.items.find((c) => c.id === clientId));
  const updateClient = useClientsStore((s) => s.update);
  const removeClient = useClientsStore((s) => s.remove);

  const allProjects = useProjectsStore((s) => s.items);
  const allTransactions = useTransactionsStore((s) => s.items);

  const projects = useMemo(
    () => (client ? allProjects.filter((p) => p.client_id === client.id) : []),
    [allProjects, client]
  );
  const revenue = useMemo(
    () => (client ? clientRevenue(allTransactions, client.id) : 0),
    [allTransactions, client]
  );

  if (!client) return null;

  return (
    <Sheet open={!!clientId} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 p-5">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Modifier le client</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <Input
              autoComplete="off"
              defaultValue={client.name}
              onBlur={(e) => e.target.value.trim() && updateClient(client.id, { name: e.target.value.trim() })}
              className="border-none px-0 text-lg font-semibold shadow-none focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => {
                removeClient(client.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <Input
            autoComplete="off"
            defaultValue={client.company}
            onBlur={(e) => updateClient(client.id, { company: e.target.value.trim() || undefined })}
            placeholder="Entreprise"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              autoComplete="off"
              defaultValue={client.email}
              onBlur={(e) => updateClient(client.id, { email: e.target.value.trim() || undefined })}
              placeholder="Email"
            />
            <Input
              autoComplete="off"
              defaultValue={client.phone}
              onBlur={(e) => updateClient(client.id, { phone: e.target.value.trim() || undefined })}
              placeholder="Téléphone"
            />
          </div>

          <Select value={client.status} onValueChange={(v) => updateClient(client.id, { status: v as ClientStatus })}>
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>

          <div className="rounded-2xl border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Revenus générés</p>
            <p className="mt-0.5 text-xl font-semibold text-positive">{formatEUR(revenue)}</p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Projets</p>
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun projet lié.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-sm hover:bg-muted"
                  >
                    {p.name}
                    <span className="text-xs text-muted-foreground">{projectStatusMeta[p.status].label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
