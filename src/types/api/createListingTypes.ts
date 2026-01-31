export interface ListingDetails {
  name?: string;
  property_type_category?: string;
  lat?: number;
  lng?: number;
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  country_code?: string;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  min_nights?: number;
  check_in_time?: string;
  check_out_time?: string;
  instant_booking?: boolean;
  disclosures?: {
    cameras?: boolean;
    noise?: boolean;
    weapons?: boolean;
  }
}
export interface CreateListingDetailsPayload {
  user_id?: string;
  channel_id?: string | null;
  listing_id?: string | null;
  listing?: ListingDetails;

}
export interface CreateListingDetailsResponse {
  status: string;
  message: string;
  data: {

  };
}

export interface createListingPricingPayload {
  channel_id: string;
  listing_id: string
  listing_currency: string;
  user_id: number;
  prices: {
    weekday: number;
    weekend: number;
    discount: number;
    tax: number;
    markup: number;
    cleaning_fee: number;
    security_deposit: number;
  };
}

export interface createListingPricingResponse {
  status: string;
  message: string;
  data: {

  };
}

export interface CreateListingResponse {
  status: string;
  message: string;
  data: {
    listing_id: string
  };
}

export interface CreateListingPayload {
  user_id: number;
  payload: {
    listing: {
      property_type_category: string;
      name: string
    }
  }
}

export interface ManageListingsResponse {
  status: string;
  message: string;
  data: ManageListingItem[];
}
export interface ManageListingItem {
  details: ManageListingDetails;
  is_sync: boolean | null;
}
export interface ManageListingMapItem {
  item: {
    details: ManageListingDetails;
    is_sync: boolean | null;
  }
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
  bathrooms: number;
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
