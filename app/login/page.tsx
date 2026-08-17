"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/is-configured";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "Le lien de connexion a expiré ou est invalide. Réessaie." : null
  );

  async function sendMagicLink() {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setError("Impossible d'envoyer le lien. Vérifie l'adresse et réessaie.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass shadow-float w-full max-w-md rounded-4xl p-8">
        <div className="mb-8 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            N
          </span>
          <span className="text-sm font-medium text-muted-foreground">NOVA</span>
        </div>

        {!supabaseConfigured ? (
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold tracking-tight">Cloud non configuré</h1>
            <p className="text-sm text-muted-foreground">
              Cette instance de NOVA n&apos;est pas connectée à Supabase. Continue en local, ou configure
              les variables d&apos;environnement pour activer la synchronisation.
            </p>
          </div>
        ) : sent ? (
          <div className="flex flex-col gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Vérifie ta boîte mail</h1>
            <p className="text-sm text-muted-foreground">
              On a envoyé un lien de connexion à <span className="text-foreground">{email}</span>. Clique
              dessus pour accéder à NOVA sur cet appareil.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Reçois un lien de connexion par email — aucun mot de passe à retenir.
              </p>
            </div>
            <Input
              autoFocus
              type="email"
              autoComplete="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMagicLink()}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button onClick={sendMagicLink} disabled={!email.trim() || loading} className="justify-between">
              {loading ? "Envoi…" : "Recevoir le lien"} <Sparkles className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
