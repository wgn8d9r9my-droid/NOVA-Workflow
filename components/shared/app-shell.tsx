"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Atmosphere } from "@/components/shared/atmosphere";
import { Sidebar } from "@/components/shared/sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { Topbar } from "@/components/shared/topbar";
import { QuickCapture } from "@/components/shared/quick-capture";
import { CommandPalette } from "@/components/shared/command-palette";
import { ApplyPreferences } from "@/components/shared/apply-preferences";
import { DataSync } from "@/components/shared/data-sync";
import { usePreferencesStore } from "@/lib/store/preferences";
import { useHydrated } from "@/lib/store/use-hydrated";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { useUIStore } from "@/lib/store/ui";

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const onboardingDone = usePreferencesStore((s) => s.preferences.onboarding_done);
  const { user, checked } = useSupabaseUser();
  const [prefsHydrated, setPrefsHydrated] = useState(!supabaseConfigured);

  const captureOpen = useUIStore((s) => s.captureOpen);
  const captureType = useUIStore((s) => s.captureType);
  const setCaptureOpen = useUIStore((s) => s.setCaptureOpen);
  const openCapture = useUIStore((s) => s.openCapture);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    if (checked && supabaseConfigured && !user) {
      router.replace("/login");
    }
  }, [checked, user, router]);

  // Pull remote preferences before evaluating the onboarding gate, so a second
  // device doesn't briefly think onboarding is unfinished and bounce there.
  useEffect(() => {
    if (!supabaseConfigured || !user) return;
    let cancelled = false;
    usePreferencesStore
      .getState()
      .hydrateFromRemote()
      .finally(() => {
        if (!cancelled) setPrefsHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (
      hydrated &&
      checked &&
      prefsHydrated &&
      (!supabaseConfigured || user) &&
      !onboardingDone &&
      pathname !== "/onboarding"
    ) {
      router.replace("/onboarding");
    }
  }, [hydrated, checked, prefsHydrated, user, onboardingDone, pathname, router]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const ready = hydrated && checked && prefsHydrated && (!supabaseConfigured || user) && onboardingDone;

  if (!ready) {
    return (
      <>
        {supabaseConfigured && user && <DataSync />}
        {theme === "ambiance" && <Atmosphere />}
        <div className="min-h-screen" />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      {theme === "ambiance" && <Atmosphere />}
      <DataSync />
      <ApplyPreferences />
      <Sidebar onQuickCapture={() => openCapture()} onSearch={() => setPaletteOpen(true)} />
      <main className="min-h-screen px-4 pb-28 pt-6 sm:px-6 lg:pb-10 lg:pl-[112px] lg:pr-8 lg:pt-8 xl:pl-[296px]">
        <Topbar onSearch={() => setPaletteOpen(true)} />
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
      <MobileNav onQuickCapture={() => openCapture()} />
      <QuickCapture open={captureOpen} initialType={captureType} onOpenChange={setCaptureOpen} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
