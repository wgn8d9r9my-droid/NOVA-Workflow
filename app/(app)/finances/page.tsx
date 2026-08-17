"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatTile } from "@/components/shared/stat-tile";
import { TransactionFormDialog } from "@/components/finances/transaction-form-dialog";
import { TransactionList } from "@/components/finances/transaction-list";
import { CategoryBars } from "@/components/finances/category-bars";
import { useTransactionsStore } from "@/lib/store/finances";
import { inMonth, inYear, summary, categoryBreakdown, formatEUR } from "@/lib/finance-derived";

type PeriodOption = "this-month" | "other-month" | "this-year" | "last-year" | "all";

export default function FinancesPage() {
  const transactions = useTransactionsStore((s) => s.items);
  const now = useMemo(() => new Date(), []);
  const [period, setPeriod] = useState<PeriodOption>("this-month");
  const [otherMonth, setOtherMonth] = useState(
    () => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  const { periodTransactions, periodLabel } = useMemo(() => {
    switch (period) {
      case "this-month":
        return {
          periodTransactions: inMonth(transactions, now.getFullYear(), now.getMonth()),
          periodLabel: now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
        };
      case "other-month": {
        const [y, m] = otherMonth.split("-").map(Number);
        return {
          periodTransactions: inMonth(transactions, y, m - 1),
          periodLabel: new Date(y, m - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
        };
      }
      case "this-year":
        return {
          periodTransactions: inYear(transactions, now.getFullYear()),
          periodLabel: String(now.getFullYear()),
        };
      case "last-year":
        return {
          periodTransactions: inYear(transactions, now.getFullYear() - 1),
          periodLabel: String(now.getFullYear() - 1),
        };
      case "all":
        return { periodTransactions: transactions, periodLabel: "Toutes périodes" };
    }
  }, [period, otherMonth, transactions, now]);

  const { income, expense, balance } = useMemo(() => summary(periodTransactions), [periodTransactions]);
  const expenseByCategory = useMemo(() => categoryBreakdown(periodTransactions, "expense"), [periodTransactions]);
  const incomeByCategory = useMemo(() => categoryBreakdown(periodTransactions, "income"), [periodTransactions]);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Finances</h1>
          <p className="mt-0.5 text-sm capitalize text-muted-foreground">{periodLabel}</p>
        </div>
        <TransactionFormDialog
          trigger={
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" /> Transaction
            </Button>
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={period} onValueChange={(v) => setPeriod(v as PeriodOption)}>
          <SelectTrigger size="sm" className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">Ce mois</SelectItem>
            <SelectItem value="other-month">Un autre mois</SelectItem>
            <SelectItem value="this-year">Cette année</SelectItem>
            <SelectItem value="last-year">L&apos;année dernière</SelectItem>
            <SelectItem value="all">Total</SelectItem>
          </SelectContent>
        </Select>

        {period === "other-month" && (
          <input
            type="month"
            value={otherMonth}
            onChange={(e) => setOtherMonth(e.target.value)}
            className="h-7 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        )}
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
        <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">Transactions de la période</p>
        <TransactionList transactions={periodTransactions} />
      </div>
    </div>
  );
}
