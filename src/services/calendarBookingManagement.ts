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

export const getReservationsApi = async (listingIds?: string, activeFilter?: string) => {
  const baseUrl = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS;
  const params = new URLSearchParams();

  // Status filter
  if (activeFilter === 'today') {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    params.append('created_at', `${day}-${month}-${year}`);
  } else if (activeFilter && activeFilter !== 'all') {
    params.append('status', activeFilter);
  }

  // Listing ID
  if (listingIds) {
    params.append('apartment_id', listingIds);
  }

  const queryString = params.toString();
  const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

  const { ok, data } = await apiService.get(url);

  if (ok) return data?.data || [];
  return [];
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
  throw response; 
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