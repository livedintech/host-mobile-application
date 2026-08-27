import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const EditTaskSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={15}>
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={styles.headerTitle} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.label} />
          <View style={styles.descriptionBlock} />
          <View style={styles.label} />
          <View style={styles.valueLine} />
          <View style={styles.dropdownLabel} />
          <View style={styles.dropdown} />
        </View>

        <View style={styles.checklistTitleRow}>
          <View style={styles.checklistTitle} />
        </View>

        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.row}>
                <View style={styles.bedroomIcon} />
                <View style={styles.sectionName} />
              </View>
              <View style={styles.arrowCircle} />
            </View>
          </View>
        ))}

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(25),
  },

  headerTitle: {
    width: '60%',
    height: 26,
    borderRadius: 8,
  },

  infoSection: {
    marginBottom: Metrics.verticalScale(25),
  },

  label: {
    width: 130,
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(8),
  },

  descriptionBlock: {
    width: '100%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(28),
  },

  valueLine: {
    width: '70%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(28),
  },

  dropdownLabel: {
    width: 150,
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(10),
  },

  dropdown: {
    width: '100%',
    height: 50,
    borderRadius: 12,
  },

  checklistTitleRow: {
    alignItems: 'center',
    marginTop: Metrics.verticalScale(20),
    marginBottom: Metrics.verticalScale(20),
  },

  checklistTitle: {
    width: 200,
    height: 26,
    borderRadius: 8,
  },

  sectionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 18,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bedroomIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },

  sectionName: {
    width: 180,
    height: 18,
    borderRadius: 6,
  },

  arrowCircle: {
    width: 35,
    height: 35,
    borderRadius: 35,
  },
});

export default EditTaskSkeleton;
