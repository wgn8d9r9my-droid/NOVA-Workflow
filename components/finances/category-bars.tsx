import { Card } from "@/components/ui/card";
import { formatEUR } from "@/lib/finance-derived";

export function CategoryBars({
  title,
  data,
}: {
  title: string;
  data: { category: string; amount: number }[];
}) {
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-medium text-foreground/80">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune donnée ce mois-ci.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((d) => (
            <div key={d.category}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground/80">{d.category}</span>
                <span className="tabular-nums text-muted-foreground">{formatEUR(d.amount)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max((d.amount / max) * 100, 3)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
