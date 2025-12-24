import { create } from 'zustand';

interface PhoneState {
  code?: string | null;
  phoneNumber: string | null;
  country?: string | null;
  setPhoneData: (data: {
    code?: string;
    phoneNumber: string;
    country?: string;
  }) => void;
  clearPhoneData: () => void;
}

export const usePhoneStore = create<PhoneState>((set) => ({
  code: null,
  phoneNumber: null,
  country: null,

  setPhoneData: ({ code, phoneNumber, country }) =>
    set({ code, phoneNumber, country }),

  clearPhoneData: () =>
    set({ code: null, phoneNumber: null, country: null }),
}));
