import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const PropertyDetailSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.container}>
        <View style={styles.exportPill} />
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardTitle} />
            <View style={styles.cardSubtitle} />
            <View style={styles.cardSubtitleShort} />
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
  exportPill: {
    width: 140,
    height: 40,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(20),
    alignSelf: 'flex-end',
  },
  card: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
  },
  cardTitle: {
    width: '50%',
    height: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  cardSubtitle: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginBottom: 6,
  },
  cardSubtitleShort: {
    width: '60%',
    height: 14,
    borderRadius: 6,
  },
});

export default PropertyDetailSkeleton;
