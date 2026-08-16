"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Plus } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar({ onQuickCapture }: { onQuickCapture: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col items-center gap-1 py-6 lg:flex xl:w-64 xl:items-stretch xl:px-4">
      <div className="glass shadow-float flex h-full w-full flex-col rounded-4xl p-3 xl:p-4">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 px-2 pt-1 xl:px-1"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            N
          </span>
          <span className="hidden text-[15px] font-semibold tracking-tight xl:inline">
            Nova
          </span>
        </Link>

        <button
          onClick={onQuickCapture}
          className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform active:scale-[0.97] xl:justify-start xl:px-3"
        >
          <Plus className="size-4 shrink-0" />
          <span className="hidden xl:inline">Capture rapide</span>
        </button>

        <nav className="flex flex-1 flex-col gap-0.5">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-foreground/70 transition-colors xl:px-3",
                      active
                        ? "text-sidebar-accent-foreground"
                        : "hover:bg-black/[0.03] hover:text-foreground dark:hover:bg-white/[0.05]"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        className="absolute inset-0 rounded-xl bg-sidebar-accent"
                      />
                    )}
                    <item.icon className="relative z-10 size-[18px] shrink-0" />
                    <span className="relative z-10 hidden truncate xl:inline">
                      {item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="xl:hidden">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-foreground/60 transition-colors hover:bg-black/[0.03] hover:text-foreground dark:hover:bg-white/[0.05] xl:px-3",
                pathname === "/settings" && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Settings className="size-[18px] shrink-0" />
              <span className="hidden xl:inline">Réglages</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="xl:hidden">
            Réglages
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
