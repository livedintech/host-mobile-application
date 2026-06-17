import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ChecklistDetailSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>
        <View style={styles.titleLine} />
        <View style={styles.addMoreBtn} />
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <View key={index} style={styles.taskCard}>
            <View style={styles.checkbox} />
            <View style={styles.taskLine} />
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrics.verticalScale(20),
  },
  titleLine: {
    width: '60%',
    height: 28,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(12),
  },
  addMoreBtn: {
    width: 100,
    height: 30,
    borderRadius: 15,
    marginBottom: Metrics.verticalScale(20),
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  checkbox: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  taskLine: {
    flex: 1,
    height: 14,
    borderRadius: 6,
    marginLeft: 10,
  },
});

export default ChecklistDetailSkeleton;
