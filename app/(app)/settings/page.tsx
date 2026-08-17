"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Check, Sun, Moon, Laptop, Sparkles, Trash2, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/lib/store/preferences";
import { accentColors } from "@/lib/accent-colors";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import type { Density } from "@/types/entities";

const THEME_OPTIONS = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
  { value: "ambiance", label: "Ambiance", icon: Sparkles },
  { value: "system", label: "Système", icon: Laptop },
];

function SettingsSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="text-sm font-medium">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const preferences = usePreferencesStore((s) => s.preferences);
  const setPreferences = usePreferencesStore((s) => s.setPreferences);
  const { user } = useSupabaseUser();
  const [confirmReset, setConfirmReset] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  function resetLocalData() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4 pb-6">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Réglages</h1>

      <SettingsSection title="Profil">
        <Input
          defaultValue={preferences.first_name}
          onBlur={(e) => e.target.value.trim() && setPreferences({ first_name: e.target.value.trim() })}
          placeholder="Ton prénom"
          className="max-w-xs"
        />
      </SettingsSection>

      <SettingsSection title="Apparence" description="Le mode clair est optimisé par défaut.">
        <div className="flex gap-2">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                theme === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
            >
              <opt.icon className="size-3.5" />
              {opt.label}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Couleur d'accent">
        <div className="flex flex-wrap gap-2.5">
          {accentColors.map((c) => (
            <button
              key={c.value}
              onClick={() => setPreferences({ accent_color: c.value })}
              title={c.name}
              className="flex size-8 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-card transition-transform hover:scale-105"
              style={{ backgroundColor: c.value, ["--tw-ring-color" as string]: preferences.accent_color === c.value ? c.value : "transparent" }}
            >
              {preferences.accent_color === c.value && <Check className="size-3.5 text-white" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Densité de l'interface">
        <div className="flex gap-2">
          {(["comfortable", "compact"] as Density[]).map((d) => (
            <button
              key={d}
              onClick={() => setPreferences({ density: d })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                preferences.density === d
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
            >
              {d === "comfortable" ? "Confortable" : "Compacte"}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Domaines importants">
        <div className="flex flex-wrap gap-1.5">
          {preferences.focus_areas.map((area) => (
            <span key={area} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
              {area}
            </span>
          ))}
          {preferences.focus_areas.length === 0 && (
            <p className="text-xs text-muted-foreground">Aucun domaine sélectionné.</p>
          )}
        </div>
      </SettingsSection>

      {supabaseConfigured && user && (
        <SettingsSection title="Compte" description={user.email}>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={signOut}>
            <LogOut className="size-3.5" />
            Se déconnecter
          </Button>
        </SettingsSection>
      )}

      <SettingsSection
        title="Données"
        description={
          supabaseConfigured
            ? "Tes données sont synchronisées dans le cloud."
            : "NOVA fonctionne en local pour le moment — connecte Supabase pour synchroniser dans le cloud."
        }
      >
        <Button
          variant={confirmReset ? "destructive" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={resetLocalData}
          onBlur={() => setConfirmReset(false)}
        >
          <Trash2 className="size-3.5" />
          {confirmReset ? "Confirmer la réinitialisation" : "Réinitialiser les données locales"}
        </Button>
      </SettingsSection>
    </div>
  );
}
