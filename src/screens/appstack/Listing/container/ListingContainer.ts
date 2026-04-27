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
  submitBookingRequestApi,
} from '@/services/calendarBookingManagement';
import {
  createBookingFormValues,
  createBookingSchema,
} from '@/validation/booking/bookingSchemas';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getOtaConfig } from '@/constants/ota_config';
import { useTranslation } from 'react-i18next';

export default function useListingContainer(
  listingIdFromParams: any,
  selectedTab: number,
) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { t } = useTranslation();


  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('today');
  const [bookingType, setBookingType] = useState('direct');
  const [appliedListingIds, setAppliedListingIds] = useState<string>('');
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [checkInFilter, setCheckInFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  // Form Initialization (Preserving context and default values exactly)
  const formMethods = useForm<createBookingFormValues>({
    resolver: yupResolver(createBookingSchema) as any,
    context: { bookingType },
    defaultValues: {
      listing_selection: listingIdFromParams ? String(listingIdFromParams) : '',
      name: '',
      email: '',
      booking_type: 'host',
      end_date: '',
      start_date: '',
      rate: '',
      listing_id: '',
      country: { cca2: 'SA', callingCode: '966' },
      phoneNumber: '',
    },
  });

  const {
    control,
    watch,
    setValue,
    reset,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = formMethods;
  const selectedListingId = watch('listing_selection');

  // Logic: Pre-fill listing selection from params
  useEffect(() => {
    if (listingIdFromParams) {
      const targetId = String(listingIdFromParams);
      if (selectedListingId !== targetId)
        setValue('listing_selection', targetId);
    }
  }, [listingIdFromParams, setValue, selectedListingId]);

  // Logic: Clear validation errors when switching booking type
  useEffect(() => {
    clearErrors();
  }, [bookingType, clearErrors]);

  // Query: Listings
  const { data: listingOptions = [] } = useQuery({
    queryKey: ['USER_LISTINGS', user?.id],
    queryFn: () => getUserListingsApi(user?.id || ''),
  });

  // Query: Reservations
  const {
    data: reservationRawData = [],
    isLoading: resLoading,
    refetch: refetchReservations,
  } = useQuery({
    queryKey: ['RESERVATIONS_LIST', appliedListingIds, activeFilter],
    queryFn: () => getReservationsApi(appliedListingIds, activeFilter),
    enabled: selectedTab === 1,
  });

  // Query: Calendar Data
  const { data: calendarResponse, refetch: refetchCalendar } = useQuery({
    queryKey: ['CALENDAR_DATA', selectedListingId],
    queryFn: () =>
      getCalendarBookingManagementListingsApi(selectedListingId || ''),
    enabled: !!user?.id,
  });
  const cleaningFee = calendarResponse?.cleaningFee;
  const discount = calendarResponse?.discount;
  const rawData = calendarResponse?.bookings || [];
  const defaultDailyPrice = calendarResponse?.defaultDailyPrice || 0;
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
      checkIn: item.checkIn || '04:00 PM',
      checkOut: item.checkOut || '12:00 AM',
      ...item,
    });

    rawData.forEach((item: any) => {
      // --- PART 1: Handle Calendar Daily Rates/Specific Day Bookings (Single Listing) ---
      if (item.calender_date) {
        const dateKey = item.calender_date;
        marks[dateKey] = {
          ...marks[dateKey],
          price: item.rate || marks[dateKey]?.price || defaultDailyPrice,
        };

        if (item.bookings && item.bookings.length > 0) {
          const booking = normalizeBooking(item.bookings[0]);
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
            bookingData: booking,
          };
        }
      }

      // --- PART 2: Handle Date Range Bookings ---
      else if (item.start_date && item.end_date) {
        const normalizedItem = normalizeBooking(item);
        const config = getOtaConfig(
          normalizedItem.source_type === 'livedin'
            ? 'direct'
            : normalizedItem.source,
        );

        const isMultiCalendar =
          !selectedListingId ||
          selectedListingId === 'all' ||
          selectedListingId === '';
        const rangeEndDate =
          isMultiCalendar && item.calendar_end_date
            ? item.calendar_end_date
            : normalizedItem.end_date;
        // --- NEW LOGIC END ---

        let current = new Date(normalizedItem.start_date);
        const last = new Date(rangeEndDate);

        while (current <= last) {
          const dKey = current.toISOString().split('T')[0];

          let dateType = 'middle';
          if (dKey === normalizedItem.start_date) dateType = 'starting';
          else if (dKey === rangeEndDate) dateType = 'ending'; // Use the rangeEndDate for markers
          if (normalizedItem.start_date === rangeEndDate) dateType = 'single';

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
              bookings: [normalizedItem],
            };
          } else {
            const existingChannels = marks[dKey].channels || [];
            if (!existingChannels.includes(config.key.toLowerCase())) {
              marks[dKey].channels = [
                ...existingChannels,
                config.key.toLowerCase(),
              ];
            }
            if (marks[dKey].bookings) {
              marks[dKey].bookings.push(normalizedItem);
            }
          }
          current.setDate(current.getDate() + 1);
        }
      }
    });

    return marks;
  }, [rawData, defaultDailyPrice, selectedListingId]);

  const filteredReservations = useMemo(() => {
    return (reservationRawData || []).filter((item: any) =>
      (item.guest || item.name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [reservationRawData, searchQuery]);

  const handleReservationPress = async (bookingId: string | number) => {
    try {
      setIsFetchingDetails(true);
      const response = await getBookingDetailsApi(bookingId);
      if (response?.data)
        navigation.navigate(
          NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN,
          { bookingData: response.data, booking_id: bookingId },
        );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.toast.error'),
        text2: t('listing_screen.fetch_booking_error'),
      });
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const onCreateBooking = async (formData: createBookingFormValues) => {
    try {
      const finalId = formData.listing_id || selectedListingId;
      if (!finalId || finalId === 'all') return;

      setisLoading(true);

      const formatDate = (date: string) => {
        if (!date || date.includes('-')) return date;
        const [m, d, y] = date.split('/');
        return `20${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      };

      // Combine phone
      const fullPhone = `${formData.country?.callingCode || ''}${formData.phoneNumber || ''
        }`;

      const rateValue = Number(formData?.rate || 0);

      // ✅ FRONTEND VALIDATION (optional safety)
      // if (rateValue < 38 && bookingType !== 'direct') {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'The minimum price allowed is SAR 38',
      //   });
      //   return;
      // }

      // if (rateValue > 375000) {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Maximum price allowed is SAR 375000',
      //   });
      //   return;
      // }

      // Build payload
      const payload: any = {
        ...formData,
        listing_id: finalId,
        phone: fullPhone.replace(/[^\d]/g, ''),
        start_date: formatDate(formData.start_date || ''),
        end_date: formatDate(formData.end_date || ''),
        booking_type: formData.booking_type || 'host',
      };

      delete payload.country;
      delete payload.phoneNumber;
      console.log("bookingType", bookingType)

      const res =
        bookingType === 'direct'
          ? await createDirectBookingApi(payload)
          : await updateCalendarPricingApi({
            ...payload,
            price: formData.rate || '',
          });
      console.log("respp", res)
      if (res) {
        Toast.show({
          type: 'success',
          text1:
           bookingType === 'direct' ? t('listing_screen.booking_created') : t('listing_screen.pricing_updated'),
        });

        reset();
        queryClient.invalidateQueries({ queryKey: ['RESERVATIONS_LIST'] });
        queryClient.invalidateQueries({ queryKey: ['CALENDAR_DATA'] });
        setIsBookingOpen(false);

        return true;
      }
    } catch (error: any) {
      console.log('FULL ERROR:', error);

      const validationErrors = error?.data?.errors;

      if (validationErrors) {
        const firstKey = Object.keys(validationErrors)[0];
        Toast.show({
          type: 'error',
          text1: validationErrors[firstKey][0],
        });
        return;
      }

      Toast.show({
        type: 'error',
        text1: error?.data?.message || error?.message || t('common.toast.something_went_wrong'),
      });
    }
    finally {
      setisLoading(false);
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

  const handleFilterApply = (listingIds: string, status?: string) => {
    setAppliedListingIds(listingIds);
    if (status) {
      setActiveFilter(status); // This updates the Top Tab AND triggers the API
      setCheckInFilter(status); // Keeps the modal state in sync
    }
  };

  // const handleBookingAction = async (
  //   bookingId: string | number,
  //   action: 'accept_request' | 'decline_request'
  // ) => {
  //   try {
  //     setisLoading(true);

  //     const payload = {
  //       thread_id: bookingId,
  //       action_type: action,
  //     };

  //     await submitBookingRequestApi(payload);

  //     Toast.show({
  //       type: 'success',
  //       text1: action === 'accept_request' ? 'Booking Accepted' : 'Booking Rejected',
  //     });

  //     // Refresh the data to remove the item from the request list
  //     await handleRefresh();

  //   } catch (error: any) {
  //     const message = error?.data?.message || 'Failed to process request';
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Action Failed',
  //       text2: message,
  //     });
  //   } finally {
  //     setisLoading(false);
  //   }
  // };

  const handleBookingAction = async (
    bookingId: string | number,
    action: 'accept_request' | 'decline_request',
    guestName?: string,
    startDate?: string,
    endDate?: string,
  ) => {
    if (action === 'decline_request') {
      navigation.navigate(
        NavigationRoutes.APP_STACK.DECLINE_INQUIRY_STEP1_SCREEN,
        {
          id: bookingId,
          type: 'booking_request',
          guestName: guestName,
          start_date: startDate,
          end_date: endDate,
        },
      );
      return;
    }

    // --- Logic for ACCEPT ---
    try {
      setisLoading(true);

      // Matching your requested payload structure for Accept
      const payload = {
        thread_id: bookingId,
        accept: true,
        reason: null,
        decline_message_to_guest: null,
        decline_message_to_airbnb: null,
      };

      await submitBookingRequestApi(payload);

      Toast.show({
        type: 'success',
        text1: t('listing_screen.booking_accepted'),
        text2:t('listing_screen.booking_accepted_desc', { name: guestName }),
      });

      await handleRefresh();
    } catch (error: any) {
      const message = error?.data?.message || t('listing_screen.accept_request_failed');
      Toast.show({
        type: 'error',
        text1: t('listing_screen.action_failed'),
        text2: message,
      });
    } finally {
      setisLoading(false);
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    setValue,
    selectedListingId,
    listingOptions,
    rawData,
    resLoading,
    filteredReservations,
    calendarDataMap,
    defaultDailyPrice,
    isFetchingDetails,
    searchQuery,
    setSearchQuery,
    activeFilter,
    checkInFilter,
    setCheckInFilter,
    handleFilterApply,
    setActiveFilter,
    bookingType,
    setBookingType,
    setAppliedListingIds,
    handleReservationPress,
    onCreateBooking,
    isRefreshing,
    handleRefresh,
    isBookingOpen,
    setIsBookingOpen,
    isLoading,
    cleaningFee,
    discount,
    handleBookingAction,
  };
}
