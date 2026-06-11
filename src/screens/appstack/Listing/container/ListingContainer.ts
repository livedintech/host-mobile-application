import {
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
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
  clearCalendarStickyCache,
  getCalendarStickyPrices,
  getCachedCalendarResult,
  seedCalendarListingDefaultPrice,
  submitBookingRequestApi,
} from '@/services/calendarBookingManagement';
import {
  createBookingFormValues,
  createBookingSchema,
} from '@/validation/booking/bookingSchemas';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getOtaConfig } from '@/constants/ota_config';
import { useTranslation } from 'react-i18next';

const cachedDailyPricesByListing: Record<string, Record<string, number>> = {};
const lastGoodCalendarByListing: Record<string, {
  bookings: any[];
  defaultDailyPrice: number;
  cleaningFee: number;
  discount: number;
}> = {};

const normalizeCalendarDateKey = (value: unknown): string | undefined => {
  if (value == null || value === '') return undefined;
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  if (raw.includes('/')) {
    const [month, day, year] = raw.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return raw;
};

const getCalendarDayDate = (row: any) =>
  normalizeCalendarDateKey(row?.calender_date) ??
  normalizeCalendarDateKey(row?.calendar_date) ??
  normalizeCalendarDateKey(row?.date);

const parseListingDayRate = (row: any): number | undefined => {
  const raw = row?.rate ?? row?.price ?? row?.daily_rate ?? row?.amount;
  if (raw == null || raw === '') return undefined;
  const rate = Number(String(raw).replace(/,/g, ''));
  return Number.isFinite(rate) && rate > 0 ? rate : undefined;
};

const countCalendarDayRows = (bookings?: any[]) =>
  (bookings ?? []).filter((row) => getCalendarDayDate(row)).length;

const scoreCalendarPayload = (
  payload?: {
    bookings?: any[];
    defaultDailyPrice?: number;
  } | null,
  cacheKey?: string,
) => {
  if (!payload) return 0;
  const dayRows = countCalendarDayRows(payload.bookings);
  if (dayRows > 0) return dayRows + 10_000;
  if ((payload.defaultDailyPrice ?? 0) > 0) return 1_000;
  if (cacheKey) {
    const stickyCount = Object.keys(
      getCalendarStickyPrices(cacheKey).dailyPriceByDate,
    ).length;
    if (stickyCount > 0) return stickyCount + 500;
  }
  return payload.bookings?.length ?? 0;
};

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
    setValue,
    getValues,
    reset,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = formMethods;
  const selectedListingIdRaw = useWatch({ control, name: 'listing_selection' });
  const selectedListingId = selectedListingIdRaw
    ? String(selectedListingIdRaw)
    : '';

  const setListingSelection = useCallback(
    (id: string | number | null | undefined) => {
      const next =
        id != null && String(id) !== '' && String(id) !== 'all'
          ? String(id)
          : '';
      if (String(getValues('listing_selection') ?? '') === next) return;
      setValue('listing_selection', next, {
        shouldDirty: false,
        shouldValidate: false,
      });
    },
    [getValues, setValue],
  );

  // Logic: Pre-fill listing selection from params
  useEffect(() => {
    if (listingIdFromParams) {
      const targetId = String(listingIdFromParams);
      if (selectedListingId !== targetId) {
        setValue('listing_selection', targetId, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    }
  }, [listingIdFromParams, setValue, selectedListingId]);

  // Logic: Clear validation errors when switching booking type
  useEffect(() => {
    clearErrors();
  }, [bookingType, clearErrors]);

  // Query: Listings
  const { data: listingOptions = [], refetch:refetchListing } = useQuery({
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

  const listingCacheKey = selectedListingId ? String(selectedListingId) : 'all';

  const selectedListingWeekdayPrice = useMemo(() => {
    const option = listingOptions.find(
      (item: { value?: string }) => item.value === selectedListingId,
    ) as { weekdayPrice?: number } | undefined;
    return option?.weekdayPrice ?? 0;
  }, [listingOptions, selectedListingId]);

  useLayoutEffect(() => {
    if (selectedListingWeekdayPrice > 0 && listingCacheKey) {
      seedCalendarListingDefaultPrice(
        listingCacheKey,
        selectedListingWeekdayPrice,
      );
    }
  }, [selectedListingWeekdayPrice, listingCacheKey]);

  const listingsLoaded = listingOptions.length > 0;
  const didAutoSelectListingRef = useRef(false);

  useLayoutEffect(() => {
    if (
      selectedTab !== 0 ||
      selectedListingId ||
      !listingsLoaded ||
      didAutoSelectListingRef.current
    ) {
      return;
    }
    const firstListing = listingOptions.find(
      (item: { value?: string }) => item.value && item.value !== '',
    );
    if (firstListing?.value) {
      didAutoSelectListingRef.current = true;
      setValue('listing_selection', String(firstListing.value), {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [selectedTab, selectedListingId, listingOptions, listingsLoaded, setValue]);

  const calendarQueryReady =
    listingsLoaded &&
    (!!selectedListingId || didAutoSelectListingRef.current);

  // Query: Calendar Data (only on calendar tab — avoids duplicate fetches from reservation screen)
  const {
    data: calendarResponse,
    refetch: refetchCalendar,
    isLoading: isCalendarLoading,
    isFetching: isCalendarFetching,
  } = useQuery({
    queryKey: ['CALENDAR_DATA', listingCacheKey] as const,
    queryFn: async ({ queryKey }) => {
      const key = String(queryKey[1] ?? 'all');
      const listingId = key === 'all' ? '' : key;
      const result = await getCalendarBookingManagementListingsApi(listingId);

      if (listingId) {
        const dayRows = countCalendarDayRows(result.bookings);
        const cached = getCachedCalendarResult(key);
        const cachedDays = countCalendarDayRows(cached?.bookings);

        if (dayRows === 0 && cachedDays > 0) {
          return cached!;
        }
      }

      return result;
    },
    enabled: !!user?.id && selectedTab === 0 && calendarQueryReady,
    placeholderData: (previousData, previousQuery) => {
      if (previousQuery?.queryKey?.[1] === listingCacheKey && previousData) {
        return previousData;
      }
      return (
        getCachedCalendarResult(listingCacheKey) ??
        lastGoodCalendarByListing[listingCacheKey]
      );
    },
    retry: false,
    staleTime: 120_000,
    gcTime: 300_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const stableCalendarResponse = useMemo(() => {
    const incoming = calendarResponse;
    const cached =
      lastGoodCalendarByListing[listingCacheKey] ??
      getCachedCalendarResult(listingCacheKey);

    if (!incoming) {
      return cached ?? incoming;
    }

    const incomingScore = scoreCalendarPayload(incoming, listingCacheKey);
    const cachedScore = scoreCalendarPayload(cached, listingCacheKey);

    if (!cached || incomingScore >= cachedScore) {
      if (incomingScore > 0) {
        lastGoodCalendarByListing[listingCacheKey] = incoming;
      }
      return incomingScore > 0 ? incoming : cached ?? incoming;
    }

    return cached;
  }, [calendarResponse, listingCacheKey]);

  const cleaningFee = stableCalendarResponse?.cleaningFee;
  const discount = stableCalendarResponse?.discount;

  const rawData = stableCalendarResponse?.bookings ?? [];

  const dailyPriceByDate = useMemo(() => {
    const stickyPrices = getCalendarStickyPrices(listingCacheKey);
    const prices: Record<string, number> = {
      ...stickyPrices.dailyPriceByDate,
      ...(cachedDailyPricesByListing[listingCacheKey] ?? {}),
    };
    rawData.forEach((item: any) => {
      const dateKey = getCalendarDayDate(item);
      const rate = dateKey ? parseListingDayRate(item) : undefined;
      if (dateKey && rate) {
        prices[dateKey] = rate;
      }
    });
    if (Object.keys(prices).length > 0) {
      cachedDailyPricesByListing[listingCacheKey] = prices;
    }
    return prices;
  }, [rawData, listingCacheKey]);

  const defaultDailyPrice = useMemo(() => {
    const stickyDefault = getCalendarStickyPrices(listingCacheKey).defaultDailyPrice;
    const sampleDayRate = Object.values(dailyPriceByDate).find((rate) => rate > 0);
    return (
      stableCalendarResponse?.defaultDailyPrice ||
      stickyDefault ||
      selectedListingWeekdayPrice ||
      sampleDayRate ||
      0
    );
  }, [
    stableCalendarResponse?.defaultDailyPrice,
    listingCacheKey,
    dailyPriceByDate,
    selectedListingWeekdayPrice,
  ]);
  const calendarDataMap = useMemo(() => {
    const marks: Record<string, any> = {};
    if (!Array.isArray(rawData)) return marks;

    const addDaysToDateKey = (dateKey: string, days: number) => {
      const [y, m, d] = dateKey.split('-').map(Number);
      const dt = new Date(y, m - 1, d + days);
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      return `${dt.getFullYear()}-${mm}-${dd}`;
    };

    const normalizeBooking = (item: any) => {
      const arrival = item.arrival_date || item.start_date;
      const departure =
        item.calendar_end_date || item.departure_date || item.end_date;
      return {
        ...item,
        id: item.id || item.booking_id,
        guest: item.guest || item.guest_name || 'Guest',
        source: item.source || item.type || 'direct',
        source_type: item.source_type || item.type,
        listing_title: item.listing_title || 'Property',
        arrival_date: arrival,
        departure_date: departure,
        start_date: arrival,
        end_date: departure,
        checkIn: item.checkIn || '04:00 PM',
        checkOut: item.checkOut || '12:00 AM',
      };
    };

    const isMultiCalendar =
      !selectedListingId ||
      selectedListingId === 'all' ||
      selectedListingId === '';

    const applyBookingRange = (booking: any, dayRate?: number) => {
      const normalized = normalizeBooking(booking);
      const sourceKey =
        normalized.source_type === 'livedin' ? 'direct' : normalized.source;
      const config = getOtaConfig(sourceKey);
      const rangeEnd =
        booking.calendar_end_date ||
        normalized.departure_date ||
        normalized.end_date;

      if (!normalized.start_date || !rangeEnd) return;

      let dKey = normalized.start_date;
      while (dKey <= rangeEnd) {
        let dateType: string = 'middle';
        if (dKey === normalized.start_date) dateType = 'starting';
        else if (dKey === rangeEnd) dateType = 'ending';
        if (normalized.start_date === rangeEnd) dateType = 'single';

        if (!marks[dKey]) {
          marks[dKey] = {
            price:
              dayRate ||
              (normalized.amount > 0 ? normalized.amount : undefined) ||
              defaultDailyPrice,
            ota: config.key,
            color: config.color,
            guest: normalized.guest,
            type: dateType,
            showLabel: dateType === 'starting' || dateType === 'single',
            bookingData: normalized,
            channels: [config.key.toLowerCase()],
            bookings: [normalized],
          };
        } else {
          marks[dKey] = {
            ...marks[dKey],
            price: marks[dKey].price ?? dayRate ?? defaultDailyPrice,
            type: dateType,
            ota: config.key,
            color: config.color,
            guest: normalized.guest,
            showLabel: dateType === 'starting' || dateType === 'single',
            bookingData: normalized,
            channels: [
              ...new Set([
                ...(marks[dKey].channels || []),
                config.key.toLowerCase(),
              ]),
            ],
            bookings: [...(marks[dKey].bookings || []), normalized],
          };
        }

        dKey = addDaysToDateKey(dKey, 1);
      }
    };

    rawData.forEach((item: any) => {
      // Single-listing calendar: per-day rows from GET /calendar/{id}
      const dateKey = getCalendarDayDate(item);
      if (dateKey) {
        const parsedRate = parseListingDayRate(item);
        const dayRate =
          parsedRate ??
          dailyPriceByDate[dateKey] ??
          marks[dateKey]?.price ??
          defaultDailyPrice;

        marks[dateKey] = {
          ...marks[dateKey],
          price: dayRate,
          rate: dayRate,
        };

        if (Array.isArray(item.bookings)) {
          item.bookings.forEach((booking: any) =>
            applyBookingRange(booking, dayRate),
          );
        }
        return;
      }

      // Multi-calendar: listings grouped with nested bookings[]
      if (item.listing_id && Array.isArray(item.bookings)) {
        item.bookings.forEach((booking: any) => applyBookingRange(booking));
        return;
      }

      // Flat booking range (multicalendar fallback / reservations / legacy shape)
      const rangeStart = item.start_date || item.arrival_date;
      const rangeEnd =
        item.calendar_end_date || item.end_date || item.departure_date;
      if (rangeStart && rangeEnd) {
        applyBookingRange({ ...item, start_date: rangeStart, end_date: rangeEnd });
      }
    });

    Object.entries(dailyPriceByDate).forEach(([dateKey, rate]) => {
      if (!marks[dateKey]) {
        marks[dateKey] = { price: rate, rate };
        return;
      }
      if (!marks[dateKey].price || marks[dateKey].price <= 0) {
        marks[dateKey] = { ...marks[dateKey], price: rate, rate };
      }
    });

    if (defaultDailyPrice > 0) {
      rawData.forEach((item: any) => {
        const dateKey = getCalendarDayDate(item);
        if (!dateKey || marks[dateKey]) return;
        marks[dateKey] = { price: defaultDailyPrice, rate: defaultDailyPrice };
      });
    }

    return marks;
  }, [rawData, defaultDailyPrice, selectedListingId, dailyPriceByDate]);

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
           bookingType === 'direct' ? t('app.listing_screen.booking_created') : t('app.listing_screen.pricing_updated'),
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
      clearCalendarStickyCache(selectedListingId || undefined);
      await queryClient.removeQueries({
        queryKey: ['CALENDAR_DATA', listingCacheKey],
      });
      await Promise.all([refetchCalendar(), refetchReservations(), refetchListing()]);
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
        text1: t('app.listing_screen.booking_accepted'),
        text2:t('app.listing_screen.booking_accepted_desc', { name: guestName }),
      });

      await handleRefresh();
    } catch (error: any) {
      const message = error?.data?.message || t('app.listing_screen.accept_request_failed');
      Toast.show({
        type: 'error',
        text1: t('app.listing_screen.action_failed'),
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
    setListingSelection,
    selectedListingId,
    listingOptions,
    rawData,
    resLoading,
    filteredReservations,
    calendarDataMap,
    dailyPriceByDate,
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
    isCalendarLoading: isCalendarLoading || isCalendarFetching,
    cleaningFee,
    discount,
    handleBookingAction,
  };
}
