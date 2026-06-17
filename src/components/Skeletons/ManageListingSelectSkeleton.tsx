import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { s, vs, ms } from 'react-native-size-matters';

const ManageListingSelectSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>
        <View style={styles.titleLine} />
        <View style={styles.titleLineShort} />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderText} />
            <View style={styles.iconCircle} />
          </View>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.itemIcon} />
              <View style={styles.itemLabel} />
            </View>
          ))}
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(24),
    paddingTop: vs(20),
  },
  titleLine: {
    width: '90%',
    height: 28,
    borderRadius: 10,
    marginBottom: vs(10),
  },
  titleLineShort: {
    width: '60%',
    height: 28,
    borderRadius: 10,
    marginBottom: vs(40),
  },
  card: {
    padding: s(20),
    borderRadius: ms(24),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(24),
  },
  cardHeaderText: {
    width: '50%',
    height: 20,
    borderRadius: 8,
  },
  iconCircle: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(12),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(56),
    paddingHorizontal: s(16),
    borderRadius: ms(16),
    marginBottom: vs(12),
  },
  itemIcon: {
    width: s(32),
    height: 24,
    borderRadius: 6,
  },
  itemLabel: {
    width: '50%',
    height: 16,
    borderRadius: 6,
    marginLeft: s(10),
  },
});

export default ManageListingSelectSkeleton;
