import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const AmenitiesSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.icon} />
            <View style={styles.label} />
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 15,
  },

  icon: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },

  label: {
    width: '60%',
    height: 12,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(8),
  },
});

export default AmenitiesSkeleton;
