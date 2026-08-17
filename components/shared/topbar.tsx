"use client";

import Link from "next/link";
import { Bell, Bookmark, Search, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Topbar({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="mx-auto mb-6 flex w-full max-w-6xl items-center gap-3">
      <button
        onClick={onSearch}
        className="glass shadow-soft flex flex-1 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 truncate">Rechercher n&apos;importe quoi…</span>
        <kbd className="hidden shrink-0 rounded-md border border-border/60 px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className="glass shadow-soft flex size-10 shrink-0 items-center justify-center rounded-2xl text-foreground/70 transition-colors hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-[18px]" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <p className="px-1 py-1 text-sm font-medium">Notifications</p>
          <p className="px-1 pb-1 text-xs text-muted-foreground">
            Rien de nouveau pour l&apos;instant — tu es à jour.
          </p>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/creative"
            className="glass shadow-soft flex size-10 shrink-0 items-center justify-center rounded-2xl text-foreground/70 transition-colors hover:text-foreground"
          >
            <Bookmark className="size-[18px]" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">Notes & idées</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/nova"
            className="orb-glow flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-glow text-primary-foreground transition-transform active:scale-95"
          >
            <Sparkles className="size-[18px]" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">Nova AI</TooltipContent>
      </Tooltip>
    </div>
  );
}
