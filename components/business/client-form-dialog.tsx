"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClientsStore } from "@/lib/store/finances";

export function ClientFormDialog({ trigger }: { trigger: ReactNode }) {
  const addClient = useClientsStore((s) => s.add);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function reset() {
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
  }

  function submit() {
    if (!name.trim()) return;
    addClient({
      name: name.trim(),
      company: company.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      status: "active",
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau client</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input autoFocus autoComplete="off" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
          <Input autoComplete="off" placeholder="Entreprise (optionnel)" value={company} onChange={(e) => setCompany(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input autoComplete="off" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input autoComplete="off" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button onClick={submit} disabled={!name.trim()} className="mt-1">
            Ajouter le client
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
