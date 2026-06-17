import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const THUMB_SIZE = Metrics.scale(46);

export const SubscriptionPriceSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={8}>
      <View>
        <View style={styles.label} />
        <View style={styles.priceRow}>
          <View style={styles.price} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export const SubscriptionPropertiesSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <View>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.propertyRow}>
            <View style={styles.propertyThumb} />
            <View style={styles.propertyInfo}>
              <View style={styles.propertyName} />
              <View style={styles.propertyAddress} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  label: {
    width: 100,
    height: 14,
    borderRadius: 6,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  price: {
    width: 140,
    height: 30,
    borderRadius: 8,
  },

  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  propertyThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 12,
  },

  propertyInfo: {
    marginLeft: 12,
    flex: 1,
  },

  propertyName: {
    width: '70%',
    height: 14,
    borderRadius: 6,
  },

  propertyAddress: {
    width: '50%',
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
});
