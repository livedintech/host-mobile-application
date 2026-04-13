import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { useRoute } from '@react-navigation/native';

import useListingContainer from './container/ListingContainer';
import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';
import AppText from '@/components/molecules/AppText/AppText';
import { BookingDetailsView } from '@/components/molecules/BookingDetailsView/BookingDetailsView';
import { CalendarSection } from '@/components/molecules/CalendarSection/CalendarSection';
import { ReservationHeader } from '@/components/molecules/ReservationHeader/ReservationHeader';
import { FilterModalView } from '@/components/molecules/FilterModalView/FilterModalView';
import { Colors } from '@/theme/colors';
import { getOtaConfig } from '@/constants/ota_config';
import { useAuthStore } from '@/store/useAuthStore';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import useManageBookingContainer from '../ManageBooking/ManageBookingContainer';
import NoListing from './NoListing';
import BGImage from '@/components/molecules/BGImage/BGImage';
import CreateBookingSheet from '@/components/molecules/CreateBookingSheet/CreateBookingSheet';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import BookingRequestCard from '@/components/molecules/BookingRequestCard/BookingRequestCard';
import Metrics from '@/utility/Metrics';

const ListingScreen = () => {
  const authStore = useAuthStore();
  const user = authStore?.user;

  const route = useRoute<any>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPropertyValues, setSelectedPropertyValues] = useState<
    string[]
  >([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const { isOtaConnected, isLoading: isLoadingOta } =
    useManageBookingContainer();

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
    rawData,
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
    isRefreshing,
    isBookingOpen,
    setIsBookingOpen,
    isLoading,
    cleaningFee,
    discount,
    setCheckInFilter,
  } = useListingContainer(route.params?.listing_id, selectedTab);
  console.log('activeFilter', activeFilter);

  const toggleTab = () => {
    setSelectedTab(prev => (prev === 0 ? 1 : 0));
  };

  const handleConnectAccount = () => {
    navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
  };

  if (isLoadingOta) {
    return (
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
        <AppText text="Checking OTA connection..." mt={10} color={Colors.BRUNSWICK_GREEN} />
      </BGImage>
    );
  }

  if (!isOtaConnected) {
    return (
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <NoListing onConnect={handleConnectAccount} />
      </BGImage>
    );
  }

  const handleDayPress = (day: any) => {
    const dateData = calendarDataMap[day.dateString];
    const isBooked = selectedListingId
      ? dateData?.type && dateData.type !== 'none'
      : (dateData?.channels?.length ?? 0) > 0;

    if (isBooked) {
      const bookingCode = selectedListingId
        ? dateData.bookingData?.booking_id
        : dateData.bookings?.[0]?.booking_id;

      if (bookingCode) {
        // setSelectedBookingId(bookingCode);
        // setIsDetailsOpen(true);
        handleReservationPress(bookingCode);
      }
    } else {
      if (user?.role_key === 'supervisor') return;
      setValue('start_date', day.dateString);
      setIsBookingOpen(true);
    }
  };

  const onBookingSubmit = async (data: any) => {
    const success = await onCreateBooking(data);
    if (success) setIsBookingOpen(false);
  };

  const handleListingRowPress = (id: string | number) => {
    setValue('listing_selection', String(id));
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <BookingDetailsView
        isVisible={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedBookingId(null);
        }}
        bookingId={selectedBookingId}
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
            <View style={styles.headerRow}>
              <AppText
                text="Guest Bookings"
                fontSize={22}
                type="Bold"
                color={Colors.BLACK}
              />
              <ButtonView
                style={styles.toggleButton}
                onPress={toggleTab}
                activeOpacity={0.8}
              >
                <AppText
                  text={selectedTab === 0 ? 'Reservations' : 'Calendar'}
                  color={Colors.WHITE}
                  fontSize={13}
                  type="SemiBold"
                />
              </ButtonView>
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
              bookings={rawData}
              onDayPress={handleDayPress}
              defaultPrice={defaultDailyPrice}
              isLoading={isRefreshing}
              onRefresh={handleRefresh}
              onListingPress={handleListingRowPress}
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
                    const isBookingRequest =
                      activeFilter?.trim() === 'booking_request';
                    console.log('isBookingRequest', isBookingRequest);

                    if (isBookingRequest) {
                      return (
                        <BookingRequestCard
                          id={item.booking_id || item.id}
                          guestName={item.guest}
                          platform={
                            item.source_type === 'livedin'
                              ? 'Livedin'
                              : config.label
                          }
                          platformColor={config.color}
                          guests={item?.number_of_guests}
                          startDate={item.start_date}
                          endDate={item.end_date}
                          perNightRate={item.amount} // add this field from your API if available
                          currency="SAR" // or derive from listing currency
                          onPress={handleReservationPress}
                          onAccept={id => {
                            // call your accept booking handler
                          }}
                          onReject={id => {
                            // call your reject booking handler
                          }}
                        />
                      );
                    }

                    return (
                      <ReservationCard
                        id={item.booking_id || item.id}
                        guestName={item.guest}
                        guests={item?.number_of_guests}
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
                        checkedoutDate={item?.end_date || ''}
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
        onApply={(selectedIds, type) => {
          const idsString = selectedIds.join(',');
          setSelectedPropertyValues(selectedIds);
          setAppliedListingIds(idsString);

          if (type) {
            // Synchronize the top tab with the modal selection
            setActiveFilter(type);
            setCheckInFilter(type);
          }

          setModalVisible(false);
        }}
        onReset={() => {
          setSelectedPropertyValues([]);
          setAppliedListingIds('');
          setActiveFilter('today'); // Reset to default tab
          setCheckInFilter('');
        }}
        actualProperties={listingOptions.filter(opt => opt.value !== '')}
      />

      {isBookingOpen && (
        <CreateBookingSheet
          isVisible={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          bookingType={bookingType}
          setBookingType={setBookingType}
          control={control}
          errors={errors}
          handleSubmit={handleSubmit}
          cleaningFee={cleaningFee}
          discount={discount}
          listingOptions={listingOptions}
          selectedListingId={selectedListingId || ''}
          onSubmit={onBookingSubmit}
          // onSubmit={handleSubmit(onBookingSubmit)}
          isLoading={isLoading}
        />
      )}
    </BGImage>
  );
};

const styles = StyleSheet.create({
  transparentContainer: { flex: 1, backgroundColor: 'transparent' },
  headerFixed: {
    paddingHorizontal: s(16),
    // backgroundColor: 'transparent',
    // zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(15),
  },
  toggleButton: {
    backgroundColor: '#21AA8F',
    paddingHorizontal: s(15),
    paddingVertical: vs(7),
    borderRadius: ms(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listContent: { paddingHorizontal: Metrics.baseMargin, flexGrow: 1, paddingVertical: Metrics.verticalScale(100) },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayLoader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default ListingScreen;
