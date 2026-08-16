"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/shared/stat-tile";
import { TransactionFormDialog } from "@/components/finances/transaction-form-dialog";
import { TransactionList } from "@/components/finances/transaction-list";
import { CategoryBars } from "@/components/finances/category-bars";
import { useTransactionsStore } from "@/lib/store/finances";
import { inMonth, summary, categoryBreakdown, formatEUR } from "@/lib/finance-derived";

export default function FinancesPage() {
  const transactions = useTransactionsStore((s) => s.items);

  const now = new Date();
  const monthly = useMemo(
    () => inMonth(transactions, now.getFullYear(), now.getMonth()),
    [transactions, now]
  );
  const { income, expense, balance } = useMemo(() => summary(monthly), [monthly]);
  const expenseByCategory = useMemo(() => categoryBreakdown(monthly, "expense"), [monthly]);
  const incomeByCategory = useMemo(() => categoryBreakdown(monthly, "income"), [monthly]);

  const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Finances</h1>
          <p className="mt-0.5 text-sm capitalize text-muted-foreground">{monthLabel}</p>
        </div>
        <TransactionFormDialog
          trigger={
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" /> Transaction
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Revenus" value={formatEUR(income)} tone="positive" />
        <StatTile label="Dépenses" value={formatEUR(expense)} tone="negative" />
        <StatTile label="Solde" value={formatEUR(balance)} tone={balance >= 0 ? "positive" : "negative"} />
      </div>

      {(expenseByCategory.length > 0 || incomeByCategory.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          <CategoryBars title="Dépenses par catégorie" data={expenseByCategory} />
          <CategoryBars title="Revenus par catégorie" data={incomeByCategory} />
        </div>
      )}

      <div>
        <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">Transactions du mois</p>
        <TransactionList transactions={monthly} />
      </div>
    </div>
  );
}
