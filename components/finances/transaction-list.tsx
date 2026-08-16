"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { formatEUR } from "@/lib/finance-derived";
import { useTransactionsStore } from "@/lib/store/finances";
import type { Transaction } from "@/types/entities";
import { cn } from "@/lib/utils";

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const removeTransaction = useTransactionsStore((s) => s.remove);

  if (transactions.length === 0) {
    return <p className="px-1 py-8 text-center text-sm text-muted-foreground">Aucune transaction ce mois-ci.</p>;
  }

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card">
      {sorted.map((t) => (
        <div key={t.id} className="group flex items-center gap-3 px-4 py-3">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              t.type === "income" ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
            )}
          >
            {t.type === "income" ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{t.description || t.category}</p>
            <p className="text-xs text-muted-foreground">
              {t.category} · {format(new Date(t.date), "d MMM", { locale: fr })}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 text-sm font-medium tabular-nums",
              t.type === "income" ? "text-positive" : "text-negative"
            )}
          >
            {t.type === "income" ? "+" : "−"}
            {formatEUR(t.amount)}
          </span>
          <button
            onClick={() => removeTransaction(t.id)}
            className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      ))}
    </div>
  );
}
