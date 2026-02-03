import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const BookingDetailsCard = () => {
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
            <DetailRow label="Booking Platform:" value="Airbnb" valueColor="#E35E60" />
            <DetailRow label="Number of Guests:" value="3" />
            <DetailRow label="Number of Nights:" value="2" />
          </View>

          {/* MIDDLE SECTION */}
          <View style={styles.section}>
            <DetailRow label="Check-in Time:" value="9:00AM" />
            <DetailRow label="Check-out Time:" value="11:00PM" />
            <DetailRow label="Booking Dates:" value="21-25 January 2026" />
          </View>

          {/* BOTTOM SECTION */}
          <View style={[styles.section, { marginBottom: 0 }]}>
            <DetailRow label="Confirmation Code:" value="001273" />
            <DetailRow label="Door Code:" value="2010" />
            <DetailRow label="Payment Status:" value="Unpaid" valueColor="#E35E60" />
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
  container: {
    width: '100%',
    paddingHorizontal: s(16),
    marginVertical: vs(10),
  },
  gradientContainer: {
    width: '100%',
    minHeight: vs(300),
    backgroundColor: 'transparent',
  },
  innerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: s(20),
    flex: 1,
  },
  section: {
    marginBottom: vs(24),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  label: {
    flex: 1.5,
    fontSize: ms(15),
    fontWeight: '700',
    color: '#1A332C',
  },
  value: {
    flex: 1,
    fontSize: ms(15),
    fontWeight: '500',
    textAlign: 'left',
  },
});

export default BookingDetailsCard;