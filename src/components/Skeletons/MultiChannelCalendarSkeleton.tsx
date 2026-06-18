import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { s, vs, ms } from 'react-native-size-matters';
import Metrics from '@/utility/Metrics';

const MultiChannelCalendarSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={10}>
      <View style={styles.container}>
        <View style={styles.dropdownLabel} />
        <View style={styles.dropdown} />

        {[1, 2, 3, 4, 5].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.propertyImage} />
            <View style={styles.infoContainer}>
              <View style={styles.titleLine} />
              <View style={styles.addressLine} />
              <View style={styles.descLine} />
            </View>
            <View style={styles.calendarColumn}>
              {[1, 2, 3].map((__, rowIndex) => (
                <View key={rowIndex} style={styles.dotsRow}>
                  {[1, 2, 3, 4, 5, 6, 7].map((___, dotIndex) => (
                    <View key={dotIndex} style={styles.dot} />
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(10),
    padding: s(12),
    marginBottom: vs(12),
  },
  propertyImage: {
    width: ms(62),
    height: ms(60),
    borderRadius: ms(15),
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: s(12),
  },
  titleLine: {
    width: '80%',
    height: 15,
    borderRadius: 6,
    marginBottom: vs(6),
  },
  addressLine: {
    width: '60%',
    height: 11,
    borderRadius: 6,
    marginBottom: vs(6),
  },
  descLine: {
    width: '40%',
    height: 11,
    borderRadius: 6,
  },
  calendarColumn: {
    width: ms(70),
    alignItems: 'flex-end',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: ms(4),
    marginBottom: vs(6),
  },
  dot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
});

export default MultiChannelCalendarSkeleton;
