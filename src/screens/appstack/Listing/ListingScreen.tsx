import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { useRoute } from '@react-navigation/native';

import useListingContainer from './container/ListingContainer';
import AppText from '@/components/molecules/AppText/AppText';
import { BookingDetailsView } from '@/components/molecules/BookingDetailsView/BookingDetailsView';
import { CalendarSection } from '@/components/molecules/CalendarSection/CalendarSection';
import { Colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import NoListing from './NoListing';
import BGImage from '@/components/molecules/BGImage/BGImage';
import CreateBookingSheet from '@/components/molecules/CreateBookingSheet/CreateBookingSheet';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { useTranslation } from 'react-i18next';
import NoListingScreen from '../NoListingScreen/NoListingScreen';

const ListingScreen = () => {
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const user = authStore?.user;
  const route = useRoute<any>();

  const {
    control,
    errors,
    handleSubmit,
    setValue,
    selectedListingId,
    listingOptions,
    calendarDataMap,
    rawData,
    defaultDailyPrice,
    isFetchingDetails,
    handleReservationPress,
    onCreateBooking,
    handleRefresh,
    isRefreshing,
    isBookingOpen,
    setIsBookingOpen,
    isLoading,
    isCalendarLoading,
    cleaningFee,
    discount,
    bookingType,
    setBookingType,
  } = useListingContainer(route.params?.listing_id, 0); // Fixed to Tab 0 logic
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleToggleToReservations = () => {
    navigate(NavigationRoutes.APP_STACK.RESERVATION_CALENDAR); 
  };

  if (!user?.has_listing) {
    return <NoListingScreen />;
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
      if (bookingCode) handleReservationPress(bookingCode);
    } else {
      if (user?.role_key === 'supervisor') return;
      setValue('start_date', day.dateString);
      setIsBookingOpen(true);
    }
  };

  const onBookingSubmit = async (data: any) => {
    setIsBookingOpen(false);
    await onCreateBooking(data);
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

      {(isFetchingDetails || isLoading || isCalendarLoading) && (
        <View style={styles.overlayLoader}>
          <ActivityIndicator size="large" color={Colors.MEDIUM_JUNGLE_GREEN} />
        </View>
      )}

      <View style={styles.headerFixed}>
        <View style={styles.headerRow}>
          <AppText text={t('app.listing_screen.guest_bookings')} fontSize={26} type="Medium" color={Colors.BLACK} />
          <ButtonView style={styles.toggleButton} onPress={handleToggleToReservations}>
            <AppText text={t('app.listing_screen.reservations')} color={Colors.WHITE} fontSize={10} type="SemiBold" />
          </ButtonView>
        </View>
      </View>

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
        onListingPress={(id) => setValue('listing_selection', String(id))}
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
          isLoading={isLoading}
        />
      )}
    </BGImage>
  );
};

const styles = StyleSheet.create({
  headerFixed: { paddingHorizontal: s(16), marginTop: vs(15) },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(15) },
  toggleButton: { backgroundColor: '#21AA8F', paddingHorizontal: s(15), borderRadius: ms(20), height: 33, justifyContent: 'center' },
  overlayLoader: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
});

export default ListingScreen;