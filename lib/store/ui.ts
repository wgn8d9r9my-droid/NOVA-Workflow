import { create } from "zustand";

export type CaptureType = "task" | "note" | "idea" | "project" | "expense" | "journal";

interface UIState {
  captureOpen: boolean;
  captureType?: CaptureType;
  openCapture: (type?: CaptureType) => void;
  setCaptureOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  captureOpen: false,
  captureType: undefined,
  openCapture: (type) => set({ captureOpen: true, captureType: type }),
  setCaptureOpen: (open) => set({ captureOpen: open }),
}));
