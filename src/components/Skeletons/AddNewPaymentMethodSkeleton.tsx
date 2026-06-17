import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const AddNewPaymentMethodSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <View style={styles.container}>
        <View style={styles.cardView} />
        <View style={styles.lineWide} />
        <View style={styles.lineNarrow} />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardView: {
    width: '100%',
    height: Metrics.verticalScale(220),
    borderRadius: 12,
  },

  lineWide: {
    width: '70%',
    height: 16,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(20),
  },

  lineNarrow: {
    width: '45%',
    height: 14,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(10),
  },
});

export default AddNewPaymentMethodSkeleton;
