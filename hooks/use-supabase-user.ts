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
      setUser(data.user);
      setChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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
