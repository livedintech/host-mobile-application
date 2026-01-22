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
  disclosures?:{
    cameras?: boolean;
    noise?: boolean;
    weapons?: boolean;
  }
}
export interface CreateListingDetailsPayload {
  user_id: number;
  channel_id: string | null;
  listing_id: number | null;
  listing: ListingDetails;

}
export interface CreateListingDetailsResponse {
  status: string;
  message: string;
  data: {

  };
}

export interface createListingPricingPayload {
  channel_id: string;
  listing_id: number;
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
  payload:{
    listing:{
      property_type_category: string;
      name: string
    }
  }
}
