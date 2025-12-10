import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/storage/mmkv';
import { User } from '@/types/api/authTypes';


interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      setToken: (token) => set({ token, isLoggedIn: true }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: zustandStorage,
    }
  )
);
