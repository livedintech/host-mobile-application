import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarBookingManagementListingsApi } from '@/services/calendarBookingManagement'; 
import { useAuthStore } from '@/store/useAuthStore';

export default function useCalendarContainer(listingId: string) {
  const { user } = useAuthStore();
  console.log('USERS INFO...', user)
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['CALENDAR_DATA', listingId], 
    queryFn: () => getCalendarBookingManagementListingsApi(listingId),
    enabled: !!user?.id,
  });

  const calendarDataMap = useMemo(() => {
    const map: any = {};
    if (!Array.isArray(rawData)) return map;

    rawData.forEach((item: any) => {
      const dateKey = item.calender_date || item.start_date; 
      if (!dateKey) return;

      // Initialize default day structure
      if (!map[dateKey]) {
        map[dateKey] = { 
          channels: [], 
          price: item.rate || item.amount 
        };
      }

      // CASE A: Single Listing (Nested Bookings for Span View)
      if (item.bookings && Array.isArray(item.bookings) && item.bookings.length > 0) {
        item.bookings.forEach((booking: any) => {
          const source = booking.source?.toUpperCase();
          
          // 1. Determine Position in the Span
          let type = 'middle';
          if (dateKey === booking.arrival_date) type = 'start';
          else if (dateKey === booking.departure_date) type = 'end';
          
          // Handle single-day bookings
          if (booking.arrival_date === booking.departure_date) type = 'single';

          // 2. Map Data for CustomCalendar UI
          map[dateKey] = {
            ...map[dateKey],
            type,
            // Flexible name detection
            guest: booking.guest_name || booking.name || 'Guest', 
            ota: booking.source?.toLowerCase(),
            color: source === 'AIRBNB' ? '#F8B6B6' : '#F3E5F5',
            textColor: (type === 'start' || type === 'single') ? '#FFF' : '#1A332C',
            
            // showLabel: Only true on the arrival date for the Calendar text
            showLabel: dateKey === booking.arrival_date, 
            
            channels: [...(map[dateKey].channels || []), source]
          };
        });
      } 
      // CASE B: All Listings (Flat structure for Dots View)
      else if (item.source) {
        const source = item.source.toUpperCase();
        if (!map[dateKey].channels.includes(source)) {
          map[dateKey].channels.push(source);
        }
      }
    });
    
    return map;
  }, [rawData]);

  // We return rawData here so ListingScreen can use it for the Reservation Tab list
  return { calendarDataMap, isLoading, rawData };
}