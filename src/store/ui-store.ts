import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (value: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebar: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isMobileSidebarOpen: false,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  setSidebar: (value) => set({ isSidebarOpen: value }),

  toggleMobileSidebar: () =>
    set((state) => ({
      isMobileSidebarOpen: !state.isMobileSidebarOpen,
    })),

  setMobileSidebar: (value) => set({ isMobileSidebarOpen: value }),
}));
