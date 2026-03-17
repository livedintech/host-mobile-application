import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/storage/mmkv'; 

interface RateState {
  step: number;
  formValues: {
    respect_house_rules: number;
    house_tags: string[];
    communication: number;
    comm_tags: string[];
    cleanliness: number;
    clean_tags: string[];
    recommend: boolean | null;
    feedback: string;
  };
  setStep: (step: number) => void;
  updateForm: (values: Partial<RateState['formValues']>) => void;
  resetStore: () => void;
}

export const useRateStore = create<RateState>()(
  persist(
    (set) => ({
      step: 0,
      formValues: {
        respect_house_rules: 0,
        house_tags: [],
        communication: 0,
        comm_tags: [],
        cleanliness: 0,
        clean_tags: [],
        recommend: null,
        feedback: '',
      },
      setStep: (step) => set({ step }),
      updateForm: (values) =>
        set((state) => ({
          formValues: { ...state.formValues, ...values },
        })),
      resetStore: () =>
        set({
          step: 0,
          formValues: {
            respect_house_rules: 0,
            house_tags: [],
            communication: 0,
            comm_tags: [],
            cleanliness: 0,
            clean_tags: [],
            recommend: null,
            feedback: '',
          },
        }),
    }),
    {
      name: 'rate-guest-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);