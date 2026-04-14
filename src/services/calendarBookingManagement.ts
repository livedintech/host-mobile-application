import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";

/**
 * 1. FETCH BOOKINGS (For the Dots/Calendar)
 */
export const getCalendarBookingManagementListingsApi = async (listingId?: string) => {
  // If listingId is provided and not "all" (empty string), use the specific calendar route
  // Otherwise, use the bookings route which should be protected by your Bearer token 
  // in the apiService interceptor.
  const baseUrl = (listingId && listingId !== "")
    ? SERVICE_CONFIG_URLS.APP.GET_CALENDAR_DATA.replace('{listing_id}', listingId)
    : SERVICE_CONFIG_URLS.APP.BOOKING_MULTI_CALENDAR;
  const url = `${baseUrl}?t=${Date.now()}`;



  const { ok, data } = await apiService.get(url);
  if (ok) {
    return {
      bookings: data?.data || [],
      defaultDailyPrice: data?.default_daily_price || 0,
      cleaningFee: data?.cleaning_fee || 0,
      discount: data?.discount || 0
    };
  }
  return { bookings: [], defaultDailyPrice: 0 };
};

/**
 * 2. FETCH PROPERTY LIST (For the Dropdown)
 */
export const getUserListingsApi = async (userId: string | number) => {
  const url = SERVICE_CONFIG_URLS.APP.GET_USER_LISTINGS_BY_USER_ID.replace('{user}', String(userId));
  const { ok, data } = await apiService.get(url);

  if (ok && data?.data) {
    const listings = data.data.map((item: any) => ({
      label: item.title || item.name || "Unknown Listing",
      value: String(item.listing_id),
    }));

    return [{ label: "All Listings", value: "" }, ...listings];
  }
  return [{ label: "All Listings", value: "" }];
};

/**
 * 3. FETCH BOOKINGS BY SPECIFIC LISTING ID
 */
export const getCalendarBookingsByListingIdApi = async (listingIds: string | string[]) => {
  const ids = Array.isArray(listingIds) ? listingIds : [listingIds];
  try {
    const fetchPromises = ids.map(async (id) => {
      const url = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS_LISTING_ID.replace('{listing_id}', id);
      const { ok, data } = await apiService.get(url);
      return ok ? (data?.data || []) : [];
    });

    const results = await Promise.all(fetchPromises);
    return results.flat();
  } catch (error) {
    console.error('Error fetching multiple listings:', error);
    return [];
  }
};

/**
 * 4. FETCH RESERVATIONS (For the Reservation Tab)
 */

export const getReservationsApi = async (listingIds?: string, status?: string) => {
  const baseUrl = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS;
  const params = new URLSearchParams();

  // Just take the single status passed from the container
  if (status && status !== 'all') {
    params.append('status', status);
  }

  if (listingIds) {
    params.append('apartment_id', listingIds);
  }

  const queryString = params.toString();
  const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

  const { ok, data } = await apiService.get(url);
  return ok ? data?.data || [] : [];
};
/**
 * HELPER: Format Date
 */
const formatDate = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('/')) return dateStr;
  const [month, day, year] = dateStr.split('/');
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * 5. CREATE DIRECT BOOKING
 */
export const createDirectBookingApi = async (payload: any) => {
  const formattedPayload = {
    ...payload,
    start_date: formatDate(payload.start_date),
    end_date: formatDate(payload.end_date),
  };
  
  const url = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS;
  const response = await apiService.post(url, formattedPayload);

  // If the request was successful
  if (response.ok) {
    return response.data?.data || response.data;
  }

  // If the request failed (like your 409 error), throw it!
  // This forces the 'catch' block in ListingScreen to trigger.
throw response.data || response;
};

/**
 * 6. UPDATE CALENDAR PRICING
 */
export const updateCalendarPricingApi = async (payload: {
  listing_id: string | number;
  price: number | string;
  start_date: string;
  end_date: string;
}) => {
  const formattedPayload = {
    ...payload,
    start_date: formatDate(payload.start_date),
    end_date: formatDate(payload.end_date),
  };

  const url = SERVICE_CONFIG_URLS.APP.SET_CALENDAR_PRICING;
  const { ok, data } = await apiService.post(url, formattedPayload);
  if (ok) return data;
  return null;
};

/**
 * 7. FETCH SPECIFIC BOOKING DETAILS
 */

export const getBookingDetailsApi = async (bookingId: string | number) => {
  const url = SERVICE_CONFIG_URLS.APP.GET_BOOKINGS_DETAILS.replace('{booking_id}', String(bookingId));

  const { ok, data, response } = await apiService.get(url);

  if (ok) {
    return data; 
  }

  throw response;
};


/**
 * 8. SUBMIT BOOKING REQUEST (Accept / Decline)
 */
// export const submitBookingRequestApi = async (payload: {
//   thread_id: string | number;
//   action_type: 'accept_request' | 'decline_request';
//   reason?: string;
// }) => {
//   const url = SERVICE_CONFIG_URLS.APP.BOOKING_REQUEST_SUBMIT;

//   const { ok, data, response } = await apiService.post(url, payload);

//   if (ok) {
//     return data?.data || data;
//   }

//   // throw error so caller can handle (like toast / UI)
//   throw response || data || response;
// };

export const submitBookingRequestApi = async (payload: {
  thread_id: string | number;
  accept: boolean;
  reason: string | null;
  decline_message_to_guest: string | null;
  decline_message_to_airbnb: string | null;
}) => {
  const url = SERVICE_CONFIG_URLS.APP.BOOKING_REQUEST_SUBMIT;

  const { ok, data, response } = await apiService.post(url, payload);

  if (ok) {
    return data?.data || data;
  }

  throw response || data;
};

//GET LISTING
export const getListing = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_LISTING_TASK_MANAGEMENT,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};

/**
 * 9. CHANGE RESERVATION
 */
export const changeReservationApi = async (payload: {
  booking_id: number | string;
  listing_id: number | string;
  start_date: string;
  end_date: string;
  amount: number | string;
}) => {
  const formattedPayload = {
    ...payload,
    start_date: formatDate(payload.start_date),
    end_date: formatDate(payload.end_date),
  };

  // const url = 'api/v2/bookings/reservation/change';
  const url = SERVICE_CONFIG_URLS.APP.CHANGE_RESERVATION

  const { ok, data, response } = await apiService.post(url, formattedPayload);

  if (ok) {
    return data?.data || data;
  }

  throw response || data;
};


/**
 * 10. CANCEL OTA BOOKING
 */
export const cancelOtaBookingApi = async (
  bookingId: string | number,
  payload: {
    reason: string;
    sub_reason: string;
    message_to_guest: string;
    message_to_airbnb: string;
  }
) => {
  const url = SERVICE_CONFIG_URLS.APP.CANCEL_OTA_BOOKING.replace(
    '{id}',
    String(bookingId)
  );

  const { ok, data, response } = await apiService.post(url, payload);

  if (ok) {
    return data?.data || data;
  }

  throw response || data;
};

