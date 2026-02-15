import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { MapPin, Calendar as CalendarIcon, Clock, Smartphone } from 'lucide-react-native';
import AppText from '@/components/molecules/AppText/AppText';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import ButtonView from '../AppButton/ButtonView';

interface ReservationCardProps {
  id: string | number;
  guestName: string;
  platform: string;
  property: string;
  startDate: string;
  endDate: string;
  checkIn: string;
  checkOut: string;
  platformColor: string;
  onPress?: (id: string | number) => void;
}

const ReservationCard = ({
  id,
  guestName,
  platform,
  property,
  endDate,
  startDate,
  checkIn,
  checkOut,
  platformColor,
  onPress
}: ReservationCardProps) => {
  return (
    <ButtonView 
      activeOpacity={0.7} 
      onPress={() => onPress?.(id)}
      style={styles.cardWrapper}
    >
      <GradientBorder style={styles.cardWrapper} borderRadius={ms(15)} borderWidth={1}>
        <View style={styles.cardInner}>
          <AppText text={guestName} type="Bold" fontSize={20} color="#1A332C" mb={vs(12)} />
          
          <View style={styles.infoRow}>
            <Smartphone size={ms(18)} color="#1A332C" />
            <AppText text=" Booking Platform: " color="#1A332C" fontSize={14} ml={s(4)} />
            <AppText text={platform} color={platformColor} type="Bold" fontSize={14} />
          </View>

          <View style={styles.infoRow}>
            <MapPin size={ms(18)} color="#1A332C" />
            <AppText text=" Property: " color="#1A332C" fontSize={14} ml={s(4)} />
            <AppText text={property} color="#4A615C" fontSize={14} style={{ flex: 1 }} numberOfLines={1}/>
          </View>

          <View style={styles.infoRow}>
            <CalendarIcon size={ms(18)} color="#1A332C" />
            <AppText text="Start Date: " color="#1A332C" fontSize={14} ml={s(4)} />
            <AppText text={startDate} color="#4A615C" fontSize={14} />
          </View>
        <View style={styles.infoRow}>
            <CalendarIcon size={ms(18)} color="#1A332C" />
            <AppText text="End Date: " color="#1A332C" fontSize={14} ml={s(4)} />
            <AppText text={endDate} color="#4A615C" fontSize={14} />
          </View>

          <View style={styles.infoRow}>
            <Clock size={ms(18)} color="#1A332C" />
            <AppText text=" Check-in Time: " color="#1A332C" fontSize={14} ml={s(4)} />
            <AppText text={checkIn} color="#4A615C" fontSize={14} />
          </View>

          <View style={styles.infoRow}>
            <Clock size={ms(18)} color="#1A332C" />
            <AppText text=" Check-out Time: " color="#1A332C" fontSize={14} ml={s(4)} />
            <AppText text={checkOut} color="#4A615C" fontSize={14} />
          </View>
        </View>
      </GradientBorder>
    </ButtonView>
    
  );
};

const styles = StyleSheet.create({
  cardWrapper: { marginBottom: vs(16), backgroundColor: '#FFF' },
  cardInner: { padding: ms(16), backgroundColor: '#FFF' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(6) },
});

export default ReservationCard;