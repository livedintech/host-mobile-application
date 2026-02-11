import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { s, vs, ms } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';

interface BookingDetailsViewProps {
  isVisible: boolean;
  onClose: () => void;
  data: any[];
}

export const BookingDetailsView = ({ isVisible, onClose, data }: BookingDetailsViewProps) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <AppText text="Reservation Details" type="Bold" fontSize={18} color="#1A332C" />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={ms(24)} color="#1A332C" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {data && data.length > 0 ? (
            data.map((item: any, index: number) => (
              <View key={index} style={styles.cardWrapper}>
                <ReservationCard 
                   guestName={item.guestName}
                   platform={item.platform}
                   property={item.property}
                   date={item.date}
                   checkIn={item.checkIn}
                   checkOut={item.checkOut}
                   platformColor={item.platformColor}
                />
              </View>
            ))
          ) : (
            <View style={styles.empty}>
              <AppText text="No booking information available for this date." color="#666" />
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
  content: { padding: s(16) },
  cardWrapper: { marginBottom: vs(12) },
  empty: { alignItems: 'center', marginTop: vs(100) }
});