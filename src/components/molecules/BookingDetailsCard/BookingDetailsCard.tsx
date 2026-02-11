import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

// Define what the card needs
interface BookingDetailsCardProps {
  data: {
    platform?: string;
    guests_count?: number | string;
    nights_count?: number | string;
    check_in?: string;
    check_out?: string;
    booking_dates?: string;
    confirmation_code?: string;
    door_code?: string;
    payment_status?: string;
  };
}

const BookingDetailsCard = ({ data }: BookingDetailsCardProps) => {
  const getStatusColor = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === 'unpaid' || s === 'cancelled') return '#E35E60';
    if (s === 'paid' || s === 'confirmed') return '#1A4D2E';
    return '#7B8D88';
  };

  return (
    <View style={styles.container}>
      <GradientBorder
        borderRadius={16}
        borderWidth={1}
        style={styles.gradientContainer}
      >
        <View style={styles.innerCard}>
          {/* TOP SECTION */}
          <View style={styles.section}>
            <DetailRow 
              label="Booking Platform:" 
              value={data?.platform || 'N/A'} 
              valueColor={data?.platform?.toLowerCase() === 'airbnb' ? '#E35E60' : '#7B8D88'} 
            />
            <DetailRow label="Number of Guests:" value={data?.guests_count || '0'} />
            <DetailRow label="Number of Nights:" value={data?.nights_count || '0'} />
          </View>

          {/* MIDDLE SECTION */}
          <View style={styles.section}>
            <DetailRow label="Check-in Time:" value={data?.check_in || 'N/A'} />
            <DetailRow label="Check-out Time:" value={data?.check_out || 'N/A'} />
            <DetailRow label="Booking Dates:" value={data?.booking_dates || 'N/A'} />
          </View>

          {/* BOTTOM SECTION */}
          <View style={[styles.section, { marginBottom: 0 }]}>
            <DetailRow label="Confirmation Code:" value={data?.confirmation_code || 'N/A'} />
            <DetailRow label="Door Code:" value={data?.door_code || 'N/A'} />
            <DetailRow 
              label="Payment Status:" 
              value={data?.payment_status || 'Unknown'} 
              valueColor={getStatusColor(data?.payment_status)} 
            />
          </View>
        </View>
      </GradientBorder>
    </View>
  );
};

const DetailRow = ({ label, value, valueColor = '#7B8D88' }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { width: '100%', paddingHorizontal: s(16), marginVertical: vs(10) },
  gradientContainer: { width: '100%', minHeight: vs(300), backgroundColor: 'transparent' },
  innerCard: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: s(20), flex: 1 },
  section: { marginBottom: vs(24) },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(12) },
  label: { flex: 1.5, fontSize: ms(15), fontWeight: '700', color: '#1A332C' },
  value: { flex: 1, fontSize: ms(15), fontWeight: '500', textAlign: 'left' },
});

export default BookingDetailsCard;