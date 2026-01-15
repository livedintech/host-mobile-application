import { create } from 'zustand';

type Listing = {
  name: string;
  property_type_category: string;
  lat: number | null;
  lng: number | null;
  street: string;
  apt: string;
  city: string;
  state: string;
  country_code: string;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  min_nights: number;
  check_in_time: string;
  check_out_time: string;
  instant_booking: boolean;
};

type CreateListingState = {
  user_id: number | null;
  listing_id: number | null;
  listing: Listing;

  // actions
  setUserId: (id: number) => void;
  setListingId: (id: number) => void;
  updateListing: (data: Partial<Listing>) => void;
  resetListing: () => void;
};

const initialListing: Listing = {
  name: '',
  property_type_category: '',
  lat: null,
  lng: null,
  street: '',
  apt: '',
  city: '',
  state: '',
  country_code: '',
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  min_nights: 1,
  check_in_time: '',
  check_out_time: '',
  instant_booking: false,
};

export const useCreateListingStore = create<CreateListingState>((set) => ({
  user_id: null,
  listing_id: null,
  listing: initialListing,

  setUserId: (id) => set({ user_id: id }),

  setListingId: (id) => set({ listing_id: id }),

  updateListing: (data) =>
    set((state) => ({
      listing: {
        ...state.listing,
        ...data,
      },
    })),

  resetListing: () =>
    set({
      user_id: null,
      listing_id: null,
      listing: initialListing,
    }),
}));
