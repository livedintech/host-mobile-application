export interface ListingDetails {
  name: string;
  property_type_category: string;
  lat: number;
  lng: number;
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
}

export interface CreateListingDetailsPayload {
  user_id: number;
  listing_id: number;
  listing: ListingDetails;
}

export interface CreateListingDetailsResponse {
  status: string;
  message: string;
  data: {

  };
}

export interface createListingPricingPayload {
  listing_id: number;
  prices: {
    weekday: number;
    weekend: number;
    cleaning_fee: number;
    security_deposit: number;
  }
}
export interface createListingPricingResponse {
  status: string;
  message: string;
  data: {

  };
}