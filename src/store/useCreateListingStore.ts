import { create } from 'zustand';

type Listing = {
  name: string;
  property_type_category: string;
  lat: number | undefined;
  lng: number | undefined;
  street: string;
  apt: string;

  country_id: number | undefined;
  country_code: string;
  country_name: string;

  state_id: number | undefined;
  state: string;

  city_id: number | undefined;
  city: string;

  district_id: number | undefined;
  district: string;

  // ─── Step 2 fields ───────────────────────
  size_sqm: number;
  bedrooms: number;
  beds: number;
  kitchen: boolean;
  pool: boolean;
  long_term_stay: boolean;
  min_gap_night: number;
  min_nights: number;
  max_nights: number;
  // ─────────────────────────────────────────

  // ─── Step 4 fields ───────────────────────
  listing_descriptions: string;
  wifi_username: string;
  wifi_password: string;
  door_lock_code: string;
  // ─────────────────────────────────────────

  // ─── Booking Details fields ──────────────
  booking_type: string;
  guest_eligibility: boolean;
  check_in_time: string;
  check_out_time: string;
  // ─────────────────────────────────────────
};

type CreateListingState = {
  user_id: string;
  listing_id: string;
  channel_id: string;
  listing: Listing;

  setUserId: (id: string) => void;
  setListingId: (id: string) => void;
  setChannelId: (id: string) => void;
  updateListing: (data: Partial<Listing>) => void;
  resetListing: () => void;
};

const initialListing: Listing = {
  name: '',
  property_type_category: '',
  lat: undefined,
  lng: undefined,
  street: '',
  apt: '',

  country_id: undefined,
  country_code: '',
  country_name: '',

  state_id: undefined,
  state: '',

  city_id: undefined,
  city: '',

  district_id: undefined,
  district: '',

  // ─── Step 2 defaults ───
  size_sqm: 0,
  bedrooms: 0,
  beds: 0,
  kitchen: false,
  pool: false,
  long_term_stay: false,
  min_gap_night: 1,
  min_nights: 1,
  max_nights: 1,
  // ───────────────────────

  // ─── Step 4 defaults ───
  listing_descriptions: '',
  wifi_username: '',
  wifi_password: '',
  door_lock_code: '',
  // ───────────────────────

  // ─── Booking Details defaults ───
  booking_type: '',
  guest_eligibility: false,
  check_in_time: '',
  check_out_time: '',
  // ────────────────────────────────
};

export const useCreateListingStore = create<CreateListingState>((set) => ({
  user_id: '',
  listing_id: '',
  channel_id: '',
  listing: initialListing,

  setUserId:    (id)         => set({ user_id: id }),
  setListingId: (id)         => set({ listing_id: id }),
  setChannelId: (channel_id) => set({ channel_id }),

  updateListing: (data) =>
    set((state) => ({ listing: { ...state.listing, ...data } })),

  resetListing: () =>
    set({ user_id: '', listing_id: '', channel_id: '', listing: initialListing }),
}));