import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";

/**
 * 1. FETCH BOOKINGS (For the Dots/Calendar)
 */
export const getCalendarBookingManagementListingsApi = async (listingId?: string) => {
    const url = listingId 
        ? SERVICE_CONFIG_URLS.APP.GET_CALENDAR_DATA.replace('{listing_id}', listingId)
        : SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS; 
    
    const { ok, data } = await apiService.get(url);
    if (ok) return data?.data || [];
    
    return [];
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
export const getReservationsApi = async (listingIds?: string) => {
    const baseUrl = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS; 

    const url = listingIds 
        ? `${baseUrl}?&apartment_id=${listingIds}` 
        : `${baseUrl}`;
    
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
    const { ok, data } = await apiService.post(url, formattedPayload);
    
    if (ok) return data?.data || data; 
    return null; 
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
  try {
    const url = SERVICE_CONFIG_URLS.APP.GET_BOOKINGS_DETAILS.replace('{booking_id}', String(bookingId));

    const { ok, data } = await apiService.get(url);
    
    // We return 'data' which contains the full response including the .data property 
    // needed by your navigation logic
    if (ok) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return null;
  }
};