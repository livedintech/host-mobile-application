import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const SavedRepliesSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={28}>
      <View style={styles.container}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.titleRow}>
              <View style={styles.cardTitle} />
              <View style={styles.actionIcons}>
                <View style={styles.iconCircle} />
                <View style={styles.iconCircle} />
              </View>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.textDetails}>
                <View style={styles.label} />
                <View style={styles.value} />
              </View>
              <View style={styles.switch} />
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
    padding: 4,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    width: '50%',
    height: 18,
    borderRadius: 6,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textDetails: { flex: 1 },
  label: {
    width: 110,
    height: 14,
    borderRadius: 6,
  },
  value: {
    width: 80,
    height: 13,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(6),
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
  },
});

export default SavedRepliesSkeleton;
