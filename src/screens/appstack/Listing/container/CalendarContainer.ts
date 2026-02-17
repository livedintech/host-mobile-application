import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarBookingManagementListingsApi } from '@/services/calendarBookingManagement'; 
import { useAuthStore } from '@/store/useAuthStore';
import { getOtaConfig } from '@/constants/ota_config';

export default function useCalendarContainer(listingId: string) {
  const { user } = useAuthStore();
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['CALENDAR_DATA', listingId], 
    queryFn: () => getCalendarBookingManagementListingsApi(listingId),
    enabled: !!user?.id,
  });

  const rawData = response?.bookings || [];
  const defaultDailyPrice = response?.defaultDailyPrice || 0;

  const calendarDataMap = useMemo(() => {
    const marks: any = {};
    if (!Array.isArray(rawData)) return marks;

    rawData.forEach((item: any) => {
      // --- 1. SINGLE PROPERTY STRUCTURE (Specific Listing Selected) ---
      if (item.calender_date) {
        const dateKey = item.calender_date;
        
        // Initial day state
        marks[dateKey] = { price: item.rate || defaultDailyPrice };

        if (item.bookings && item.bookings.length > 0) {
          const booking = item.bookings[0];
          const config = getOtaConfig(booking.source || booking.type);
          
          let type = 'middle';
          if (dateKey === booking.arrival_date) type = 'starting';
          else if (dateKey === booking.departure_date) type = 'ending';
          if (booking.arrival_date === booking.departure_date) type = 'single';

          marks[dateKey] = {
            ...marks[dateKey],
            type,
            ota: config.key,
            color: config.color,
            guest: booking.guest_name?.trim() || 'Guest',
            showLabel: dateKey === booking.arrival_date,
            bookingData: booking,
          };
        }
      } 
      // --- 2. MULTI-CHANNEL STRUCTURE (All Listings View) ---
      else if (item.start_date && item.end_date) {
        const start = item.start_date.split(' ')[0];
        const end = item.end_date.split(' ')[0];
        const config = getOtaConfig(item.source_type === 'livedin' ? 'direct' : item.source);
        
        const current = new Date(start);
        const last = new Date(end);
        
        while (current <= last) {
          const dKey = current.toISOString().split('T')[0];
          if (!marks[dKey]) {
            marks[dKey] = {
              ota: config.key,
              channels: [config.key.toLowerCase()],
              price: item.amount || defaultDailyPrice,
              bookings: [item]
            };
          } else {
            const existingChannels = marks[dKey].channels || [];
            if (!existingChannels.includes(config.key.toLowerCase())) {
              marks[dKey].channels = [...existingChannels, config.key.toLowerCase()];
            }
            if (marks[dKey].bookings) {
              marks[dKey].bookings.push(item);
            }
          }
          current.setDate(current.getDate() + 1);
        }
      }
    });

    return marks;
  }, [rawData, defaultDailyPrice]);

  return { calendarDataMap, isLoading, rawData, defaultDailyPrice };
}