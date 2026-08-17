"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Plus, Search, ChevronRight, Sun, Moon, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePreferencesStore } from "@/lib/store/preferences";

export function Sidebar({
  onQuickCapture,
  onSearch,
}: {
  onQuickCapture: () => void;
  onSearch: () => void;
}) {
  const pathname = usePathname();
  const firstName = usePreferencesStore((s) => s.preferences.first_name);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const initial = firstName?.trim()?.[0]?.toUpperCase() || "N";
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  function cycleTheme() {
    if (currentTheme === "light") setTheme("dark");
    else if (currentTheme === "dark") setTheme("ambiance");
    else setTheme("light");
  }
  const ThemeIcon = currentTheme === "dark" ? Moon : currentTheme === "ambiance" ? Sparkles : Sun;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[92px] flex-col px-3 py-6 lg:flex xl:w-[276px] xl:px-4">
      <div className="glass shadow-float relative flex h-full w-full flex-col overflow-hidden rounded-4xl p-3 xl:p-5">
        <div className="pointer-events-none absolute -left-12 -top-20 size-56 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-12 size-48 rounded-full bg-glow/10 blur-3xl" />

        <Link href="/" className="relative z-10 mb-5 flex items-center gap-2.5 px-1 pt-1">
          <span className="orb-glow flex size-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-glow text-sm font-bold text-primary-foreground">
            N
          </span>
          <div className="hidden xl:block">
            <p className="text-[15px] font-semibold leading-tight tracking-tight">Nova</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Pense. Crée. Agis.
            </p>
          </div>
        </Link>

        <nav className="relative z-10 flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors xl:px-3",
                      active
                        ? "font-medium text-sidebar-accent-foreground"
                        : "text-foreground/65 hover:bg-black/[0.03] hover:text-foreground dark:hover:bg-white/[0.05]"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        className="absolute inset-0 rounded-xl bg-sidebar-accent"
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                        active && "bg-background/70 shadow-soft dark:bg-white/10"
                      )}
                    >
                      <item.icon className="size-[17px]" />
                    </span>
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

        <div className="relative z-10 flex flex-col gap-1.5 pt-3">
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

          <div className="my-1 h-px bg-border/60" />

          <button
            onClick={onQuickCapture}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform active:scale-[0.97] xl:justify-between xl:px-3"
          >
            <span className="flex items-center gap-2">
              <Plus className="size-4 shrink-0" />
              <span className="hidden xl:inline">Capture rapide</span>
            </span>
            <kbd className="hidden rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-medium xl:inline">
              ⌘
            </kbd>
          </button>

          <button
            onClick={onSearch}
            className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/40 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.05] xl:justify-between xl:px-3"
          >
            <span className="flex items-center gap-2">
              <Search className="size-4 shrink-0" />
              <span className="hidden xl:inline">Rechercher</span>
            </span>
            <kbd className="hidden rounded-md border border-border/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground xl:inline">
              ⌘K
            </kbd>
          </button>

          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={cycleTheme}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/40 text-foreground/70 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
              aria-label="Changer de thème"
            >
              <ThemeIcon className="size-4" />
            </button>

            <Link
              href="/settings"
              className="group flex flex-1 items-center gap-2.5 rounded-xl border border-border/60 bg-background/40 px-2.5 py-1.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-glow text-[11px] font-semibold text-primary-foreground">
                {initial}
              </span>
              <span className="hidden min-w-0 flex-1 xl:block">
                <span className="block truncate text-xs font-medium leading-tight">
                  {firstName || "Toi"}
                </span>
                <span className="block truncate text-[10px] leading-tight text-muted-foreground">
                  Espace personnel
                </span>
              </span>
              <ChevronRight className="hidden size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 xl:block" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
