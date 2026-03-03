export interface ListingDetails {
  name?: string;
  property_type_category?: string;
  lat?: number;
  lng?: number;
  street?: string;
  apt?: string;

  // Location strings (sent to API)
  city?: string;
  state?: string;
  district?: string;
  country_code?: string;
  country_name?: string;

  // Location ids (sent to API alongside names)
  country_id?: number;
  state_id?: number;
  city_id?: number;
  district_id?: number;

  // ─── Step 2 fields (image ke mutabiq) ───────────────────────
  size_sqm?: number;
  bedrooms?: number;
  beds?: number;
  kitchen?: boolean;
  pool?: boolean;
  long_term_stay?: boolean;
  min_gap_night?: number;
  min_nights?: number;
  max_nights?: number;
  // ─────────────────────────────────────────────────────────────

  // ─── Step 4 fields ───────────────────────────────────────────
  listing_descriptions?: string;
  wifi_username?: string;
  wifi_password?: string;
  door_lock_code?: string;
  // ─────────────────────────────────────────────────────────────

  // ─── Booking Details fields ───────────────────────────────────
  booking_type?: string;
  guest_eligibility?: boolean;
  check_in_time?: string;
  check_out_time?: string;
  // ─────────────────────────────────────────────────────────────

  // ─── House Guidelines fields ──────────────────────────────────
  arrival_guide?: string;
  house_rules?: string;
  checkout_instructions?: string;
  // ─────────────────────────────────────────────────────────────

  // ─── Cancel Policies fields ───────────────────────────────────
  cancel_policy_airbnb?: string;
  cancel_policy_gathern?: string;
  cancel_policy_booking?: string;
  // ─────────────────────────────────────────────────────────────

  // ─── AI Dynamic Pricing fields ────────────────────────────────
  pricing_mode?: string;
  manual_price_override?: boolean;
  // ─────────────────────────────────────────────────────────────

  // ─── Set Pricing fields ───────────────────────────────────────
  weekday_base_price?: string;
  weekend_base_price?: string;
  discount?: string;
  tax_vat?: string;
  markup_price?: string;
  cleaning_fee?: string;
  airbnb_discount?: string;
  gathern_discount?: string;
  booking_discount?: string;
  extra_guest_fee?: string;
  // ─────────────────────────────────────────────────────────────

  // ─── Document Upload fields ───────────────────────────────────
  property_ownership_doc?: string;
  authority_license_doc?: string;
  national_id_doc?: string;
  // ─────────────────────────────────────────────────────────────

  disclosures?: {
    cameras?: boolean;
    noise?: boolean;
    weapons?: boolean;
  };
}

export interface CreateListingDetailsPayload {
  user_id?: string;
  channel_id?: string | null;
  listing_id?: string | null;
  listing?: ListingDetails;
}
export interface CreateListingExportPayloadType {
  channel_id?: string | null;
  listing_id?: string | null;
}

export interface CreateListingDetailsResponse {
  status: string;
  message: string;
  listing_id?: string;
  data: {};
}

export interface createListingPricingPayload {
  user_id: number;
  listing_id: string;
  channel_id: string;
  listing_currency: string;
  save_and_exit: number; // Swagger requirement
  prices: {
    weekday: number;
    weekend: number;
    cleaning_fee: number;
    security_deposit: number;
    price_per_extra_person: number; // Added
    discount: number;
    tax: number;
    markup: number;
    airbnb_discount: number; // Added
    gathern_discount: number; // Added
    bookingCom_discount: number; // Added (Exact Swagger name)
  };
}

export interface createListingPricingResponse {
  status: string;
  message: string;
  data: {};
}

export interface CreateListingResponse {
  status: string;
  message: string;
  data: {
    listing_id: string;
  };
}

export interface CreateListingPayload {
  user_id: number;
  payload: {
    listing: {
      property_type_category: string;
      name: string;
    };
  };
}

export interface getChannelIDResponse {
  status: string;
  message: string;
  data: getChannelIDItemResponse[];
}

export interface getChannelIDItemResponse {
  id: number;
  user_id: number;
  ch_channel_id: string;
  connection_type: any;
}

export interface ManageListingsResponse {
  status: string;
  message: string;
  data: ManageListingItem[];
}

export interface ManageListingItem {
  id: string | number;
  type: string | null;
  name: string;
  city?: string | null;
  country_code?: string | null;
  apt?: string;
  state?: string;
  occupancies: number[];
  rate_plan_enabled: boolean | null;
  synchronization_category: string | null;
  is_sync: string | null;
  link_repository: unknown[];
  rooms?: Rooms;
}

export interface Rooms {
  id: number;
  title: string;
  max_children: number | null;
  rates: Rate[];
}

export interface Rate {
  id: number;
  title: string;
  readonly: boolean;
  derived_rate_plan_ids: number[];
  occupancies: number[];
  price_1: number | null;
  pricing: string;
  parent_rate_id: string;
  max_persons: number;
  max_nights: number;
}

export interface ManageListingMapItem {
  item: ManageListingItem;
}

export interface ManageListingDetails {
  id: number;
  name: string;
  apt: string;
  street: string;
  city: string;
  state: string;
  country_code: string;
  lat: number;
  lng: number;
  bedrooms: number;
  beds: number;
  person_capacity: number;
  categories: string[];
  amenities: string[];
  accessibility_features: string[];
  has_active_disaster: boolean;
  has_availability: boolean;
  display_exact_location_to_guest: boolean;
  directions: string;
  property_type_category?: string;
  property_type_group?: string;
  synchronization_category: string;
  tier: string;
  reservation_issues: unknown[];
  host_roles: HostRole[];
  property_details: PropertyDetails;
  quality_standards: QualityStandards;
}

export interface HostRole {
  user_id: string;
  type: string;
  is_primary_host: boolean;
  is_super_host: boolean;
}

export interface PropertyDetails {
  listing_size: unknown[];
}

export interface QualityStandards {
  state: string;
}

export interface getTransactionHistoryPayloadType {
  host_id: number;
}

export interface createEditAmenitiesPayloadType {
  listing_id: string;
  channel_id: string;
  amenities: string[];
}

export interface DocumentItem {
  url: string;
  type: string;
  file_name: string;
}

export interface DocumentUploadPayload {
  save_and_exit: number;
  listing_id: string;
  channel_id: string;
  documents: DocumentItem[];
}