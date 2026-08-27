import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const UserManagementSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.container}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <View style={styles.nameLine} />
                <View style={styles.roleLine} />
              </View>
              <View style={styles.actionRow}>
                <View style={styles.actionButton} />
                <View style={styles.actionButton} />
              </View>
            </View>
            <View style={styles.listingSection}>
              <View style={styles.label} />
              <View style={styles.value} />
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
  card: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  nameLine: {
    width: 130,
    height: 18,
    borderRadius: 6,
    marginBottom: 8,
  },
  roleLine: {
    width: 90,
    height: 12,
    borderRadius: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  listingSection: {
    marginTop: 4,
  },
  label: {
    width: 110,
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
  },
  value: {
    width: '80%',
    height: 12,
    borderRadius: 6,
  },
});

export default UserManagementSkeleton;
