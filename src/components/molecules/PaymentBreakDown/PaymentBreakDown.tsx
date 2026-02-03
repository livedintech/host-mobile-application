import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { s, vs, ms } from 'react-native-size-matters';

const PaymentBreakdown = () => {
  return (
    <View style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.headerRow}>
        <CreditCard
          size={ms(30)}
          color="#1A332C"
          strokeWidth={1.5}
        />
        <Text style={styles.headerTitle}>Payment Breakdown</Text>
      </View>

      {/* PAYMENT GRID */}
      <View style={styles.gridContainer}>
        {/* ROW 1 */}
        <View style={styles.row}>
          <PaymentItem label="Booking Platform Fee:" value="SAR 1500.00" />
          <PaymentItem label="Booking Cost:" value="SAR 2500.00" />
        </View>

        {/* ROW 2 */}
        <View style={styles.row}>
          <PaymentItem label="Guest Paid Amount:" value="SAR 1500.00" />
          <PaymentItem label="Remaining Due:" value="SAR 1500.00" />
        </View>

        {/* ROW 3 */}
        <View style={styles.row}>
          <PaymentItem label="Host Share:" value="SAR 500" />
          <PaymentItem label="OTA Share:" value="SAR 2500" />
        </View>
      </View>
    </View>
  );
};

// Reusable sub-component for grid items
const PaymentItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.itemWrapper}>
    <Text style={styles.itemLabel}>{label}</Text>
    <Text style={styles.itemValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: s(35),
    paddingVertical: vs(25),
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(40),
  },
  headerTitle: {
    fontSize: ms(26),
    fontWeight: '700',
    color: '#1A332C',
    marginLeft: s(12),
    letterSpacing: -0.5,
  },
  gridContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(35),
  },
  itemWrapper: {
    flex: 1,
  },
  itemLabel: {
    fontSize: ms(17),
    fontWeight: '700',
    color: '#1A332C',
    marginBottom: vs(6),
    letterSpacing: -0.3,
  },
  itemValue: {
    fontSize: ms(16),
    color: '#7B8D88',
    fontWeight: '500',
  },
});

export default PaymentBreakdown;