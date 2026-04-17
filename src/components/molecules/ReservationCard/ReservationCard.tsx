import React from 'react';
import { StyleSheet, View } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '../AppButton/ButtonView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';

interface ReservationCardProps {
  id: string | number;
  guestName: string;
  platform: string;
  property: string;
  startDate: string;
  endDate: string;
  checkIn: string;
  checkOut: string;
  checkedoutDate: string;
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
  checkedoutDate,
  platformColor,
  guests,
  onPress,
}: ReservationCardProps) => {
  console.log('platform', platform);

  const getPlatformIcon = (platformName: string) => {
    const normalized = platformName.toLowerCase();
    if (normalized.includes('livedin')) return 'reservationlivedin';
    if (normalized.includes('airbnb')) return 'reservationairbnb';
    if (normalized.includes('booking')) return 'bookingCom';
    if (normalized.includes('gathern')) return 'gathern';
    return 'platform';
  };

  const InfoRow = ({ icon, label, value, valueColor = '#4A4A4A' }: any) => {
    // Check if it's the booking icon to apply a smaller scale
    const isPlatformIcon =
      icon === 'bookingCom' ||
      icon === 'reservationlivedin' ||
      icon === 'reservationairbnb';

    return (
      <View style={styles.infoRowContainer}>
        <View style={styles.iconBox}>
          <Svgicons
            path={icon}
            // If it's a platform logo, make it smaller (e.g., 20)
            // so it doesn't touch the edges of the 34px box
            size={isPlatformIcon ? ms(32) : ms(32)}
          />
        </View>
        <View style={styles.textContainer}>
          <AppText text={label} color="#000000" fontSize={14} type="Regular" />
          <AppText
            text={value}
            color={Colors.DARK_CHARCOAL}
            fontSize={12}
            type="Regular"
            numberOfLines={2}
          />
        </View>
      </View>
    );
  };

  return (
    <ButtonView
      activeOpacity={0.8}
      onPress={() => onPress?.(id)}
      style={styles.cardShadowWrapper}
    >
      <View style={styles.glassContainer}>
        {/* Header Section - Reduced Margin */}
        <View style={styles.headerRow}>
          <AppText text={guestName} type="Medium" fontSize={18} color="#1A1A1A" />
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
          label="Property Name"
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
          icon="reservationcheckin"
          label="Checked-out Date"
          value={checkedoutDate}
        />

        {!platform?.toLowerCase().includes('livedin') && (
          <InfoRow
            icon="reservationguests"
            label="Number of Guests"
            value={guests}
          />
        )}
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
