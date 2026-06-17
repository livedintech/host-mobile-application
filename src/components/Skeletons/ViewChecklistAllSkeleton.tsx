import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ViewChecklistAllSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>
        <View style={styles.titleLine} />
        <View style={styles.descLine} />
        <View style={styles.addSectionBtn} />
        {[1, 2, 3, 4, 5].map((_, index) => (
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
  container: {
    paddingTop: Metrics.verticalScale(10),
  },
  titleLine: {
    width: '70%',
    height: 28,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(20),
  },
  descLine: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(30),
  },
  addSectionBtn: {
    width: 140,
    height: 32,
    borderRadius: 16,
    marginBottom: Metrics.verticalScale(20),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  label: {
    flex: 1,
    height: 18,
    borderRadius: 6,
    marginLeft: 16,
  },
});

export default ViewChecklistAllSkeleton;
