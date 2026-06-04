import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/storage/mmkv';
import { storage } from '@/storage/mmkv';
import { User } from '@/types/api/authTypes';


interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setHasSeenOnboarding: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      hasSeenOnboarding: false,
      setToken: (token) => set({ token, isLoggedIn: true }),
      setUser: (user) => set({ user }),
      setHasSeenOnboarding: () => set({ hasSeenOnboarding: true }),
      logout: () => {
        storage.remove('NAV_STATE');
        set({ token: null, user: null, isLoggedIn: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: zustandStorage,
    }
  )
);
