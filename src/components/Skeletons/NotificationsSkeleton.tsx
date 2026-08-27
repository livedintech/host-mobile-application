import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const NotificationsSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={28}>
      <View style={styles.container}>
        <View style={styles.titleLine} />
        {[1, 2, 3, 4, 5].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconBox} />
            <View style={styles.contentBox}>
              <View style={styles.titleRow}>
                <View style={styles.cardTitle} />
                <View style={styles.unreadDot} />
              </View>
              <View style={styles.messageLine} />
              <View style={styles.timeLine} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrics.verticalScale(4),
  },
  titleLine: {
    width: '60%',
    height: 30,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(20),
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  contentBox: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    width: '60%',
    height: 16,
    borderRadius: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  messageLine: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(6),
  },
  timeLine: {
    width: 50,
    height: 12,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(8),
    alignSelf: 'flex-end',
  },
});

export default NotificationsSkeleton;
