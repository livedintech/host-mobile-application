import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const MessageCategoriesSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.container}>
        <View style={styles.titleLine} />
        <View style={styles.descLine} />
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.categoryName} />
              <View style={styles.editIcon} />
            </View>
            <View style={styles.bottomRow}>
              <View style={styles.statsContainer}>
                <View style={styles.confidenceLine} />
                <View style={styles.percentageLine} />
              </View>
              <View style={styles.switch} />
            </View>
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
    height: 30,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(12),
  },
  descLine: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(24),
  },
  card: {
    padding: 16,
    borderRadius: 24,
    marginBottom: Metrics.verticalScale(14),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(10),
  },
  categoryName: {
    width: '55%',
    height: 17,
    borderRadius: 6,
  },
  editIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statsContainer: {
    flex: 1,
  },
  confidenceLine: {
    width: '70%',
    height: 13,
    borderRadius: 6,
  },
  percentageLine: {
    width: '50%',
    height: 13,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(6),
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
  },
});

export default MessageCategoriesSkeleton;
