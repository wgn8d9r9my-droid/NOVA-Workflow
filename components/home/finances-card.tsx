import { formatEUR } from "@/lib/finance-derived";
import { WidgetCard } from "@/components/home/widget-card";

export function FinancesCard({
  income,
  expense,
  balance,
  monthLabel,
}: {
  income: number;
  expense: number;
  balance: number;
  monthLabel: string;
}) {
  const total = income + expense;
  const incomeShare = total > 0 ? (income / total) * 100 : 50;

  return (
    <WidgetCard title="Finances" href="/finances" hrefLabel={monthLabel}>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Revenus</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-positive">{formatEUR(income)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Dépenses</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-negative">{formatEUR(expense)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Solde</p>
          <p className="mt-0.5 truncate text-sm font-semibold">{formatEUR(balance)}</p>
        </div>
      </div>

      <div className="mt-3.5 flex h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-positive transition-[width]" style={{ width: `${incomeShare}%` }} />
        <div className="h-full flex-1 bg-negative/70" />
      </div>
    </WidgetCard>
  );
}
