import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const StatisticsSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={18}>
      <View style={styles.container}>

        <View style={styles.heading} />

        <View style={styles.grid}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.headerRow}>
                <View style={styles.icon} />
                <View style={styles.title} />
              </View>
              <View style={styles.value} />
              <View style={styles.subText} />
            </View>
          ))}
        </View>

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.scale(16),
    paddingTop: Metrics.verticalScale(10),
  },

  heading: {
    width: 160,
    height: 26,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(47),
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    borderRadius: 28,
    padding: 20,
    marginBottom: Metrics.verticalScale(16),
    backgroundColor: '#fff',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(18),
  },

  icon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 6,
  },

  title: {
    width: 80,
    height: 13,
    borderRadius: 6,
  },

  value: {
    width: 90,
    height: 20,
    borderRadius: 8,
  },

  subText: {
    width: 70,
    height: 11,
    borderRadius: 6,
    marginTop: 2,
  },
});

export default StatisticsSkeleton;
