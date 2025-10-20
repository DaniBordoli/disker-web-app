// Store de autenticación con Zustand
// Adaptado del proyecto mobile para usar localStorage en lugar de AsyncStorage

import { create, type StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  id: number;
  email: string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  currentUser: AuthUser | null;
  isHydrated: boolean;
  lastFetchedUserAt: number | null; // ms since epoch
  
  // actions
  setTokens: (tokens: { accessToken: string | null; refreshToken: string | null }) => void;
  setCurrentUser: (user: AuthUser | null) => void;
  setLastFetchedUserAt: (ts: number | null) => void;
  clearSession: () => void;
}

const creator: StateCreator<AuthState> = (set) => ({
  accessToken: null,
  refreshToken: null,
  currentUser: null,
  isHydrated: false,
  lastFetchedUserAt: null,

  setTokens: (tokens: { accessToken: string | null; refreshToken: string | null }) => {
    set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  },

  setCurrentUser: (user: AuthUser | null) => {
    set({ currentUser: user });
  },

  setLastFetchedUserAt: (ts: number | null) => {
    set({ lastFetchedUserAt: ts });
  },

  clearSession: () => {
    set({ 
      accessToken: null, 
      refreshToken: null, 
      currentUser: null, 
      lastFetchedUserAt: null 
    });
  },
});

// Usar persist middleware para guardar en localStorage
export const useAuthStore = create<AuthState>()(
  persist(creator, {
    name: 'disker-auth-storage',
    onRehydrateStorage: () => (state) => {
      if (state) {
        state.isHydrated = true;
        // Inicializar refresh proactivo al hidratar
        if (state.accessToken) {
          // Importar dinámicamente para evitar dependencia circular
          import('../services/apiClient').then(({ scheduleProactiveRefresh }) => {
            scheduleProactiveRefresh();
          });
        }
      }
    },
  })
);
