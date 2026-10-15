import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/is-configured";

// Keep the same reference unless the session actually changed — consumers
// like DataSync key their Realtime subscriptions off this object.
function sameUser(a: User | null, b: User | null) {
  return a?.id === b?.id && a?.updated_at === b?.updated_at;
}

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(!supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createClient();
    let cancelled = false;

    function apply(next: User | null) {
      setUser((prev) => (sameUser(prev, next) ? prev : next));
    }

    // getSession() reads the persisted session locally (refreshing the
    // token only if it is expired) and returns null only when there really
    // is no usable session. getUser() is a network round-trip that comes
    // back with a null user on any failure — a phone waking up before its
    // connection is back, a flaky wifi — which used to read as "logged out"
    // and bounced people to /login almost immediately.
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      apply(data.session?.user ?? null);
      setChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // A null session is only a real logout on SIGNED_OUT (or when there
      // was never a session). Ignore transient nulls from other events.
      if (!session && event !== "SIGNED_OUT" && event !== "INITIAL_SESSION") return;
      apply(session?.user ?? null);
      if (event === "INITIAL_SESSION") setChecked(true);
    });

    // Browsers throttle timers in background/inactive tabs, so the SDK's
    // scheduled token refresh can be missed if the tab sits idle for hours.
    // Force a refresh check the moment the tab regains focus, before that
    // staleness has a chance to look like a real logout.
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        supabase.auth.getSession();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return { user, checked };
}
