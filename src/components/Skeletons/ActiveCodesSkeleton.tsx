import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ActiveCodesSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={20}>
      <View style={styles.container}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.titleLine} />

            <View style={styles.row}>
              <View style={styles.label} />
              <View style={styles.value} />
            </View>

            <View style={styles.row}>
              <View style={styles.labelLong} />
              <View style={styles.value} />
            </View>

            <View style={styles.row}>
              <View style={styles.label} />
              <View style={styles.statusValue} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: Metrics.verticalScale(10),
  },

  card: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
  },

  titleLine: {
    width: '50%',
    height: 18,
    borderRadius: 8,
    marginBottom: Metrics.verticalScale(12),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },

  label: {
    width: 80,
    height: 14,
    borderRadius: 6,
  },

  labelLong: {
    width: 150,
    height: 14,
    borderRadius: 6,
  },

  value: {
    width: 70,
    height: 14,
    borderRadius: 6,
  },

  statusValue: {
    width: 60,
    height: 14,
    borderRadius: 6,
  },
});

export default ActiveCodesSkeleton;
