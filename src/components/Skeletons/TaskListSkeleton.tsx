import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const TaskListSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={15}>
      <View style={styles.container}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.taskCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitle} />
              <View style={styles.editIcon} />
            </View>
            <View style={styles.cardContent}>
              {[1, 2, 3, 4, 5].map((__, rowIndex) => (
                <View key={rowIndex} style={styles.infoRow}>
                  <View style={styles.label} />
                  <View style={styles.value} />
                </View>
              ))}
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
  },
  taskCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitle: {
    width: '60%',
    height: 18,
    borderRadius: 6,
  },
  editIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  cardContent: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    width: 90,
    height: 13,
    borderRadius: 6,
  },
  value: {
    width: 110,
    height: 13,
    borderRadius: 6,
  },
});

export default TaskListSkeleton;
