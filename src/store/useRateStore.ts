import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/storage/mmkv';

interface ReviewData {
  step: number;
  formValues: {
    respect_house_rules: number;
    house_tags: string[];
    communication: number;
    comm_tags: string[];
    cleanliness: number;
    clean_tags: string[];
    public_review: string;
    recommend: boolean | null;
    feedback: string;
  };
}

interface RateState {
  // Store data per review ID
  reviews: Record<string, ReviewData>;
  setStep: (id: string, step: number) => void;
  updateForm: (id: string, values: Partial<ReviewData['formValues']>) => void;
  resetReview: (id: string) => void;
}

const initialReviewState = (): ReviewData => ({
  step: 0,
  formValues: {
    respect_house_rules: 0,
    house_tags: [],
    communication: 0,
    comm_tags: [],
    cleanliness: 0,
    clean_tags: [],
    public_review: '',
    recommend: null,
    feedback: '',
  },
});

export const useRateStore = create<RateState>()(
  persist(
    (set, get) => ({
      reviews: {},

      setStep: (id, step) =>
        set((state) => ({
          reviews: {
            ...state.reviews,
            [id]: { ...(state.reviews[id] || initialReviewState()), step },
          },
        })),

      updateForm: (id, values) =>
        set((state) => {
          const currentReview = state.reviews[id] || initialReviewState();
          return {
            reviews: {
              ...state.reviews,
              [id]: {
                ...currentReview,
                formValues: { ...currentReview.formValues, ...values },
              },
            },
          };
        }),

      resetReview: (id) =>
        set((state) => {
          const updatedReviews = { ...state.reviews };
          delete updatedReviews[id];
          return { reviews: updatedReviews };
        }),
    }),
    {
      name: 'rate-guest-storage-v2', // Changed name to reset old data structure
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);