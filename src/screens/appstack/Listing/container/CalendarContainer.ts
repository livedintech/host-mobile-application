import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarBookingManagementListingsApi } from '@/services/calendarBookingManagement'; 
import { useAuthStore } from '@/store/useAuthStore';

export default function useCalendarContainer(listingId: string) {
  const { user } = useAuthStore();
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['CALENDAR_DATA', listingId], 
    queryFn: () => getCalendarBookingManagementListingsApi(listingId),
    enabled: !!user?.id,
  });

  const calendarDataMap = useMemo(() => {
    const map: any = {};
    if (!Array.isArray(rawData)) return map;

    rawData.forEach((item: any) => {
      const dateKey = item.calender_date; // Exactly as per your API JSON
      if (!dateKey) return;

      // Initialize the base day object
      map[dateKey] = {
        price: item.rate || 0,
        availability: item.availability,
        type: 'none', // Default to no booking
      };

      // Since you mentioned bookings will always have at least one object:
      if (item.bookings && item.bookings.length > 0) {
        const booking = item.bookings[0]; // Take the first booking object
        const source = booking.source?.toLowerCase();
        
        // 1. Determine Position for the UI Span
        let type = 'middle';
        if (dateKey === booking.arrival_date) {
          type = 'starting'; // Rounded left side + Name Label
        } else if (dateKey === booking.departure_date) {
          type = 'ending';   // Rounded right side
        }

        // Handle single-day edge case
        if (booking.arrival_date === booking.departure_date) {
          type = 'single';
        }

        // 2. Map Visual Data to match your Screenshot
        map[dateKey] = {
          ...map[dateKey],
          type,
          guestName: booking.guest_name,
          // Match the colors and icons from your screenshot logic
          color: source === 'airbnb' ? '#F8B6B6' : '#E9D5FF', 
          containerColor: source === 'airbnb' ? '#C53030' : '#9333EA', // Darker circle color
          textColor: type === 'starting' ? '#FFFFFF' : '#1A332C',
          otaType: booking.type, // 'livedin', 'airbnb', etc.
          showLabel: dateKey === booking.arrival_date, // Only show name on start date
        };
      }
    });

    return map;
  }, [rawData]);

  // We return rawData here so ListingScreen can use it for the Reservation Tab list
  return { calendarDataMap, isLoading, rawData };
}