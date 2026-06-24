import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  setSidebar: (value) =>
    set({ isSidebarOpen: value }),
}));