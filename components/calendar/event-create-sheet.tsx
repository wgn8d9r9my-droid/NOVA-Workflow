"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, MapPin, Users, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CategoryPicker } from "@/components/calendar/category-picker";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/lib/store/tasks";
import { accentColors } from "@/lib/accent-colors";
import type { Priority } from "@/types/entities";

export function EventCreateSheet({
  date,
  open,
  onOpenChange,
}: {
  date: Date;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const addTask = useTasksStore((s) => s.add);

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(date);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");
  const [priority, setPriority] = useState<Priority>("P2");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);

  function reset() {
    setTitle("");
    setEventDate(date);
    setStartTime("");
    setEndTime("");
    setLocation("");
    setAttendees("");
    setPriority("P2");
    setCategoryId(undefined);
    setColor(undefined);
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v);
    if (!v) reset();
  }

  function submit() {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      priority,
      status: "todo",
      tags: [],
      due_date: format(eventDate, "yyyy-MM-dd"),
      due_time: startTime || undefined,
      end_time: startTime && endTime ? endTime : undefined,
      location: location.trim() || undefined,
      attendees: attendees.trim() || undefined,
      category_id: categoryId,
      color,
    });
    handleOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-5">
        <SheetHeader className="p-0">
          <SheetTitle>Nouvel évènement</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-5">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Titre de l'évènement"
            className="border-none px-0 text-lg font-medium shadow-none focus-visible:ring-0"
          />

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Priorité</p>
            <div className="flex gap-1.5">
              {(["P1", "P2", "P3"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    priority === p
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Date et heure</p>
            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <CalendarIcon className="size-3.5" />
                    {format(eventDate, "d MMM yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" locale={fr} selected={eventDate} onSelect={(d) => d && setEventDate(d)} />
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1.5">
                <Clock className="size-3.5 text-muted-foreground" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-[70px] bg-transparent text-sm text-foreground outline-none"
                />
              </div>

              {startTime && (
                <div className="flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1.5">
                  <span className="text-xs text-muted-foreground">à</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-[70px] bg-transparent text-sm text-foreground outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Lieu</p>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
              <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex : Salle 204, Zoom…"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Personnes</p>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
              <Users className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="Ex : Léa, M. Dupont…"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Catégorie</p>
            <CategoryPicker value={categoryId} onChange={setCategoryId} allowCreate />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Couleur de l&apos;évènement</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setColor(undefined)}
                title="Automatique"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-dashed text-muted-foreground transition-colors",
                  !color ? "border-foreground/50 text-foreground" : "border-border/60 hover:border-foreground/40"
                )}
              >
                <X className="size-3.5" />
              </button>
              {accentColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                  className={cn(
                    "size-7 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-105",
                    color === c.value ? "ring-foreground/50" : "ring-transparent"
                  )}
                  style={{ background: c.value }}
                />
              ))}
            </div>
          </div>

          <Button onClick={submit} disabled={!title.trim()} className="mt-1">
            Créer l&apos;évènement
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
