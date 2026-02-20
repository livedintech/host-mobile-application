import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { s, vs } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';

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

import { createBookingFormValues, createBookingSchema } from '@/validation/booking/bookingSchemas';
import Toast from 'react-native-toast-message';
import { getOtaConfig } from '@/constants/ota_config';

const ListingScreen = () => {
    const route = useRoute<any>();
   console.log("routeTestt",route.params);
   const listingIdFromParams = route.params?.listing_id;
  
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();

  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('today');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any[]>([]);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [selectedDateForBooking, setSelectedDateForBooking] = useState('');
  const [bookingType, setBookingType] = useState('direct');
  const [selectedPropertyValues, setSelectedPropertyValues] = useState<string[]>([]);
  const [appliedListingIds, setAppliedListingIds] = useState<string>('');

  const { control, watch, handleSubmit, setValue, reset, clearErrors, formState: { errors } } = useForm<createBookingFormValues>({
    resolver: yupResolver(createBookingSchema) as any,
    context: { bookingType: bookingType },
    defaultValues: { listing_selection: listingIdFromParams ? String(listingIdFromParams) : '', name: '', email: '', phone: '', booking_type: 'host', end_date: '', start_date: '', rate: '', listing_id: '' },
  });

  const selectedListingId = watch('listing_selection');

  // --- PRE-FILL LOGIC ---
  useEffect(() => {
    if (listingIdFromParams) {
      // Convert to string as most dropdown values are stored as strings
      const targetId = String(listingIdFromParams);
      if (selectedListingId !== targetId) {
        setValue('listing_selection', targetId);
      }
    }
  }, [listingIdFromParams, setValue]);
  

  useEffect(() => { clearErrors(); }, [bookingType, clearErrors]);
  useEffect(() => { if (selectedDateForBooking) setValue('start_date', selectedDateForBooking); }, [selectedDateForBooking, setValue]);

  const { data: listingOptions = [] } = useQuery({
    queryKey: ['USER_LISTINGS', user?.id],
    queryFn: () => getUserListingsApi(user?.id || ''),
  });

  console.log("listingOptionsmmm",listingOptions)

  const { data: reservationRawData = [], isLoading: resLoading } = useQuery({
    queryKey: ['RESERVATIONS_LIST', appliedListingIds, activeFilter],
    queryFn: () => getReservationsApi(appliedListingIds, activeFilter),
    enabled: selectedTab === 1,
  });

  const { calendarDataMap, defaultDailyPrice } = useCalendarContainer(selectedListingId || '');

  const handleReservationPress = async (bookingId: string | number) => {
    try {
      setIsFetchingDetails(true);
      const response = await getBookingDetailsApi(bookingId);
      if (response && response.data) {
        navigation.navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, { bookingData: response.data });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not fetch booking info' });
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleDayPress = (day: any) => {
    const dateData = calendarDataMap[day.dateString];
    const isBooked = selectedListingId ? (dateData?.type && dateData.type !== 'none') : (dateData?.channels?.length > 0);

    if (isBooked) {
      setSelectedBookingDetails(selectedListingId ? [dateData.bookingData] : (dateData.bookings || []));
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

      const formatDate = (date: string) => {
        if (!date) return "";
        if (date.includes('-')) return date;
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
        Toast.show({ type: 'success', text1: 'Success', text2: bookingType === 'direct' ? 'Booking created' : 'Pricing updated' });
        setIsBookingOpen(false);
        reset();
        queryClient.invalidateQueries({ queryKey: ['RESERVATIONS_LIST'] });
        queryClient.invalidateQueries({ queryKey: ['CALENDAR_DATA'] });
      }
    } catch (error: any) {
      const serverMessage = error?.data?.message || error?.response?.data?.message || "Something went wrong";
      Toast.show({ type: 'error', text1: serverMessage, visibilityTime: 4000 });
    }
  };

  const filteredReservations = useMemo(() => {
    return (reservationRawData || []).filter((item: any) => 
      (item.guest || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reservationRawData, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BookingDetailsView 
        isVisible={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        data={selectedBookingDetails}
        onCardPress={handleReservationPress} 
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
              markedDates={calendarDataMap}
              onDayPress={handleDayPress}
              defaultPrice={defaultDailyPrice}
            />
          ) : (
            <View style={{ flex: 1 }}>
              {resLoading ? (
                <View style={styles.centerContainer}><ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} /></View>
              ) : (
                <FlatList
                  data={filteredReservations}
                  keyExtractor={(item, index) => String(item.id || index)}
                  contentContainerStyle={styles.listContent}
                  ListEmptyComponent={<View style={styles.centerContainer}><AppText text="No reservations found" color="#999" /></View>}
                  renderItem={({ item }) => {
                    const config = getOtaConfig(item.source);
                    return (
                      <ReservationCard
                        id={item.booking_id || item.id}
                        guestName={item.guest}
                        platform={item.source_type === 'livedin' ? 'Livedin' : config.label}
                        property={item.listing_title || 'Property'}
                        endDate={item.end_date} startDate={item.start_date}
                        checkIn={item?.checkIn || '04:00 PM'} checkOut={item?.checkOut || '12:00 AM'}
                        platformColor={config.color}
                        onPress={handleReservationPress}
                      />
                    );
                  }}
                />
              )}
            </View>
          )}
        </>
      )}

      <FilterModalView
        isVisible={isModalVisible} onClose={() => setModalVisible(false)}
        initialSelectedValues={selectedPropertyValues}
        onApply={(f) => { setSelectedPropertyValues(f); setAppliedListingIds(f.join(',')); setModalVisible(false); }}
        onReset={() => { setSelectedPropertyValues([]); setAppliedListingIds(''); }}
        actualProperties={(listingOptions || []).filter((opt: any) => opt.value !== "" && !(opt.label || '').toLowerCase().includes('all listing'))}
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
  headerFixed: { paddingHorizontal: s(16), backgroundColor: '#FFF', zIndex: 10 },
  segmentedWrapper: { alignItems: 'center', paddingVertical: vs(8) },
  listContent: { padding: s(16), flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: vs(100) },
  overlayLoader: {
  ...StyleSheet.absoluteFill,
  backgroundColor: 'rgba(255,255,255,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},
});

export default ListingScreen;