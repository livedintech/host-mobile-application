import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const AssignChatSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.container}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.textGroup}>
              <View style={styles.nameLine} />
              <View style={styles.roleLine} />
            </View>
            <View style={styles.checkCircle} />
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Metrics.verticalScale(10),
  },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
  },

  textGroup: {
    flex: 1,
  },

  nameLine: {
    width: '55%',
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },

  roleLine: {
    width: '35%',
    height: 13,
    borderRadius: 6,
  },

  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});

export default AssignChatSkeleton;
