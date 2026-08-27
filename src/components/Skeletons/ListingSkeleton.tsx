import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = SCREEN_WIDTH / 7;

const ListingSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>

        <View style={styles.dropdownLabel} />
        <View style={styles.dropdown} />

        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <View style={styles.arrow} />
            <View style={styles.monthLabel} />
            <View style={styles.arrow} />
          </View>

          <View style={styles.weekRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
              <View key={index} style={styles.weekDayCell} />
            ))}
          </View>

          {[1, 2, 3, 4, 5].map((_, rowIndex) => (
            <View key={rowIndex} style={styles.weekRow}>
              {[1, 2, 3, 4, 5, 6, 7].map((__, colIndex) => (
                <View key={colIndex} style={styles.dayCell} />
              ))}
            </View>
          ))}
        </View>

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.baseMargin,
    paddingTop: Metrics.scale(20),
  },

  dropdownLabel: {
    width: 100,
    height: 14,
    borderRadius: 6,
    marginBottom: 10,
  },

  dropdown: {
    height: 52,
    borderRadius: 16,
    marginBottom: 30,
  },

  calendarCard: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: Metrics.verticalScale(10),
  },

  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  arrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  monthLabel: {
    width: 120,
    height: 18,
    borderRadius: 6,
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  weekDayCell: {
    width: COLUMN_WIDTH - 10,
    height: 14,
    borderRadius: 6,
    marginVertical: Metrics.verticalScale(8),
  },

  dayCell: {
    width: COLUMN_WIDTH - 10,
    height: Metrics.verticalScale(40),
    borderRadius: 12,
    marginVertical: 4,
  },
});

export default ListingSkeleton;
