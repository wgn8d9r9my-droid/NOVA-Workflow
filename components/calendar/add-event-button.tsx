"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EventCreateSheet } from "@/components/calendar/event-create-sheet";

export function AddEventButton({ date }: { date: Date }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass shadow-soft flex w-full items-center gap-2.5 rounded-2xl px-4 py-3 text-left text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Plus className="size-3.5" />
        </span>
        Ajouter un évènement…
      </button>
      <EventCreateSheet date={date} open={open} onOpenChange={setOpen} />
    </>
  );
}
