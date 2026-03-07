import { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { useAuthStore } from '@/store/useAuthStore';
import {
  getUserListingsApi,
  getReservationsApi,
  getBookingDetailsApi,
  createDirectBookingApi,
  updateCalendarPricingApi,
  getCalendarBookingManagementListingsApi,
} from '@/services/calendarBookingManagement';
import { createBookingFormValues, createBookingSchema } from '@/validation/booking/bookingSchemas';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getOtaConfig } from '@/constants/ota_config';

export default function useListingContainer(listingIdFromParams: any, selectedTab: number) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('today');
  const [bookingType, setBookingType] = useState('direct');
  const [appliedListingIds, setAppliedListingIds] = useState<string>('');
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);


  // Form Initialization (Preserving context and default values exactly)
  const formMethods = useForm<createBookingFormValues>({
    resolver: yupResolver(createBookingSchema) as any,
    context: { bookingType },
    defaultValues: {
      listing_selection: listingIdFromParams ? String(listingIdFromParams) : '',
      name: '', email: '', phone: '', booking_type: 'host',
      end_date: '', start_date: '', rate: '', listing_id: ''
    },
  });

  const { control, watch, setValue, reset, clearErrors, handleSubmit, formState: { errors } } = formMethods;
  const selectedListingId = watch('listing_selection');

  // Logic: Pre-fill listing selection from params
  useEffect(() => {
    if (listingIdFromParams) {
      const targetId = String(listingIdFromParams);
      if (selectedListingId !== targetId) setValue('listing_selection', targetId);
    }
  }, [listingIdFromParams, setValue, selectedListingId]);

  // Logic: Clear validation errors when switching booking type
  useEffect(() => { clearErrors(); }, [bookingType, clearErrors]);

  // Query: Listings
  const { data: listingOptions = [] } = useQuery({
    queryKey: ['USER_LISTINGS', user?.id],
    queryFn: () => getUserListingsApi(user?.id || ''),
  });

  // Query: Reservations
  const { data: reservationRawData = [], isLoading: resLoading, refetch: refetchReservations } = useQuery({
    queryKey: ['RESERVATIONS_LIST', appliedListingIds, activeFilter],
    queryFn: () => getReservationsApi(appliedListingIds, activeFilter),
    enabled: selectedTab === 1,
  });

  // Query: Calendar Data
  const { data: calendarResponse, refetch: refetchCalendar } = useQuery({
    queryKey: ['CALENDAR_DATA', selectedListingId],
    queryFn: () => getCalendarBookingManagementListingsApi(selectedListingId || ''),
    enabled: !!user?.id,
  });

  const rawData = calendarResponse?.bookings || [];
  const defaultDailyPrice = calendarResponse?.defaultDailyPrice || 0;

  // const calendarDataMap = useMemo(() => {
  //   const marks: any = {};
  //   if (!Array.isArray(rawData)) return marks;

  //   const normalizeBooking = (item: any) => ({
  //     id: item.id || item.booking_id,
  //     guest: item.guest || item.guest_name || 'Guest',
  //     source: item.source || item.type || 'direct',
  //     source_type: item.source_type || item.type,
  //     listing_title: item.listing_title || 'Property',
  //     start_date: item.start_date || item.arrival_date,
  //     end_date: item.end_date || item.departure_date,
  //     checkIn: item.checkIn || "04:00 PM",
  //     checkOut: item.checkOut || "12:00 AM",
  //     ...item
  //   });

  //   rawData.forEach((item: any) => {
  //     if (item.calender_date) {
  //       const dateKey = item.calender_date;
  //       marks[dateKey] = { price: item.rate || defaultDailyPrice };
  //       if (item.bookings && item.bookings.length > 0) {
  //         const booking = normalizeBooking(item.bookings[0]);
  //         const config = getOtaConfig(booking.source);
  //         let type = 'middle';
  //         if (dateKey === booking.start_date) type = 'starting';
  //         else if (dateKey === booking.end_date) type = 'ending';
  //         if (booking.start_date === booking.end_date) type = 'single';
  //         marks[dateKey] = { ...marks[dateKey], type, ota: config.key, color: config.color, guest: booking.guest, showLabel: type === 'starting' || type === 'single', bookingData: booking };
  //       }
  //     } else if (item.start_date && item.end_date) {
  //       const normalizedItem = normalizeBooking(item);
  //       const config = getOtaConfig(normalizedItem.source_type === 'livedin' ? 'direct' : normalizedItem.source);
  //       const current = new Date(normalizedItem.start_date);
  //       const last = new Date(normalizedItem.end_date);
  //       while (current <= last) {
  //         const dKey = current.toISOString().split('T')[0];
  //         if (!marks[dKey]) {
  //           marks[dKey] = { ota: config.key, channels: [config.key.toLowerCase()], price: normalizedItem.amount || defaultDailyPrice, bookings: [normalizedItem] };
  //         } else {
  //           const existingChannels = marks[dKey].channels || [];
  //           if (!existingChannels.includes(config.key.toLowerCase())) marks[dKey].channels = [...existingChannels, config.key.toLowerCase()];
  //           if (marks[dKey].bookings) marks[dKey].bookings.push(normalizedItem);
  //         }
  //         current.setDate(current.getDate() + 1);
  //       }
  //     }
  //   });
  //   return marks;
  // }, [rawData, defaultDailyPrice]);


  const calendarDataMap = useMemo(() => {
    const marks: any = {};
    if (!Array.isArray(rawData)) return marks;

    const normalizeBooking = (item: any) => ({
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
    });

    rawData.forEach((item: any) => {
      // --- PART 1: Handle Calendar Daily Rates/Specific Day Bookings ---
      if (item.calender_date) {
        const dateKey = item.calender_date;

        // FIX: Use spread to avoid overwriting existing data from previous loops
        marks[dateKey] = {
          ...marks[dateKey],
          price: item.rate || marks[dateKey]?.price || defaultDailyPrice
        };

        if (item.bookings && item.bookings.length > 0) {
          const booking = normalizeBooking(item.bookings[0]);
          const config = getOtaConfig(booking.source);

          let type = 'middle';
          if (dateKey === booking.start_date) type = 'starting';
          else if (dateKey === booking.end_date) type = 'ending';

          // Handle Single Day (Start and End is same)
          if (booking.start_date === booking.end_date) type = 'single';

          marks[dateKey] = {
            ...marks[dateKey],
            type,
            ota: config.key,
            color: config.color,
            guest: booking.guest,
            // Show label only on the start/single day to avoid clutter
            showLabel: type === 'starting' || type === 'single',
            bookingData: booking
          };
        }
      }

      // --- PART 2: Handle Date Range Bookings (start_date to end_date) ---
      else if (item.start_date && item.end_date) {
        const normalizedItem = normalizeBooking(item);
        const config = getOtaConfig(normalizedItem.source_type === 'livedin' ? 'direct' : normalizedItem.source);

        let current = new Date(normalizedItem.start_date);
        const last = new Date(normalizedItem.end_date);

        while (current <= last) {
          const dKey = current.toISOString().split('T')[0];

          // Determine type for this specific date in the range
          let dateType = 'middle';
          if (dKey === normalizedItem.start_date) dateType = 'starting';
          else if (dKey === normalizedItem.end_date) dateType = 'ending';
          if (normalizedItem.start_date === normalizedItem.end_date) dateType = 'single';

          if (!marks[dKey]) {
            marks[dKey] = {
              price: normalizedItem.amount || defaultDailyPrice,
              ota: config.key,
              color: config.color,
              guest: normalizedItem.guest,
              type: dateType,
              showLabel: dateType === 'starting' || dateType === 'single',
              bookingData: normalizedItem,
              channels: [config.key.toLowerCase()],
              bookings: [normalizedItem]
            };
          } else {
            // Merge logic if date exists
            const existingChannels = marks[dKey].channels || [];
            if (!existingChannels.includes(config.key.toLowerCase())) {
              marks[dKey].channels = [...existingChannels, config.key.toLowerCase()];
            }
            if (marks[dKey].bookings) {
              marks[dKey].bookings.push(normalizedItem);
            }
          }

          // Move to next day
          current.setDate(current.getDate() + 1);
        }
      }
    });

    return marks;
  }, [rawData, defaultDailyPrice]);
  const filteredReservations = useMemo(() => {
    return (reservationRawData || []).filter((item: any) =>
      (item.guest || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reservationRawData, searchQuery]);

  const handleReservationPress = async (bookingId: string | number) => {
    try {
      setIsFetchingDetails(true);
      const response = await getBookingDetailsApi(bookingId);
      if (response?.data) navigation.navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, { bookingData: response.data });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not fetch booking info' });
    } finally { setIsFetchingDetails(false); }
  };

  const onCreateBooking = async (formData: createBookingFormValues) => {
    try {
      const finalId = formData.listing_id || selectedListingId;
      if (!finalId || finalId === "all") return;

      const formatDate = (date: string) => {
        if (!date || date.includes('-')) return date;
        const [m, d, y] = date.split('/');
        return `20${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      };

      const payload = {
        ...formData,
        listing_id: finalId,
        phone: (formData.phone ?? '').replace(/[^\d]/g, ''),
        start_date: formatDate(formData.start_date || ''),
        end_date: formatDate(formData.end_date || ''),
      };

      const res = bookingType === 'direct'
        ? await createDirectBookingApi({ ...formData, ...payload, booking_type: formData.booking_type || 'host' })
        : await updateCalendarPricingApi({ ...payload, price: formData.rate || '' });

      if (res) {
        Toast.show({ type: 'success', text1: bookingType === 'direct' ? 'Booking created' : 'Pricing updated' });
        reset();
        queryClient.invalidateQueries({ queryKey: ['RESERVATIONS_LIST'] });
        queryClient.invalidateQueries({ queryKey: ['CALENDAR_DATA'] });
        return true;
      }
    } catch (error: any) {
      const serverMessage = error?.data?.message || error?.response?.data?.message || "Something went wrong";
      Toast.show({ type: 'error', text1: serverMessage, visibilityTime: 4000 });
    }
    return false;
  };

  const handleRefresh = async () => {
  setIsRefreshing(true);
  try {
    await Promise.all([refetchCalendar(), refetchReservations()]);
  } finally {
    setIsRefreshing(false);
  }
};

  return {
    control, errors, handleSubmit, setValue, selectedListingId, listingOptions,
    resLoading, filteredReservations, calendarDataMap, defaultDailyPrice,
    isFetchingDetails, searchQuery, setSearchQuery, activeFilter, setActiveFilter,
    bookingType, setBookingType, setAppliedListingIds, handleReservationPress, onCreateBooking,
    isRefreshing,
    handleRefresh,
  };
}