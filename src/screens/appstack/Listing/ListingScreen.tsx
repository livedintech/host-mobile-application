import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { s, vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';

// Internal Imports
import { useAuthStore } from '@/store/useAuthStore';
import {
  getUserListingsApi,
  getReservationsApi,
  getBookingDetailsApi,
  createDirectBookingApi,
  updateCalendarPricingApi
} from '@/services/calendarBookingManagement';
import useCalendarContainer from './container/CalendarContainer';
import NavigationRoutes from '@/navigation/NavigationRoutes';

import SegmentedControl from '@/components/molecules/SegmentedControl/SegmentedControl';
import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';
import AppText from '@/components/molecules/AppText/AppText';
import { BookingDetailsView } from '@/components/molecules/BookingDetailsView/BookingDetailsView';
import { CalendarSection } from '@/components/molecules/CalendarSection/CalendarSection';
import { ReservationHeader } from '@/components/molecules/ReservationHeader/ReservationHeader';
import { FilterModalView } from '@/components/molecules/FilterModalView/FilterModalView';
import { CreateBookingSheet } from '@/components/molecules/CreateBookingSheet/CreateBookingSheet';
import { Colors } from '@/theme/colors';

// Validation
import { createBookingFormValues, createBookingSchema } from '@/validation/booking/bookingSchemas';
import Toast from 'react-native-toast-message';

const ListingScreen = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();

  // UI States
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('today'); // Default filter set to today
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Booking Details States
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any[]>([]);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  // Selection States
  const [selectedDateForBooking, setSelectedDateForBooking] = useState('');
  const [bookingType, setBookingType] = useState('direct');
  const [selectedPropertyValues, setSelectedPropertyValues] = useState<string[]>([]);
  const [appliedListingIds, setAppliedListingIds] = useState<string>('');

  // --- FORM SETUP WITH YUP ---
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<createBookingFormValues>({
    resolver: yupResolver(createBookingSchema) as any,
    context: { bookingType: bookingType },
    defaultValues: {
      listing_selection: '',
      name: '',
      email: '',
      phone: '',
      booking_type: 'host',
      end_date: '',
      start_date: '',
      rate: '',
      listing_id: '',
    },
    shouldUnregister: false,
  });

  const selectedListingId = watch('listing_selection');

  // Handle mode switches (Direct vs Pricing)
  useEffect(() => {
    clearErrors();
  }, [bookingType, clearErrors]);

  useEffect(() => {
    if (selectedDateForBooking) {
      setValue('start_date', selectedDateForBooking);
    }
  }, [selectedDateForBooking, setValue]);

  // --- API QUERIES ---
  const { data: listingOptions = [] } = useQuery({
    queryKey: ['USER_LISTINGS', user?.id],
    queryFn: () => getUserListingsApi(user?.id || ''),
  });

  // Updated to include activeFilter in queryKey and API call
  const { data: reservationRawData = [], isLoading: resLoading } = useQuery({
    queryKey: ['RESERVATIONS_LIST', appliedListingIds, activeFilter],
    queryFn: () => getReservationsApi(appliedListingIds, activeFilter),
    enabled: selectedTab === 1,
  });

  const { rawData } = useCalendarContainer(selectedListingId || '');

  // --- HANDLERS ---
  const handleReservationPress = async (bookingId: string | number) => {
    try {
      setIsFetchingDetails(true);
      const response = await getBookingDetailsApi(bookingId);

      if (response && response.data) {
        navigation.navigate(
          NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN,
          { bookingData: response.data }
        );
      }
    } catch (error) {
      console.error("Error fetching booking info:", error);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleDayPress = (day: any) => {
    const dateData = calendarMarkedDates[day.dateString];
    const isBooked = selectedListingId
      ? (dateData?.type && dateData.type !== 'none')
      : (dateData?.channels?.length > 0);

    if (isBooked) {
      setSelectedBookingDetails(selectedListingId ? [dateData.bookingData] : dateData.bookings);
      setIsDetailsOpen(true);
    } else {
      setSelectedDateForBooking(day.dateString);
      setIsBookingOpen(true);
    }
  };

  const onCreateBooking = async (formData: createBookingFormValues) => {
    try {
      const finalId = formData.listing_id || selectedListingId;
      if (!finalId || finalId === "all") return;

      const formatDate = (date: string | null | undefined) => {
        if (!date) return "";
        if (date.includes('-')) return date;
        const [m, d, y] = date.split('/');
        return `20${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      };

      const startDate = formatDate(formData.start_date);
      const endDate = formatDate(formData.end_date);

      const payload = {
        listing_id: finalId,
        start_date: startDate,
        end_date: endDate
      };

      const res = bookingType === 'direct'
        ? await createDirectBookingApi({
          ...formData,
          ...payload,
          booking_type: formData.booking_type || 'host'
        })
        : await updateCalendarPricingApi({
          ...payload,
          price: formData.rate || ''
        });

      if (res) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: bookingType === 'direct'
            ? 'Booking created successfully'
            : 'Pricing updated successfully',
        });

        setIsBookingOpen(false);
        reset();

        queryClient.invalidateQueries({ queryKey: ['RESERVATIONS_LIST'] });
        queryClient.invalidateQueries({ queryKey: ['CALENDAR_DATA'] });
      }

    } catch (error: any) {
      console.log('Booking Error:', error);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const getDatesBetween = (start: string, end: string) => {
    const dates: string[] = [];
    const current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  // --- MEMOIZED DATA ---
  // Now only handles Search Filtering because status/date filtering is done via API
  const filteredReservations = useMemo(() => {
    if (!reservationRawData) return [];
    return reservationRawData.filter((item: any) => {
      const guestName = (item.guest || item.name || '').toLowerCase();
      return guestName.includes(searchQuery.toLowerCase());
    });
  }, [reservationRawData, searchQuery]);

  const actualProperties = useMemo(() => {
    return (listingOptions || []).filter((opt: any) => {
      const label = (opt.label || '').toLowerCase();
      return opt.value !== "" && !label.includes('all listing');
    });
  }, [listingOptions]);

  const calendarMarkedDates = useMemo(() => {
  if (!rawData || !Array.isArray(rawData)) return {};

  const marks: any = {};

  // Helper to map API source to our internal OTA config colors
  const getOtaConfig = (source: string) => {
    const s = source?.toLowerCase();
    if (s === 'airbnb') return { key: 'AIRBNB', color: '#FF5A5F' };
    if (s === 'gathern') return { key: 'GATHERN', color: '#A855F7' };
    if (s === 'livedin') return { key: 'Livedin', color: '#3B82F6' };
    return { key: 'LIVEDIN', color: '#3B82F6' }; // Default for 'direct', 'livedin', 'host_booking'
  };

  rawData.forEach((item: any) => {
    // --- 1. SINGLE PROPERTY STRUCTURE (/calendar/id) ---
    if (item.calender_date) {
      const dateKey = item.calender_date;
      
      // Initialize day with rate
      if (!marks[dateKey]) {
        marks[dateKey] = { price: item.rate || 0 };
      }

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
          ota: config.key, // Used by Dynamic Legend
          color: config.color, // Solid color for seamless UI
          guest: booking.guest_name?.trim() || 'Guest',
          showLabel: dateKey === booking.arrival_date,
          bookingData: booking,
        };
      }
    } 

    // --- 2. MULTI-CHANNEL STRUCTURE (/bookings) ---
    else if (item.start_date && item.end_date) {
      const start = item.start_date.split(' ')[0];
      const end = item.end_date.split(' ')[0];
      
      // Expand range into individual dates
      const bookingDates = getDatesBetween(start, end);
      const config = getOtaConfig(item.source_type === 'livedin' ? 'direct' : item.source);

      bookingDates.forEach((dateKey) => {
        if (!marks[dateKey]) {
          marks[dateKey] = {
            ota: config.key,
            channels: [config.key.toLowerCase()], // For MultiChannelCalendar dots
            price: item.amount || 0,
            bookings: [item]
          };
        } else {
          // If MultiChannel view, add to channels array for dots
          if (marks[dateKey].channels && !marks[dateKey].channels.includes(config.key.toLowerCase())) {
            marks[dateKey].channels.push(config.key.toLowerCase());
          }
          if (marks[dateKey].bookings) {
            marks[dateKey].bookings.push(item);
          }
        }
      });
    }
  });

  return marks;
}, [rawData, selectedListingId]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BookingDetailsView
        isVisible={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        data={selectedBookingDetails}
      />

      {isFetchingDetails && (
        <View style={styles.overlayLoader}>
          <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
        </View>
      )}

      {!isDetailsOpen && (
        <>
          <View style={styles.headerFixed}>
            <View style={styles.segmentedWrapper}>
              <SegmentedControl options={['Calendar', 'Reservation']} selectedIndex={selectedTab} onChange={setSelectedTab} />
            </View>
            {selectedTab === 1 && (
              <ReservationHeader
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                onFilterPress={() => setModalVisible(true)}
                activeFilter={activeFilter} setActiveFilter={setActiveFilter}
              />
            )}
          </View>

          {selectedTab === 0 ? (
            <CalendarSection
              control={control} errors={errors}
              listingOptions={listingOptions}
              selectedListingId={selectedListingId || ''}
              markedDates={calendarMarkedDates}
              onDayPress={handleDayPress}
            />
          ) : (
            <View style={{ flex: 1 }}>
              {resLoading ? (
                <View style={styles.centerContainer}>
                  <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
                  <AppText text="Loading Reservations..." mt={vs(10)} color="#666" />
                </View>
              ) : (
                <FlatList
                  data={filteredReservations}
                  keyExtractor={(item, index) => String(item.id || item.booking_id || index)}
                  contentContainerStyle={styles.listContent}
                  ListEmptyComponent={
                    <View style={styles.centerContainer}>
                      <AppText text="No reservations found" color="#999" />
                    </View>
                  }
                  renderItem={({ item }) => (
                    <ReservationCard
                      id={item.booking_id || item.id}
                      guestName={item.guest}
                      platform={item.source || 'Direct'}
                      property={item.listing_title || 'Property'}
                      endDate={item.end_date}
                      startDate={item?.start_date}
                      checkIn={item?.checkIn || '04:00 PM'}
                      checkOut={item?.checkOut || '12:00 AM'}
                      platformColor={item.source?.toLowerCase().includes('airbnb') ? '#FF5A5F' : '#3B82F6'}
                      onPress={handleReservationPress}
                    />
                  )}
                />
              )}
            </View>
          )}
        </>
      )}

      <FilterModalView
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        initialSelectedValues={selectedPropertyValues}
        onApply={(finalSelection) => {
          setSelectedPropertyValues(finalSelection);
          setAppliedListingIds(finalSelection.join(','));
          setModalVisible(false);
        }}
        onReset={() => {
          setSelectedPropertyValues([]);
          setAppliedListingIds('');
        }}
        actualProperties={actualProperties}
      />

      <CreateBookingSheet
        isVisible={isBookingOpen} onClose={() => setIsBookingOpen(false)}
        bookingType={bookingType} setBookingType={setBookingType}
        control={control} errors={errors} listingOptions={listingOptions}
        selectedListingId={selectedListingId || ''} onSubmit={handleSubmit(onCreateBooking)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerFixed: { paddingHorizontal: s(16), backgroundColor: '#FFF', zIndex: 10, paddingTop: 0 },
  segmentedWrapper: { alignItems: 'center', paddingTop: vs(5), paddingBottom: vs(8) },
  listContent: { padding: s(16), flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: vs(100) },
  overlayLoader: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
});

export default ListingScreen;