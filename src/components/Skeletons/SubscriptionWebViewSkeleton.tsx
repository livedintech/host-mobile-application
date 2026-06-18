import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const SubscriptionWebViewSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <View style={styles.container}>
        <View style={styles.headerBar} />

        <View style={styles.banner} />

        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.line} />
        ))}

        <View style={styles.button} />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 50,
  },

  headerBar: {
    width: '55%',
    height: 26,
    borderRadius: 8,
    marginBottom: Metrics.verticalScale(30),
  },

  banner: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: Metrics.verticalScale(30),
  },

  line: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(14),
  },

  button: {
    height: 56,
    borderRadius: 16,
    marginTop: Metrics.verticalScale(30),
  },
});

export default SubscriptionWebViewSkeleton;
