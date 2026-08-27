import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ChecklistSectionsSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={15}>
      <View style={styles.container}>
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
    paddingHorizontal: 20,
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

export default ChecklistSectionsSkeleton;
