"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/lib/store/preferences";
import { useHydrated } from "@/lib/store/use-hydrated";
import { Logo } from "@/components/shared/logo";

const AREAS = [
  "Business & création",
  "Finances",
  "Sport & santé",
  "Créativité",
  "Lecture",
  "Relations",
  "Objectifs perso",
];

export default function OnboardingPage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const setPreferences = usePreferencesStore((s) => s.setPreferences);

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [areas, setAreas] = useState<string[]>([]);

  if (!hydrated) return <div className="min-h-screen bg-background" />;

  function toggleArea(area: string) {
    setAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));
  }

  function finish() {
    setPreferences({
      first_name: firstName.trim() || "toi",
      focus_areas: areas,
      onboarding_done: true,
    });
    router.replace("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass shadow-float w-full max-w-md rounded-4xl p-8">
        <div className="mb-8 flex items-center gap-2">
          <Logo size={32} />
          <span className="text-sm font-medium text-muted-foreground">Bienvenue dans NOVA</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Comment tu t&apos;appelles ?</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Nova va s&apos;adresser à toi directement.
                </p>
              </div>
              <Input
                autoFocus
                placeholder="Ton prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && firstName.trim() && setStep(1)}
              />
              <Button onClick={() => setStep(1)} disabled={!firstName.trim()} className="justify-between">
                Continuer <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Qu&apos;est-ce qui compte le plus pour toi ?
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Choisis-en quelques-uns — modifiable à tout moment.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                      areas.includes(area)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/70 text-foreground/70 hover:bg-muted"
                    )}
                  >
                    {area}
                  </button>
                ))}
              </div>
              <Button onClick={finish} className="justify-between">
                Entrer dans Nova <Sparkles className="size-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
