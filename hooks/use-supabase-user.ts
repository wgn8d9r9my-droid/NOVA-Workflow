import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/is-configured";

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(!supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser((prev) => {
        if (prev?.id === data.user?.id && prev?.updated_at === data.user?.updated_at) return prev;
        return data.user;
      });
      setChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // onAuthStateChange fires on every token refresh (and once immediately
      // with INITIAL_SESSION on mount) with a freshly-deserialized user
      // object — a new reference even when it's the same session. Consumers
      // like DataSync key their Realtime subscriptions off this value, so a
      // new reference every few minutes was tearing down and rebuilding all
      // channels in a loop, which is what made sync work only briefly after
      // load. Keep the same reference unless the session actually changed.
      setUser((prev) => {
        const next = session?.user ?? null;
        if (prev?.id === next?.id && prev?.updated_at === next?.updated_at) return prev;
        return next;
      });
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
      listener.subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return { user, checked };
}
