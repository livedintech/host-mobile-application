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

  // Helper to unify the two different API structures
  const normalizeBooking = (item: any) => {
    return {
      id: item.id || item.booking_id,
      guest: item.guest || item.guest_name || 'Guest',
      source: item.source || item.type || 'direct',
      source_type: item.source_type || item.type,
      listing_title: item.listing_title || 'Property',
      start_date: item.start_date || item.arrival_date,
      end_date: item.end_date || item.departure_date,
      checkIn: item.checkIn || "04:00 PM",
      checkOut: item.checkOut || "12:00 AM",
      ...item
    };
  };

  const calendarDataMap = useMemo(() => {
    const marks: any = {};
    if (!Array.isArray(rawData)) return marks;

    rawData.forEach((item: any) => {
      // --- 1. SINGLE PROPERTY STRUCTURE ---
      if (item.calender_date) {
        const dateKey = item.calender_date;
        marks[dateKey] = { price: item.rate || defaultDailyPrice };

        if (item.bookings && item.bookings.length > 0) {
          const booking = normalizeBooking(item.bookings[0]); // Normalize here
          const config = getOtaConfig(booking.source);
          
          let type = 'middle';
          if (dateKey === booking.start_date) type = 'starting';
          else if (dateKey === booking.end_date) type = 'ending';
          if (booking.start_date === booking.end_date) type = 'single';

          marks[dateKey] = {
            ...marks[dateKey],
            type,
            ota: config.key,
            color: config.color,
            guest: booking.guest,
            showLabel: type === 'starting' || type === 'single',
            bookingData: booking, // Now contains normalized keys
          };
        }
      } 
      // --- 2. MULTI-CHANNEL STRUCTURE ---
      else if (item.start_date && item.end_date) {
        const normalizedItem = normalizeBooking(item); // Normalize here
        const config = getOtaConfig(normalizedItem.source_type === 'livedin' ? 'direct' : normalizedItem.source);
        
        const current = new Date(normalizedItem.start_date);
        const last = new Date(normalizedItem.end_date);
        
        while (current <= last) {
          const dKey = current.toISOString().split('T')[0];
          if (!marks[dKey]) {
            marks[dKey] = {
              ota: config.key,
              channels: [config.key.toLowerCase()],
              price: normalizedItem.amount || defaultDailyPrice,
              bookings: [normalizedItem] // Array of normalized items
            };
          } else {
            const existingChannels = marks[dKey].channels || [];
            if (!existingChannels.includes(config.key.toLowerCase())) {
              marks[dKey].channels = [...existingChannels, config.key.toLowerCase()];
            }
            if (marks[dKey].bookings) marks[dKey].bookings.push(normalizedItem);
          }
          current.setDate(current.getDate() + 1);
        }
      }
    });

    return marks;
  }, [rawData, defaultDailyPrice]);

  return { calendarDataMap, isLoading, rawData, defaultDailyPrice };
}