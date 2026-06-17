import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const HomeSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>
        <View style={styles.greetingLine} />

        {[1, 2].map((_, sectionIndex) => (
          <View key={sectionIndex} style={styles.sectionCard}>
            <View style={styles.sectionTitle} />
            {[1, 2, 3].map((__, rowIndex) => (
              <View key={rowIndex} style={styles.listItem}>
                <View style={styles.listItemIcon} />
                <View style={styles.listItemContent}>
                  <View style={styles.itemTitle} />
                  <View style={styles.itemSubtitle} />
                </View>
                <View style={styles.chevron} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrics.verticalScale(10),
  },
  greetingLine: {
    width: '80%',
    height: 24,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(24),
  },
  sectionCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: Metrics.verticalScale(20),
  },
  sectionTitle: {
    width: '50%',
    height: 18,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(15),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.verticalScale(10),
  },
  listItemIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    width: '70%',
    height: 14,
    borderRadius: 6,
  },
  itemSubtitle: {
    width: '50%',
    height: 12,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(6),
  },
  chevron: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
});

export default HomeSkeleton;
