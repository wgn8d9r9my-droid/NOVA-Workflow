"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/shared/stat-tile";
import { ClientFormDialog } from "@/components/business/client-form-dialog";
import { ClientCard } from "@/components/business/client-card";
import { ClientDetailSheet } from "@/components/business/client-detail-sheet";
import { useClientsStore } from "@/lib/store/finances";
import { useProjectsStore } from "@/lib/store/projects";
import { useTransactionsStore } from "@/lib/store/finances";
import { formatEUR } from "@/lib/finance-derived";

export default function BusinessPage() {
  const clients = useClientsStore((s) => s.items);
  const projects = useProjectsStore((s) => s.items);
  const transactions = useTransactionsStore((s) => s.items);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const clientProjects = useMemo(() => projects.filter((p) => p.type === "client"), [projects]);
  const totalRevenue = useMemo(
    () => transactions.filter((t) => t.source_type === "business" && t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Business</h1>
        <ClientFormDialog
          trigger={
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" /> Nouveau client
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Clients" value={String(clients.length)} />
        <StatTile label="Projets clients" value={String(clientProjects.length)} />
        <StatTile label="Revenus business" value={formatEUR(totalRevenue)} tone="positive" />
      </div>

      {clients.length === 0 ? (
        <p className="px-1 py-12 text-center text-sm text-muted-foreground">
          Aucun client encore — ajoute le premier avec le bouton ci-dessus.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} onClick={() => setSelectedClientId(client.id)} />
          ))}
        </div>
      )}

      <ClientDetailSheet clientId={selectedClientId} onOpenChange={(v) => !v && setSelectedClientId(null)} />
    </div>
  );
}
