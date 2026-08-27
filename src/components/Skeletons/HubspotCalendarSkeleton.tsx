import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const HubspotCalendarSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={8}>
      <View style={styles.container}>

        <View style={styles.monthHeader}>
          <View style={styles.arrow} />
          <View style={styles.monthLabel} />
          <View style={styles.arrow} />
        </View>

        <View style={styles.weekRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
            <View key={index} style={styles.weekDayLabel} />
          ))}
        </View>

        {[1, 2, 3, 4, 5].map((_, rowIndex) => (
          <View key={rowIndex} style={styles.weekRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((__, dayIndex) => (
              <View key={dayIndex} style={styles.dayCell} />
            ))}
          </View>
        ))}

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.scale(10),
    paddingVertical: Metrics.verticalScale(10),
  },

  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(20),
  },

  arrow: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },

  monthLabel: {
    width: 120,
    height: 16,
    borderRadius: 7,
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Metrics.verticalScale(14),
  },

  weekDayLabel: {
    width: 28,
    height: 12,
    borderRadius: 6,
  },

  dayCell: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
});

export default HubspotCalendarSkeleton;
