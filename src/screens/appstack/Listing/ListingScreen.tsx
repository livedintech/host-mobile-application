import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { useRoute } from '@react-navigation/native';

import useListingContainer from './container/ListingContainer';
import SegmentedControl from '@/components/molecules/SegmentedControl/SegmentedControl';
import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';
import AppText from '@/components/molecules/AppText/AppText';
import { BookingDetailsView } from '@/components/molecules/BookingDetailsView/BookingDetailsView';
import { CalendarSection } from '@/components/molecules/CalendarSection/CalendarSection';
import { ReservationHeader } from '@/components/molecules/ReservationHeader/ReservationHeader';
import { FilterModalView } from '@/components/molecules/FilterModalView/FilterModalView';
import { CreateBookingSheet } from '@/components/molecules/CreateBookingSheet/CreateBookingSheet';
import { Colors } from '@/theme/colors';
import { getOtaConfig } from '@/constants/ota_config';
import { useAuthStore } from '@/store/useAuthStore';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
// import useManageBookingContainer from '../ManageBooking/ManageBookingContainer';
// import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const ListingScreen = () => {
  const { user } = useAuthStore();
  const route = useRoute<any>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any[]>(
    [],
  );
  const [selectedPropertyValues, setSelectedPropertyValues] = useState<
    string[]
  >([]);

  // const { isOtaConnected } = useManageBookingContainer();

  const {
    control,
    errors,
    handleSubmit,
    setValue,
    selectedListingId,
    listingOptions,
    resLoading,
    filteredReservations,
    calendarDataMap,
    defaultDailyPrice,
    isFetchingDetails,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    bookingType,
    setBookingType,
    setAppliedListingIds,
    handleReservationPress,
    onCreateBooking,
    handleRefresh,
    isRefreshing
  } = useListingContainer(route.params?.listing_id, selectedTab);

  const handleDayPress = (day: any) => {
    const dateData = calendarDataMap[day.dateString];
    const isBooked = selectedListingId
      ? dateData?.type && dateData.type !== 'none'
      : dateData?.channels?.length > 0;

    if (isBooked) {
      setSelectedBookingDetails(
        selectedListingId ? [dateData.bookingData] : dateData.bookings || [],
      );
      setIsDetailsOpen(true);
    } else {
      if (user?.role_key === 'supervisor') {
        console.log('Supervisors cannot create bookings');
        return;
      }

      setValue('start_date', day.dateString);
      setIsBookingOpen(true);
    }
  };

  const onBookingSubmit = async (data: any) => {
    const success = await onCreateBooking(data);
    if (success) setIsBookingOpen(false);
  };
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* //   <GradientBorder borderRadius={35} style={styles.infoCardWrapper}>
    //       <View style={styles.infoCardInner}>
    //           <View style={styles.row}>
    //               <View style={styles.activeDot} />
    //               <View style={styles.avatarContainer}>
    //                   <Image source={require('@/assets/img/img1.png')} style={styles.avatar} />
    //               </View>
    //               <View style={{ flex: 1, marginLeft: 15 }}>
    //                   <AppText text="A.LI - Livedin" type="Bold" color={Colors.BRUNSWICK_GREEN} />
    //                   <AppText
    //                       text="Connect your Airbnb, Gathern, or other booking platforms to manage all your listings in one place."
    //                       color={Colors.NIGHT_OPACITY}
    //                       mt={5}
    //                       lineHeight={20}
    //                   />
    //               </View>
    //           </View>
    //       </View>
    //   </GradientBorder> */}
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
              <SegmentedControl
                options={['Calendar', 'Reservation']}
                selectedIndex={selectedTab}
                onChange={setSelectedTab}
              />
            </View>
            {selectedTab === 1 && (
              <ReservationHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onFilterPress={() => setModalVisible(true)}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            )}
          </View>

          {selectedTab === 0 ? (
            <CalendarSection
              control={control}
              errors={errors}
              listingOptions={listingOptions}
              selectedListingId={selectedListingId || ''}
              markedDates={calendarDataMap}
              onDayPress={handleDayPress}
              defaultPrice={defaultDailyPrice}
               isLoading={isRefreshing}
                  onRefresh={handleRefresh}
            />
          ) : (
            <View style={{ flex: 1 }}>
              {resLoading ? (
                <View style={styles.centerContainer}>
                  <ActivityIndicator
                    size="large"
                    color={Colors.BRUNSWICK_GREEN}
                  />
                </View>
              ) : (
                <FlatListSimpleHandler
                  showsVerticalScrollIndicator={false}
                  isLoading={isRefreshing}
                  onRefresh={handleRefresh}
                  data={filteredReservations}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.listContent}
                  ListEmptyComponent={
                    <View style={styles.centerContainer}>
                      <AppText text="No reservations found" color="#999" />
                    </View>
                  }
                  renderItem={({ item }) => {
                    const config = getOtaConfig(item.source);
                    return (
                      <ReservationCard
                        id={item.booking_id || item.id}
                        guestName={item.guest}
                        platform={
                          item.source_type === 'livedin'
                            ? 'Livedin'
                            : config.label
                        }
                        property={item.listing_title || 'Property'}
                        endDate={item.end_date}
                        startDate={item.start_date}
                        checkIn={item?.checkIn || '04:00 PM'}
                        checkOut={item?.checkOut || '12:00 AM'}
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
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        initialSelectedValues={selectedPropertyValues}
        onApply={f => {
          setSelectedPropertyValues(f);
          setAppliedListingIds(f.join(','));
          setModalVisible(false);
        }}
        onReset={() => {
          setSelectedPropertyValues([]);
          setAppliedListingIds('');
        }}
        actualProperties={(listingOptions || []).filter(
          (opt: any) =>
            opt.value !== '' &&
            !(opt.label || '').toLowerCase().includes('all listing'),
        )}
      />
      <CreateBookingSheet
        isVisible={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        bookingType={bookingType}
        setBookingType={setBookingType}
        control={control}
        errors={errors}
        listingOptions={listingOptions}
        selectedListingId={selectedListingId || ''}
        onSubmit={handleSubmit(onBookingSubmit)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerFixed: {
    paddingHorizontal: s(16),
    backgroundColor: '#FFF',
    zIndex: 10,
  },
  segmentedWrapper: { alignItems: 'center', paddingVertical: vs(8) },
  listContent: { padding: s(16), flexGrow: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vs(100),
  },
  infoCardWrapper: {
    marginBottom: 33,
    width: '94%',
    alignSelf: 'center',
    marginTop: 20,
    minHeight: vs(150),
  },

  infoCardInner: {
    padding: 25,
    borderRadius: 35,
    backgroundColor: Colors.WHITE,
    flex: 1,              // Add this so the inner content also expands
    justifyContent: 'center', // Centers the row vertically
  },
  row: { flexDirection: 'row', alignItems: 'center', },
  avatar: { width: 46, height: 54 },
  activeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.BRUNSWICK_GREEN, marginRight: 8 },
  avatarContainer: { backgroundColor: Colors.ADRIANA, borderRadius: 100, width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
  overlayLoader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default ListingScreen;
