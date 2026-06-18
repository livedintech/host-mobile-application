import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ManageListingSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.cardWrapper}>
            <View style={styles.image} />

            <View style={styles.detailsContainer}>
              <View style={styles.titleRow}>
                <View style={styles.titleText} />
                <View style={styles.editIcon} />
              </View>

              <View style={styles.addressRow}>
                <View style={styles.pinIcon} />
                <View style={styles.addressText} />
              </View>
            </View>
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

  cardWrapper: {
    padding: 12,
    borderRadius: 24,
    marginBottom: 20,
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: Metrics.verticalScale(20),
  },

  detailsContainer: {
    borderRadius: 16,
    paddingHorizontal: Metrics.scale(20),
    paddingVertical: Metrics.verticalScale(18),
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  titleText: {
    width: '70%',
    height: 16,
    borderRadius: 8,
  },

  editIcon: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pinIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },

  addressText: {
    flex: 1,
    height: 12,
    borderRadius: 6,
  },
});

export default ManageListingSkeleton;
