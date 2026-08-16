"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";

const primary = navItems.slice(0, 4);
const secondary = navItems.slice(4);

export function MobileNav({ onQuickCapture }: { onQuickCapture: () => void }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="glass shadow-float fixed inset-x-4 bottom-24 z-50 grid grid-cols-4 gap-1 rounded-3xl p-3 lg:hidden"
          >
            {secondary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className="flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-center text-foreground/70 active:bg-black/[0.04] dark:active:bg-white/[0.06]"
              >
                <item.icon className="size-5" />
                <span className="text-[11px] leading-none">{item.label}</span>
              </Link>
            ))}
            <Link
              href="/settings"
              onClick={() => setMoreOpen(false)}
              className="flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-center text-foreground/70 active:bg-black/[0.04] dark:active:bg-white/[0.06]"
            >
              <Menu className="size-5" />
              <span className="text-[11px] leading-none">Réglages</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="glass shadow-float fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-4xl px-2 py-2 lg:hidden">
        {primary.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-foreground/60",
                active && "text-primary"
              )}
            >
              <item.icon className="size-5" />
              <span className="text-[10px] leading-none">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={onQuickCapture}
          className="mx-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft active:scale-95"
        >
          <Plus className="size-5" />
        </button>

        <button
          onClick={() => setMoreOpen((v) => !v)}
          className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-foreground/60"
        >
          {moreOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="text-[10px] leading-none">Plus</span>
        </button>
      </nav>
    </>
  );
}
