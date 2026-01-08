import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ManageBookingSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.container}>

        {/* Header Title */}
        <View style={styles.headerTitle} />

        {/* Platform Card Skeleton */}
        {[1, 2].map((_, index) => (
          <View key={index} style={styles.card}>

            {/* Row 1 */}
            <View style={styles.row}>
              <View style={styles.labelSmall} />
              <View style={styles.valueMedium} />
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              <View style={styles.labelMedium} />
              <View style={styles.valueLarge} />
            </View>

            {/* Row 3 */}
            <View style={styles.row}>
              <View style={styles.labelLarge} />
              <View style={styles.valueSmall} />
            </View>

            {/* Status + Arrow */}
            <View style={styles.statusRow}>
              <View style={styles.statusLabel} />
              <View style={styles.statusValue} />
              <View style={styles.arrowCircle} />
            </View>

          </View>
        ))}

        {/* Bottom Buttons */}
        <View style={styles.button} />
        <View style={styles.button} />

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 50,
  },

  /* Header */
  headerTitle: {
    width: '75%',
    height: 34,
    borderRadius: 10,
    marginBottom: 40,
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(10),
  },

  labelSmall: {
    width: 70,
    height: 14,
    borderRadius: 6,
    marginRight: 10,
  },

  labelMedium: {
    width: 110,
    height: 14,
    borderRadius: 6,
    marginRight: 10,
  },

  labelLarge: {
    width: 160,
    height: 14,
    borderRadius: 6,
    marginRight: 10,
  },

  valueSmall: {
    width: 40,
    height: 14,
    borderRadius: 6,
  },

  valueMedium: {
    width: 80,
    height: 14,
    borderRadius: 6,
  },

  valueLarge: {
    width: 120,
    height: 14,
    borderRadius: 6,
  },

  /* Status row */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
  },

  statusLabel: {
    width: 130,
    height: 14,
    borderRadius: 6,
    marginRight: 8,
  },

  statusValue: {
    width: 60,
    height: 14,
    borderRadius: 6,
  },

  arrowCircle: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  /* Buttons */
  button: {
    height: 56,
    borderRadius: 16,
    marginTop: 15,
  },
});

export default ManageBookingSkeleton;
