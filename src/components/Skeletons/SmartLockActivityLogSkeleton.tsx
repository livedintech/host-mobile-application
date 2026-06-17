import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const SmartLockActivityLogSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={28}>
      <View style={styles.container}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.titleLine} />
            <View style={styles.actionLine} />
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.scale(25),
  },
  card: {
    width: '100%',
    borderRadius: 28,
    padding: Metrics.scale(16),
    marginBottom: Metrics.verticalScale(15),
  },
  titleLine: {
    width: '55%',
    height: 18,
    borderRadius: 8,
  },
  actionLine: {
    width: '80%',
    height: 14,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(8),
  },
});

export default SmartLockActivityLogSkeleton;
