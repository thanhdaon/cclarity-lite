import { create } from "zustand";

interface AppState {
  promt: string;
  setPromt: (promt: string) => void;
}

export const useAppState = create<AppState>((set) => ({
  promt: "",
  setPromt: (promt) => set({ promt }),
}));
