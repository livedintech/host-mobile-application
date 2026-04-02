import React from 'react';
import { StyleSheet, View } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '../AppButton/ButtonView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

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
  guests?: number;
  onPress?: (id: string | number) => void;
}

const ReservationCard = ({
  id,
  guestName,
  platform,
  property,
  checkIn,
  checkOut,
  platformColor,
  guests,
  onPress
}: ReservationCardProps) => {

  const getPlatformIcon = (platformName: string) => {
    const normalized = platformName.toLowerCase();
    if (normalized.includes('livedin')) return 'reservationlivedin';
    if (normalized.includes('airbnb')) return 'reservationairbnb';
    return 'platform'; 
  };

  const InfoRow = ({ icon, label, value, valueColor = "#4A4A4A" }: any) => (
    <View style={styles.infoRowContainer}>
      <View style={styles.iconBox}>
        <Svgicons path={icon} size={ms(32)} /> 
      </View>
      <View style={styles.textContainer}>
        <AppText text={label} color="#8E8E93" fontSize={11} type="Medium" />
        <AppText text={value} color={valueColor} fontSize={14} type="SemiBold" numberOfLines={1} />
      </View>
    </View>
  );

  return (
    <ButtonView 
      activeOpacity={0.8} 
      onPress={() => onPress?.(id)}
      style={styles.cardShadowWrapper}
    >
      <View style={styles.glassContainer}>
        
        {/* Header Section - Reduced Margin */}
        <View style={styles.headerRow}>
          <AppText text={guestName} type="Bold" fontSize={18} color="#1A1A1A" />
          <Svgicons path="reservationtitle" size={ms(55)} />
        </View>

        {/* Compact Info Rows */}
        <InfoRow 
          icon={getPlatformIcon(platform)}
          label="Booking Platform" 
          value={platform} 
          valueColor={platformColor} 
        />
        
        <InfoRow 
          icon="reservationaddress" 
          label="Property Address" 
          value={property} 
        />

        <InfoRow 
          icon="reservationcheckin" 
          label="Check-in Time" 
          value={checkIn} 
        />

        <InfoRow 
          icon="reservationcheckin" 
          label="Check-out Time" 
          value={checkOut} 
        />

        <InfoRow 
          icon="reservationguests" 
          label="Number of Guests" 
          value={guests} 
        />

      </View>
    </ButtonView>
  );
};

const styles = StyleSheet.create({
  cardShadowWrapper: {
    marginBottom: vs(12), 
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)', 
    borderRadius: ms(18),
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  infoRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8), 
  },
  iconBox: {
    width: ms(34),
    height: ms(34), 
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(10),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ReservationCard;