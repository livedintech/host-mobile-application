import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const PropertyTourSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.image} />
            <View style={styles.textContainer}>
              <View style={styles.title} />
              <View style={styles.subtitle} />
            </View>
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
    padding: 14,
    borderRadius: 24,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 16,
  },
  textContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  title: {
    width: '70%',
    height: 16,
    borderRadius: 6,
  },
  subtitle: {
    width: '40%',
    height: 12,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(8),
  },
});

export default PropertyTourSkeleton;
