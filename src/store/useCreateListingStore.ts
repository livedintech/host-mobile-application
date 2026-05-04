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

  // ─── Naye Design ke Mutabiq Changes (Step 2) ───────────────────────
  guest_limit: number;     // <-- Pehle nahi tha (Design mein hai)
  bathrooms: number;       // <-- Pehle nahi tha (Design mein hai)
  amenities: string[];     // <-- Pehle kitchen/pool alag thay, ab array mein jayenge

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

  // ─── House Guidelines fields ─────────────
  arrival_guide: string;
  house_rules: string;
  checkout_instructions: string;
  // ─────────────────────────────────────────

  // ─── Cancel Policies fields ──────────────
  cancel_policy_airbnb: string;
  cancel_policy_gathern: string;
  cancel_policy_booking: string;
  // ─────────────────────────────────────────

  // ─── AI Dynamic Pricing fields ───────────
  pricing_mode: string;
  manual_price_override: boolean;
  // ─────────────────────────────────────────

  // ─── Set Pricing fields ──────────────────
  listing_currency: string;
  weekday_base_price: string;
  weekend_base_price: string;
  discount: string;
  tax_vat: string;
  markup_price: string;
  cleaning_fee: string;
  airbnb_discount: string;
  gathern_discount: string;
  booking_discount: string;
  extra_guest_fee: string;
  weekly_discount: string;
  monthly_discount: string;
  early_bird_discount: string;
  last_minute_discount: string;
  prices?: {
    airbnb_discount?: number;
    gathern_discount?: number;
    bookingCom_discount?: number;
    discount?: number;
    weekly_discount?: number;
    monthly_discount?: number;
    early_bird_discount?: number;
    last_minute_discount?: number;
  };
  // ─────────────────────────────────────────

  // ─── Document Upload fields ──────────────
  property_ownership_doc: string;
  authority_license_doc: string;
  national_id_doc: string;
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
  guest_limit: 0,
  bathrooms: 0,
  amenities: [],
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

  // ─── House Guidelines defaults ───
  arrival_guide: '',
  house_rules: '',
  checkout_instructions: '',
  // ─────────────────────────────────

  // ─── Cancel Policies defaults ────
  cancel_policy_airbnb: '',
  cancel_policy_gathern: '',
  cancel_policy_booking: '',
  // ─────────────────────────────────

  // ─── AI Dynamic Pricing defaults ─
  pricing_mode: '',
  manual_price_override: false,
  // ─────────────────────────────────

  // ─── Set Pricing defaults ────────
  listing_currency: '',
  weekday_base_price: '',
  weekend_base_price: '',
  discount: '',
  tax_vat: '',
  markup_price: '',
  cleaning_fee: '',
  airbnb_discount: '',
  gathern_discount: '',
  booking_discount: '',
  extra_guest_fee: '',
  weekly_discount: '',
  monthly_discount: '',
  early_bird_discount: '',
  last_minute_discount: '',
  // ─────────────────────────────────

  // ─── Document Upload defaults ────
  property_ownership_doc: '',
  authority_license_doc: '',
  national_id_doc: '',
  // ─────────────────────────────────
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