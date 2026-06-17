import type { StateCreator } from 'zustand';
import type { AppStore, UIState, UIActions, ViewMode, Theme } from '../types';
import { DEFAULT_UI_STATE } from '../defaults';

export const uiSlice: StateCreator<AppStore, [], [], UIState & UIActions> = (set) => ({
  // Initial state
  ...DEFAULT_UI_STATE,

  // Actions
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  openModal: (modalId: string) =>
    set(() => ({
      activeModal: modalId,
    })),

  closeModal: () =>
    set(() => ({
      activeModal: null,
    })),

  setViewMode: (mode: ViewMode) =>
    set(() => ({
      viewMode: mode,
    })),

  setTheme: (theme: Theme) =>
    set(() => ({
      theme,
    })),

  setDashboardChainFilter: (chain: string) =>
    set(() => ({
      dashboardChainFilter: chain,
    })),

  setDashboardSearchQuery: (query: string) =>
    set(() => ({
      dashboardSearchQuery: query,
    })),

  resetUIState: () =>
    set(() => DEFAULT_UI_STATE),
});
