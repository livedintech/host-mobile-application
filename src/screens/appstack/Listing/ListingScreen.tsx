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

const ListingScreen = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();
  
  // UI States
  const [selectedTab, setSelectedTab] = useState(0); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Clear end_date when start_date changes to force fresh validation
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

  const { data: reservationRawData = [], isLoading: resLoading } = useQuery({
    queryKey: ['RESERVATIONS_LIST', appliedListingIds],
    queryFn: () => getReservationsApi(appliedListingIds),
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

  const toggleProperty = (val: any) => {
    const valStr = String(val);
    setSelectedPropertyValues(prev => 
      prev.includes(valStr) ? prev.filter(v => v !== valStr) : [...prev, valStr]
    );
  };

  const onCreateBooking = async (formData: createBookingFormValues) => {
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
    
    // Switch between Direct Booking and Pricing update
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
      setIsBookingOpen(false);
      reset();
      
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['USER_LISTINGS'] });
      queryClient.invalidateQueries({ queryKey: ['RESERVATIONS_LIST'] });
      queryClient.invalidateQueries({ 
        queryKey: ['CALENDAR_DATA', user?.id, selectedListingId] 
      });
    }
  };

  // --- MEMOIZED DATA ---
  const filteredReservations = useMemo(() => {
    if (!reservationRawData) return [];
    return reservationRawData.filter((item: any) => {
      const guestName = (item.guest || item.name || '').toLowerCase();
      const matchesSearch = guestName.includes(searchQuery.toLowerCase());
      const today = new Date().toISOString().split('T')[0];
      const itemDate = (item.start_date || '').split(' ')[0];

      let matchesChip = true;
      if (activeFilter === 'today') matchesChip = itemDate === today;
      else if (activeFilter === 'pending') matchesChip = item.status?.toLowerCase() === 'pending';
      else if (activeFilter === 'confirmed') matchesChip = item.status?.toLowerCase() === 'confirmed';

      return matchesSearch && matchesChip;
    });
  }, [reservationRawData, searchQuery, activeFilter]);

  const actualProperties = useMemo(() => {
    return (listingOptions || []).filter((opt: any) => {
      const label = (opt.label || '').toLowerCase();
      return opt.value !== "" && !label.includes('all listing');
    });
  }, [listingOptions]);

  const calendarMarkedDates = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return {};
    const marks: any = {};
    const extractCardData = (item: any) => ({
      id: item.booking_id || item.id,
      guestName: item.guest || item.name || 'Guest',
      platform: item.source || 'Direct',
      property: item.listing_title || 'Property Details',
      date: (item.start_date || item.calender_date)?.split(' ')[0] || 'N/A',
      checkIn: item.check_in || '09:00 AM',
      checkOut: item.check_out || '11:00 PM',
      platformColor: item.source?.toLowerCase().includes('airbnb') ? '#FF5A5F' : 
                     item.source?.toLowerCase().includes('gathern') ? '#9146FF' : '#3B82F6'
    });

    rawData.forEach((item: any) => {
      const dateKey = (item.start_date || item.calender_date)?.split(' ')[0];
      if (!dateKey) return;
      if (!selectedListingId) {
        const source = item.source?.toLowerCase() || '';
        let ota = source.includes('airbnb') ? 'airbnb' : source.includes('gathern') ? 'gathern' : 'booking';
        if (marks[dateKey]) {
          if (!marks[dateKey].channels.includes(ota)) marks[dateKey].channels.push(ota);
          marks[dateKey].bookings.push(extractCardData(item));
        } else {
          marks[dateKey] = { channels: [ota], price: item.rate || '500', bookings: [extractCardData(item)] };
        }
      } else {
        const booking = item.bookings?.[0];
        if (booking) {
          const source = booking.source?.toLowerCase() || '';
          let color = source.includes('airbnb') ? '#FF5A5F' : source.includes('gathern') ? '#9146FF' : '#3B82F6';
          marks[dateKey] = {
            type: dateKey === booking.arrival_date ? 'starting' : dateKey === booking.departure_date ? 'ending' : 'middle',
            color, textColor: '#FFFFFF', price: item.rate, showLabel: dateKey === booking.arrival_date,
            bookingData: extractCardData({ ...booking, listing_title: item.listing_title })
          };
        } else {
          marks[dateKey] = { type: 'none', color: 'transparent', price: item.rate };
        }
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
                      guestName={item.guest || 'Guest'} 
                      platform={item.source || 'Direct'}
                      property={item.listing_title || 'Property'} 
                      date={item.start_date || ''}
                      checkIn="09:00 AM" 
                      checkOut="11:00 PM"
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
        isVisible={isModalVisible} onClose={() => setModalVisible(false)}
        onApply={() => { setAppliedListingIds(selectedPropertyValues.join(',')); setModalVisible(false); }}
        onReset={() => { setSelectedPropertyValues([]); setAppliedListingIds(''); }}
        isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}
        selectedPropertyValues={selectedPropertyValues} 
        actualProperties={actualProperties} 
        toggleProperty={toggleProperty}
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
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  headerFixed: { 
    paddingHorizontal: s(16), 
    backgroundColor: '#FFF', 
    zIndex: 10,
    paddingTop: 0,
  },
  segmentedWrapper: { 
    alignItems: 'center', 
    paddingTop: vs(5),
    paddingBottom: vs(8),
  },
  listContent: { 
    padding: s(16), 
    flexGrow: 1 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: vs(100) 
  },
  overlayLoader: { 
    ...StyleSheet.absoluteFill, 
    backgroundColor: 'rgba(255,255,255,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 999 
  },
});

export default ListingScreen;