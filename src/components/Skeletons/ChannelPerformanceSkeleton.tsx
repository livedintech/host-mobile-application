import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ChannelPerformanceSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={18}>
      <View style={styles.container}>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.titleBlock} />
            <View style={styles.iconGlass} />
          </View>

          <View style={styles.contentRow}>
            <View style={styles.legendWrapper}>
              {[1, 2, 3].map((_, index) => (
                <View key={index} style={styles.legendRow}>
                  <View style={styles.legendIcon} />
                  <View style={styles.legendTextCol}>
                    <View style={styles.legendLabel} />
                    <View style={styles.legendValue} />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.donut} />
          </View>
        </View>

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Metrics.verticalScale(20),
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(25),
  },

  titleBlock: {
    width: 140,
    height: 18,
    borderRadius: 8,
  },

  iconGlass: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  legendWrapper: {
    flex: 1,
    marginRight: 15,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
  },

  legendIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 10,
  },

  legendTextCol: {
    flex: 1,
  },

  legendLabel: {
    width: 70,
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
  },

  legendValue: {
    width: 45,
    height: 13,
    borderRadius: 6,
  },

  donut: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
});

export default ChannelPerformanceSkeleton;
