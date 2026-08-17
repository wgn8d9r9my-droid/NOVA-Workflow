import type { Transaction } from "@/types/entities";

export function inMonth(transactions: Transaction[], year: number, month: number) {
  return transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function inYear(transactions: Transaction[], year: number) {
  return transactions.filter((t) => new Date(t.date).getFullYear() === year);
}

export function summary(transactions: Transaction[]) {
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  return { income, expense, balance: income - expense };
}

export function categoryBreakdown(transactions: Transaction[], type: "income" | "expense") {
  const byCategory = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== type) continue;
    byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
  }
  return Array.from(byCategory.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function clientRevenue(transactions: Transaction[], clientId: string) {
  return transactions
    .filter((t) => t.client_id === clientId && t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function formatEUR(amount: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    amount
  );
}
