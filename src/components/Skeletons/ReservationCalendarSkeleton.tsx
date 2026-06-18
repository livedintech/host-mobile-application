import React from 'react';
import { View, StyleSheet } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ReservationCalendarSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={18}>
      <View style={styles.container}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.headerRow}>
              <View style={styles.guestName} />
              <View style={styles.titleIcon} />
            </View>

            {[1, 2, 3, 4].map((__, rowIndex) => (
              <View key={rowIndex} style={styles.infoRow}>
                <View style={styles.iconBox} />
                <View style={styles.textGroup}>
                  <View style={styles.labelLine} />
                  <View style={styles.valueLine} />
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
    paddingHorizontal: Metrics.baseMargin,
    paddingTop: Metrics.verticalScale(10),
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: ms(18),
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    marginBottom: vs(12),
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },

  guestName: {
    width: 140,
    height: 18,
    borderRadius: 6,
  },

  titleIcon: {
    width: ms(55),
    height: ms(20),
    borderRadius: 6,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },

  iconBox: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(8),
    marginRight: s(10),
  },

  textGroup: {
    flex: 1,
    justifyContent: 'center',
  },

  labelLine: {
    width: 90,
    height: 14,
    borderRadius: 6,
    marginBottom: 4,
  },

  valueLine: {
    width: 130,
    height: 12,
    borderRadius: 6,
  },
});

export default ReservationCalendarSkeleton;
