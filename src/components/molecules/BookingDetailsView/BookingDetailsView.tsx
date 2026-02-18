import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs, ms } from 'react-native-size-matters';
import { X } from 'lucide-react-native';
import AppText from '@/components/molecules/AppText/AppText';
import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';
import { getOtaConfig } from '@/constants/ota_config';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  data: any[];
  onCardPress: (bookingId: string | number) => void;
}

export const BookingDetailsView = ({ isVisible, onClose, data, onCardPress }: Props) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <AppText text="Reservation Details" type="Bold" fontSize={18} color="#1A332C" />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={ms(24)} color="#1A332C" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {data && data.length > 0 ? (
            data.map((item: any, index: number) => {
              const otaConfig = getOtaConfig(item.source);
              const platformLabel = item.source_type === 'livedin' ? 'Livedin' : (item.source || 'Direct');
              
              return (
                <View key={index} style={styles.cardWrapper}>
                  <ReservationCard
                    id={item.id}
                    guestName={item.guest}
                    platform={platformLabel}
                    property={item.listing_title}
                    endDate={item?.end_date || ''}
                    startDate={item?.start_date || ''}
                    checkIn={item.checkIn || "04:00 PM"}
                    checkOut={item.checkOut || "12:00 AM"}
                    platformColor={otaConfig.color}
                    onPress={() => {
                      onClose();
                      onCardPress(item.booking_id);
                    }}
                  />
                </View>
              );
            })
          ) : (
            <View style={styles.empty}>
              <AppText text="No booking information available." color="#666" />
            </View>
          )}
        </ScrollView>
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
  empty: { alignItems: 'center', marginTop: vs(100) }
});