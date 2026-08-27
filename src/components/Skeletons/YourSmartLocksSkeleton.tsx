import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const YourSmartLocksSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={20}>
      <View style={styles.container}>
        <View style={styles.titleLine} />

        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.aliasLine} />

            <View style={styles.infoSection}>
              <View style={styles.row}>
                <View style={styles.labelSmall} />
                <View style={styles.valueSmall} />
              </View>
              <View style={styles.row}>
                <View style={styles.labelMedium} />
                <View style={styles.valueSmall} />
              </View>
              <View style={styles.row}>
                <View style={styles.labelSmall} />
                <View style={styles.valueTiny} />
              </View>
            </View>

            <View style={styles.dropdownField} />
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.scale(25),
    paddingTop: Metrics.verticalScale(30),
  },
  titleLine: {
    width: '60%',
    height: 28,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(28),
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: Metrics.scale(20),
    marginBottom: Metrics.verticalScale(20),
  },
  aliasLine: {
    width: '50%',
    height: 18,
    borderRadius: 8,
    marginBottom: Metrics.verticalScale(8),
  },
  infoSection: {
    marginBottom: Metrics.verticalScale(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelSmall: {
    width: 80,
    height: 12,
    borderRadius: 6,
  },
  labelMedium: {
    width: 110,
    height: 12,
    borderRadius: 6,
  },
  valueSmall: {
    width: 70,
    height: 12,
    borderRadius: 6,
  },
  valueTiny: {
    width: 40,
    height: 12,
    borderRadius: 6,
  },
  dropdownField: {
    width: '100%',
    height: Metrics.verticalScale(54),
    borderRadius: 10,
    marginTop: Metrics.verticalScale(15),
  },
});

export default YourSmartLocksSkeleton;
