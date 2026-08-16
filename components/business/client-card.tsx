"use client";

import { useMemo } from "react";
import { Building2 } from "lucide-react";
import { useProjectsStore } from "@/lib/store/projects";
import { useTransactionsStore } from "@/lib/store/finances";
import { clientRevenue, formatEUR } from "@/lib/finance-derived";
import type { Client } from "@/types/entities";

export function ClientCard({ client, onClick }: { client: Client; onClick: () => void }) {
  const allProjects = useProjectsStore((s) => s.items);
  const allTransactions = useTransactionsStore((s) => s.items);

  const projectCount = useMemo(
    () => allProjects.filter((p) => p.client_id === client.id).length,
    [allProjects, client.id]
  );
  const revenue = useMemo(() => clientRevenue(allTransactions, client.id), [allTransactions, client.id]);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-float"
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Building2 className="size-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{client.name}</p>
        {client.company && <p className="text-xs text-muted-foreground">{client.company}</p>}
      </div>
      <div className="mt-auto flex w-full items-center justify-between pt-2 text-xs text-muted-foreground">
        <span>{projectCount} projet{projectCount > 1 ? "s" : ""}</span>
        <span className="font-medium text-positive">{formatEUR(revenue)}</span>
      </div>
    </button>
  );
}
