import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const SelectPaymentSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <View style={styles.container}>
        <View style={styles.headerBar} />

        <View style={styles.banner} />

        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.icon} />
            <View style={styles.label} />
          </View>
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
    width: '60%',
    height: 28,
    borderRadius: 8,
    marginBottom: Metrics.verticalScale(30),
  },

  banner: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    marginBottom: Metrics.verticalScale(30),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(20),
  },

  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 14,
  },

  label: {
    width: '70%',
    height: 16,
    borderRadius: 6,
  },

  button: {
    height: 56,
    borderRadius: 16,
    marginTop: Metrics.verticalScale(30),
  },
});

export default SelectPaymentSkeleton;
