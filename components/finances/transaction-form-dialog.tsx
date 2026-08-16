"use client";

import { useState, type ReactNode } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTransactionsStore, useClientsStore } from "@/lib/store/finances";
import { incomeCategories, expenseCategories } from "@/lib/finance-categories";
import type { TransactionType, TransactionSource } from "@/types/entities";

export function TransactionFormDialog({ trigger }: { trigger: ReactNode }) {
  const addTransaction = useTransactionsStore((s) => s.add);
  const clients = useClientsStore((s) => s.items);
  const [open, setOpen] = useState(false);

  const [type, setType] = useState<TransactionType>("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(incomeCategories[0]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState<TransactionSource>("business");
  const [clientId, setClientId] = useState<string>("none");

  function reset() {
    setType("income");
    setAmount("");
    setCategory(incomeCategories[0]);
    setDate(format(new Date(), "yyyy-MM-dd"));
    setDescription("");
    setSourceType("business");
    setClientId("none");
  }

  function submit() {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;
    addTransaction({
      type,
      amount: parsed,
      category,
      date,
      description: description.trim() || undefined,
      source_type: sourceType,
      client_id: clientId === "none" ? undefined : clientId,
    });
    reset();
    setOpen(false);
  }

  const categories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle transaction</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {(["income", "expense"] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  setCategory(t === "income" ? incomeCategories[0] : expenseCategories[0]);
                }}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                  type === t
                    ? t === "income"
                      ? "border-positive bg-positive/10 text-positive"
                      : "border-negative bg-negative/10 text-negative"
                    : "border-border/60 text-muted-foreground hover:bg-muted"
                )}
              >
                {t === "income" ? "Revenu" : "Dépense"}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Input
              autoFocus
              type="number"
              placeholder="Montant (€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Description (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Origine</p>
              <Select value={sourceType} onValueChange={(v) => setSourceType(v as TransactionSource)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personnel</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {type === "income" && clients.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Client</p>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={submit} disabled={!amount || Number(amount) <= 0} className="mt-1">
            Ajouter la transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
