import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";

/**
 * 1. FETCH BOOKINGS (For the Dots/Calendar)
 * Used by useCalendarContainer to get the start_date and source for dots.
 */
export const getCalendarBookingManagementListingsApi = async (listingId?: string) => {
    // If listingId is empty, we hit the general calendar endpoint for ALL listings
    // If listingId exists, we hit the specific one.
    const url = listingId 
        ? SERVICE_CONFIG_URLS.APP.GET_CALENDAR_DATA.replace('{listing_id}', listingId)
        : SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS; // <--- The "All" Endpoint
    
    const { ok, data } = await apiService.get(url);
    if (ok) return data?.data || [];
    
    return [];
};

/**
 * 2. FETCH PROPERTY LIST (For the Dropdown)
 * Used in ListingScreen to show the available properties for the User.
 */
export const getUserListingsApi = async (userId: string | number) => {
  const url = SERVICE_CONFIG_URLS.APP.GET_USER_LISTINGS_BY_USER_ID.replace('{user}', String(userId));
  const { ok, data } = await apiService.get(url);

  if (ok && data?.data) {
    const listings = data.data.map((item: any) => ({
      label: item.title || item.name || "Unknown Listing",
      value: String(item.id),
    }));

    // Add "All Listings" at the very top
    return [{ label: "All Listings", value: "" }, ...listings];
  }
  return [{ label: "All Listings", value: "" }];
};

/**
 * 3. HELPER/FALLBACK
 * Kept for compatibility if you use this name elsewhere.
 */
// export const getCalendarDataApi = async (listingId: string) => {
//     return getCalendarBookingManagementListingsApi(listingId);
// };


export const getCalendarBookingsByListingIdApi = async (listingIds: string | string[]) => {
    // 1. Ensure we are always working with an array, even if a single string is passed
    const ids = Array.isArray(listingIds) ? listingIds : [listingIds];
    try {
        // 2. Map over the IDs and create a fetch promise for each one
        const fetchPromises = ids.map(async (id) => {
            const url = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS_LISTING_ID.replace('{listing_id}', id);
            const { ok, data } = await apiService.get(url);
            return ok ? (data?.data || []) : [];
        });

        // 3. Execute all requests in parallel
        const results = await Promise.all(fetchPromises);
        // 4. Flatten the array of arrays into one single list of bookings
        return results.flat();
    } catch (error) {
        console.error('Error fetching multiple listings:', error);
        return [];
    }
};

/**
 * 4. FETCH RESERVATIONS (For the Reservation Tab)
 * Uses the /v2/bookings endpoint. 
 * Supports comma-separated IDs for multi-property filtering.
 */

export const getReservationsApi = async (listingIds?: string) => {
    // Note: Adjust 'apartment_id' to match your exact backend key if it differs from your Swagger example
    const baseUrl = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS;; 

    const url = listingIds 
        ? `${baseUrl}?&apartment_id=${listingIds}` 
        : `${baseUrl}`;

        console.log('FINAL URL FOR RESERVATIOIN', url)
    
    // Use the final URL directly
    const { ok, data } = await apiService.get(url);
    
    if (ok) return data?.data || [];
    return [];
};

/**
 * 5. CREATE DIRECT BOOKING (POST Request)
 * Sends the booking details to the server.
 */
export const createDirectBookingApi = async (payload: any) => {
    const url = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS; 
        const { ok, data } = await apiService.post(url, payload);
    
    if (ok) {
        return data?.data || data; 
    }
    return null; 
};

/**
 * 6. UPDATE CALENDAR PRICING (POST Request)
 * Updates the nightly rate for a specific date range and property.
 */
export const updateCalendarPricingApi = async (payload: {
  listing_id: string | number;
  price: number | string;
  start_date: string;
  end_date: string;
}) => {
    const url = SERVICE_CONFIG_URLS.APP.SET_CALENDAR_PRICING; 
    
    const { ok, data } = await apiService.post(url, payload);
    
    if (ok) {
        return data; // Return the full response to handle success in the UI
    }
    return null; 
};

/**
 * Fetches specific booking details by ID
 * @param bookingId The unique identifier for the booking
 */
export const getBookingDetailsApi = async (bookingId: string | number) => {
  try {
    // Replace the {booking_id} placeholder with the actual ID
    // If your URL constant is literally `${authController}/bookings/details{booking_id}`
    const url = SERVICE_CONFIG_URLS.APP.GET_BOOKINGS_DETAILS.replace('{booking_id}', String(bookingId));

    // Using your existing axios instance/logic
    const { ok, data } = await apiService.get(url);
    if (ok) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return null;
  }
};