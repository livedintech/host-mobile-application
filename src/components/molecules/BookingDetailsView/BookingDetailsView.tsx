import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs, ms } from 'react-native-size-matters';
import { X } from 'lucide-react-native';
import AppText from '@/components/molecules/AppText/AppText';
import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  data: any[];
}

export const BookingDetailsView = ({ isVisible, onClose, data }: Props) => {
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
            data.map((item: any, index: number) => (
              <View key={index} style={styles.cardWrapper}>
                <ReservationCard 
                  id={item.id}
                  guestName={item.guestName}
                  platform={item.platform}
                  property={item.property}
                  date={item.date}
                  checkIn={item.checkIn || "09:00 AM"}
                  checkOut={item.checkOut || "11:00 PM"}
                  platformColor={item.platformColor}
                  // For the modal view, we usually don't need a deep onPress, 
                  // but we keep it consistent
                  onPress={() => {}} 
                />
              </View>
            ))
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
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: s(16), 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF'
  },
  closeButton: { 
    padding: s(4) 
  },
  scroll: { 
    padding: s(16), 
    paddingBottom: vs(40) 
  },
  cardWrapper: { 
    marginBottom: vs(12) 
  },
  empty: { 
    alignItems: 'center', 
    marginTop: vs(100) 
  }
});