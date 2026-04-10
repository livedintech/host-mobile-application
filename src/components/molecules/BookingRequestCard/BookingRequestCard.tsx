import React from 'react';
import { StyleSheet, View } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '../AppButton/ButtonView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';

interface BookingRequestCardProps {
  id: string | number;
  guestName: string;
  platform: string;
  platformColor: string;
  guests?: number;
  startDate: string;
  endDate: string;
  perNightRate?: number | string;
  currency?: string;
  onAccept?: (id: string | number) => void;
  onReject?: (id: string | number) => void;
  onPress?: (id: string | number) => void;
  isLoading?: boolean;
}

const BookingRequestCard = ({
  id,
  guestName,
  platform,
  platformColor,
  guests,
  startDate,
  endDate,
  perNightRate,
  currency = 'SAR',
  onAccept,
  onReject,
  onPress,
  isLoading,
}: BookingRequestCardProps) => {
  const getPlatformIcon = (platformName: string) => {
    const normalized = platformName.toLowerCase();
    if (normalized.includes('livedin')) return 'reservationlivedin';
    if (normalized.includes('airbnb')) return 'reservationairbnb';
    return 'platform';
  };

  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const monthName = startDate.toLocaleString('en-US', { month: 'long' });
    const startDay = getOrdinal(startDate.getUTCDate());
    const endDay = getOrdinal(endDate.getUTCDate());

    if (startDate.getUTCMonth() === endDate.getUTCMonth()) {
      return `${startDay} - ${endDay} ${monthName}`;
    }

    const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
    return `${startDay} ${monthName} - ${endDay} ${endMonth}`;
  };

  const InfoRow = ({ icon, label, value, valueColor = '#4A4A4A' }: any) => (
    <View style={styles.infoRowContainer}>
      <View style={styles.iconBox}>
        <Svgicons path={icon} size={ms(32)} />
      </View>
      <View style={styles.textContainer}>
        <AppText text={label} color="#8E8E93" fontSize={11} type="Medium" />
        <AppText
          text={value}
          color={valueColor}
          fontSize={14}
          type="SemiBold"
          numberOfLines={1}
        />
      </View>
    </View>
  );

  return (
    <ButtonView
      activeOpacity={0.8}
    //   onPress={() => !isLoading && onPress?.(id)}
      style={styles.cardShadowWrapper}
    >
      <View style={styles.glassContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <AppText text={guestName} type="Bold" fontSize={18} color="#1A1A1A" />
          <Svgicons path="reservationtitle" size={ms(55)} />
        </View>

        {/* Info Rows */}
        <InfoRow
          icon={getPlatformIcon(platform)}
          label="Booking Platform"
          value={platform}
          valueColor={platformColor}
        />

        <InfoRow
          icon="reservationguests"
          label="Number Of Guests"
          value={
            guests !== undefined
              ? `${guests} Guest${guests !== 1 ? 's' : ''}`
              : '—'
          }
        />

        <InfoRow
          icon="reservationcheckin"
          label="Booking Date"
          value={formatDateRange(startDate, endDate)}
        />

        <InfoRow
          icon="reservationcheckin"
          label="Per-Night Rate"
          value={
            perNightRate !== undefined ? `${currency} ${perNightRate}` : '—'
          }
        />

        {/* Accept / Reject Buttons — each wrapped in GlassCard */}
        <View style={styles.actionRow}>
          <GlassCard width="48%" style={styles.rejectGlass}>
            <ButtonView
              style={styles.actionButton}
              onPress={() => !isLoading && onReject?.(id)} // Disable press
              activeOpacity={isLoading ? 1 : 0.75}
            >
              <AppText
                text="Decline"
                fontSize={14}
                type="SemiBold"
                color={isLoading ? '#A0A0A0' : '#E05C5C'} // Change color if loading
              />
            </ButtonView>
          </GlassCard>

          <GlassCard width="48%" style={styles.acceptGlass}>
            <ButtonView
              style={styles.actionButton}
              onPress={() => !isLoading && onAccept?.(id)} 
              activeOpacity={isLoading ? 1 : 0.75}
            >
              <AppText
                text="Accept"
                fontSize={14}
                type="SemiBold"
                color={isLoading ? '#A0A0A0' : '#21AA8F'} 
              />
            </ButtonView>
          </GlassCard>
        </View>
      </View>
    </ButtonView>
  );
};

const styles = StyleSheet.create({
  cardShadowWrapper: {
    marginBottom: vs(12),
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Slightly more transparent
    borderRadius: ms(24), // Increased for the softer look in image
    paddingHorizontal: ms(20),
    paddingVertical: ms(16),
    borderWidth: 1.5, // Thicker border often helps the "glass" look
    borderColor: 'rgba(255, 255, 255, 0.7)',
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginVertical: vs(10),
    marginHorizontal: s(4),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(12), // Spacing after the last info row
  },

  rejectGlass: {
    marginBottom: 0,
    padding: 0,
    borderRadius: ms(12),
    borderWidth: 1,
    // REMOVED: Red border color
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Soft inner fill
  },

  acceptGlass: {
    marginBottom: 0,
    padding: 0,
    borderRadius: ms(12),
    borderWidth: 1,
    // REMOVED: Green border color
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Soft inner fill
  },

  actionButton: {
    height: vs(42), // Matches Figma button height
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookingRequestCard;
