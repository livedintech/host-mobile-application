import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const BookingDetailsViewSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={18}>
      <View style={styles.container}>
        {[1, 2].map((_, index) => (
          <View key={index} style={styles.card}>

            <View style={styles.headerRow}>
              <View style={styles.guestName} />
              <View style={styles.titleIcon} />
            </View>

            {[1, 2, 3, 4, 5].map((__, rowIndex) => (
              <View key={rowIndex} style={styles.infoRow}>
                <View style={styles.iconBox} />
                <View style={styles.textContainer}>
                  <View style={styles.label} />
                  <View style={styles.value} />
                </View>
              </View>
            ))}

          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: Metrics.verticalScale(12),
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(10),
  },

  guestName: {
    width: 140,
    height: 18,
    borderRadius: 6,
  },

  titleIcon: {
    width: 55,
    height: 24,
    borderRadius: 6,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(8),
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginRight: 10,
  },

  textContainer: {
    flex: 1,
  },

  label: {
    width: '50%',
    height: 14,
    borderRadius: 6,
    marginBottom: 6,
  },

  value: {
    width: '35%',
    height: 12,
    borderRadius: 6,
  },
});

export default BookingDetailsViewSkeleton;
