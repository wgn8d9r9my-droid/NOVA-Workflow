import { useSyncExternalStore } from "react";

let current = new Date();

function subscribe(callback: () => void) {
  const id = setInterval(() => {
    current = new Date();
    callback();
  }, 30_000);
  return () => clearInterval(id);
}

/** Current time, refreshed every 30s on the client; null during SSR to avoid hydration mismatch. */
export function useNow(): Date | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null
  );
}
