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
  endDate,
  startDate,
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
    // if (normalized.includes('booking')) return 'bookingLogo'; // Example for future-proofing
    return 'platform'; // Default fallback icon
  };

  const InfoRow = ({ icon, label, value, valueColor = "#4A4A4A" }: any) => (
    <View style={styles.infoRowContainer}>
      <View style={styles.iconBox}>
        <Svgicons path={icon} size={ms(40)} />
      </View>
      <View style={styles.textContainer}>
        <AppText text={label} color="#8E8E93" fontSize={13} type="Medium" />
        <AppText text={value} color={valueColor} fontSize={15} type="SemiBold" numberOfLines={1} />
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
        
        {/* Header Section */}
        <View style={styles.headerRow}>
          <AppText text={guestName} type="Bold" fontSize={20} color="#1A1A1A" />
          <Svgicons path="reservationtitle" size={ms(70)} />
        </View>

        {/* Info Rows - Each in a separate row with its icon */}
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

        {/* <InfoRow 
          icon="calendar" 
          label="Start Date" 
          value={startDate} 
        />

        <InfoRow 
          icon="calendar" 
          label="End Date" 
          value={endDate} 
        /> */}

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
    marginBottom: vs(16),
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)', 
    borderRadius: ms(22),
    padding: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(20),
  },
  topRightIcon: {
    padding: ms(8),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: ms(12),
    // Subtle shadow for the ID icon box
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(15),
  },
  iconBox: {
    width: ms(38),
    height: ms(38),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: ms(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ReservationCard;