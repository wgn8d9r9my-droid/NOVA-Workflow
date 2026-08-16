import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True once persisted zustand stores have rehydrated from localStorage on the client. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
