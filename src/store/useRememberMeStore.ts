import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/storage/mmkv';

interface RememberMeState {
  rememberMe: boolean;
  password: string;
  phoneNumber: string;
  cca2: string;
  callingCode: string;
  setRememberMe: (value: boolean) => void;
  setPassword: (password: string) => void;
  setPhoneData: (phoneNumber: string, cca2: string, callingCode: string) => void;
  clearCredentials: () => void;
}

export const useRememberMeStore = create<RememberMeState>()(
  persist(
    (set) => ({
      rememberMe: false,
      password: '',
      phoneNumber: '',
      cca2: '',
      callingCode: '',
      setRememberMe: (value) => set({ rememberMe: value }),
      setPassword: (password) => set({ password }),
      setPhoneData: (phoneNumber, cca2, callingCode) =>
        set({ phoneNumber, cca2, callingCode }),
      clearCredentials: () =>
        set({
          rememberMe: false,
          password: '',
          phoneNumber: '',
          cca2: '',
          callingCode: '',
        }),
    }),
    {
      name: 'remember-me-storage',
      storage: zustandStorage,
    }
  )
);
