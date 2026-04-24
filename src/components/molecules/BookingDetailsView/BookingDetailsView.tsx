import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, SafeAreaView } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { X } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import AppText from '@/components/molecules/AppText/AppText';
import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';
import { getOtaConfig } from '@/constants/ota_config';
import { getBookingDetailsApi } from '@/services/calendarBookingManagement';
import { useTranslation } from 'react-i18next';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  bookingId: string | null; // Pass the ID instead of the data array
  onCardPress: (bookingId: string | number) => void;
}

export const BookingDetailsView = ({ isVisible, onClose, bookingId, onCardPress }: Props) => {
  const { t } = useTranslation();

  // Fetch data only when modal is visible and bookingId exists
  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: ['BOOKING_DETAILS', bookingId],
    queryFn: () => getBookingDetailsApi(bookingId!),
    enabled: isVisible && !!bookingId,
  });

  // Ensure we are working with an array (API might return a single object or array)
  const bookings = Array.isArray(apiData) ? apiData : apiData ? [apiData] : [];

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <AppText text={t('app.booking_details.title')} type="Bold" fontSize={18} color="#000000" />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={ms(24)} color="#000000" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#000000" />
            <AppText text={t('app.booking_details.fetching')} mt={10} color="#666" />
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <AppText text={t('app.booking_details.failed')} color="red" />
            <TouchableOpacity onPress={onClose} style={styles.retryBtn}>
              <AppText text={t('app.booking_details.close')} color="#000000" />
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            {bookings.length > 0 ? (
              bookings.map((item: any, index: number) => {
                const otaConfig = getOtaConfig(item.source);
                const platformLabel = (item?.data?.property?.booking_platform === 'livedin' || item?.data?.property?.booking_platform === 'host_booking') ? 'Livedin' : (item?.data?.property?.booking_platform || 'Direct');
                console.log('Soingle Item Data', item?.data)
                return (
                  <View key={index} style={styles.cardWrapper}>
                    <ReservationCard
                      id={item.id}
                      guestName={item?.data?.guest?.name || 'Guest'}
                      platform={platformLabel}
                      property={item?.data?.property?.name || 'Property'}
                      endDate={item?.data?.property?.booking_dates?.to || ''}
                      startDate={item?.data?.property?.booking_dates?.from || ''}
                      checkIn={item?.data?.property?.check_in_time || "04:00 PM"}
                      checkOut={item?.data?.property?.check_out_time || "12:00 PM"}
                      checkedoutDate={item?.data?.property?.end_date || ""}
                      platformColor={otaConfig.color}
                      onPress={() => {
                        onClose();
                        onCardPress(bookingId || '');
                      }}
                    />
                  </View>
                );
              })
            ) : (
              <View style={styles.empty}>
                <AppText text={t('app.booking_details.empty')} color="#666" />
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF'
  },
  closeButton: { padding: s(4) },
  scroll: { padding: s(16), paddingBottom: vs(40) },
  cardWrapper: { marginBottom: vs(12) },
  empty: { alignItems: 'center', marginTop: vs(100) },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryBtn: { marginTop: 20, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: '#DDD' }
});