import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { useRoute } from '@react-navigation/native';

import useListingContainer from './container/ListingContainer';
import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';
import BookingRequestCard from '@/components/molecules/BookingRequestCard/BookingRequestCard';
import AppText from '@/components/molecules/AppText/AppText';
import { ReservationHeader } from '@/components/molecules/ReservationHeader/ReservationHeader';
import { FilterModalView } from '@/components/molecules/FilterModalView/FilterModalView';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import BGImage from '@/components/molecules/BGImage/BGImage';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import { getOtaConfig } from '@/constants/ota_config';
import Metrics from '@/utility/Metrics';
import { goBack } from '@/services/navigationService';
import { useTranslation } from 'react-i18next';

const ReservationCalendarScreen = () => {
  const route = useRoute<any>();
  const { t } = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPropertyValues, setSelectedPropertyValues] = useState<
    string[]
  >([]);

  const {
    listingOptions,
    resLoading,
    filteredReservations,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    setAppliedListingIds,
    handleReservationPress,
    handleRefresh,
    isRefreshing,
    setCheckInFilter,
    handleBookingAction,
  } = useListingContainer(route.params?.listing_id, 1); // Fixed to Tab 1 logic

  useEffect(() => {
    if (route.params?.activeFilter) {
      const filterValue = route.params.activeFilter;

      // Set the visual tab (FilterChipBar)
      setActiveFilter(filterValue);

      // Set the functional filter for the container logic
      // This ensures the API/Filter logic inside useListingContainer updates
      setCheckInFilter(filterValue);
    }
  }, [route.params?.activeFilter]);

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.headerFixed}>
        <View style={styles.headerRow}>
          <AppText
            text={t('app.reservation_calendar.title')}
            fontSize={26}
            type="Medium"
            color={Colors.BLACK}
          />
          <ButtonView style={styles.toggleButton} onPress={() => goBack()}>
            <AppText
              text={t('app.reservation_calendar.calendar_btn')}
              color={Colors.WHITE}
              fontSize={10}
              type="SemiBold"
            />
          </ButtonView>
        </View>

        <ReservationHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onFilterPress={() => setModalVisible(true)}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </View>

      <View style={{ flex: 1 }}>
        {resLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.MEDIUM_JUNGLE_GREEN} />
          </View>
        ) : (
          <FlatListSimpleHandler
            isLoading={isRefreshing}
            onRefresh={handleRefresh}
            data={filteredReservations}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <AppText text={t('app.reservation_calendar.empty')} color="#999" />
              </View>
            }
            renderItem={({ item }) => {
              const config = getOtaConfig(item.source);
              const isBookingRequest =
                activeFilter?.trim() === 'booking_request';

              if (isBookingRequest) {
                return (
                  <BookingRequestCard
                    id={item.id}
                    guestName={item.guest}
                    platform={
                      item.source_type === 'livedin' ? 'Livedin' : config.label
                    }
                    platformColor={config.color}
                    guests={item?.number_of_guests}
                    startDate={item.start_date}
                    endDate={item.end_date}
                    perNightRate={item.amount}
                    currency="SAR"
                    onAccept={id => handleBookingAction(id, 'accept_request')}
                    onReject={id =>
                      handleBookingAction(
                        id,
                        'decline_request',
                        item.guest,
                        item.start_date,
                        item.end_date,
                      )
                    }
                  />
                );
              }

              return (
                <ReservationCard
                  id={item.booking_id || item.id}
                  guestName={item.guest}
                  guests={item?.number_of_guests}
                  platform={
                    item.source_type === 'livedin' ? 'Livedin' : config.label
                  }
                  property={item.listing_title || 'Property'}
                  endDate={item.end_date}
                  startDate={item.start_date}
                  checkIn={item?.checkIn || '04:00 PM'}
                  checkOut={item?.checkOut || '12:00 AM'}
                  checkedoutDate={item?.end_date || ''}
                  platformColor={config.color}
                  onPress={handleReservationPress}
                  t={t}
                />
              );
            }}
          />
        )}
      </View>

      <FilterModalView
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        initialSelectedValues={selectedPropertyValues}
        onApply={(selectedIds, type) => {
          setSelectedPropertyValues(selectedIds);
          setAppliedListingIds(selectedIds.join(','));
          if (type) {
            setActiveFilter(type);
            setCheckInFilter(type);
          }
          setModalVisible(false);
        }}
        onReset={() => {
          setSelectedPropertyValues([]);
          setAppliedListingIds('');
          setActiveFilter('today');
          setCheckInFilter('');
        }}
        actualProperties={listingOptions.filter(opt => opt.value !== '')}
      />
    </BGImage>
  );
};

const styles = StyleSheet.create({
  headerFixed: { paddingHorizontal: s(16), marginTop: vs(20) },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(15),
  },
  toggleButton: {
    backgroundColor: '#21AA8F',
    paddingHorizontal: s(15),
    borderRadius: ms(20),
    height: 33,
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: Metrics.baseMargin,
    flexGrow: 1,
    paddingBottom: vs(100),
  },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ReservationCalendarScreen;
