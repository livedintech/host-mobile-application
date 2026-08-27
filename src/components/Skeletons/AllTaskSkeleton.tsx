import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const AllTaskSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={28}>
      <View style={styles.container}>

        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.taskCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleBlock}>
                <View style={styles.typeLabel} />
                <View style={styles.locationLabel} />
              </View>
              <View style={styles.editIcon} />
            </View>

            <View style={styles.infoRow}>
              <View style={styles.smallIcon} />
              <View style={styles.assignedLabel} />
            </View>
            <View style={styles.infoRow}>
              <View style={styles.smallIcon} />
              <View style={styles.dateLabel} />
            </View>
          </View>
        ))}

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: Metrics.verticalScale(20),
  },

  taskCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 28,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  titleBlock: {
    flex: 1,
    marginBottom: 20,
  },

  typeLabel: {
    width: 140,
    height: 18,
    borderRadius: 6,
    marginBottom: 16,
  },

  locationLabel: {
    width: '80%',
    height: 13,
    borderRadius: 6,
  },

  editIcon: {
    width: 44,
    height: 44,
    borderRadius: 18,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  smallIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 10,
  },

  assignedLabel: {
    width: 160,
    height: 13,
    borderRadius: 6,
  },

  dateLabel: {
    width: 130,
    height: 13,
    borderRadius: 6,
  },
});

export default AllTaskSkeleton;
