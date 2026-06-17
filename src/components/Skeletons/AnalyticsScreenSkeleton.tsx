import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

export const AnalyticsKPISkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={15}>
      <View style={styles.kpiGrid}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.kpiCard}>
            <View style={styles.kpiHeaderRow}>
              <View style={styles.kpiIcon} />
              <View style={styles.kpiLabel} />
            </View>
            <View style={styles.kpiValue} />
            <View style={styles.kpiSubText} />
            <View style={styles.kpiBadge} />
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export const AnalyticsChartSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={18}>
      <View style={styles.chartContainer}>
        <View style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <View>
              <View style={styles.chartTitle} />
              <View style={styles.chartSubTitle} />
            </View>
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

export const AnalyticsPerformanceSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={20}>
      <View>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.listingContainer}>
            <View style={styles.listingTopRow}>
              <View style={styles.unitImage} />
              <View style={styles.listingInfo}>
                <View style={styles.listingTitle} />
                <View style={styles.statsGrid}>
                  <View style={styles.statItem} />
                  <View style={styles.statItem} />
                  <View style={styles.statItem} />
                </View>
              </View>
            </View>

            <View style={styles.listingBottomRow}>
              <View style={styles.statusTag} />
              <View style={styles.trendValue} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  /* KPI Grid */
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },

  kpiCard: {
    width: '48%',
    padding: 12,
    backgroundColor: '#fff',
    height: 110,
    borderRadius: 15,
    marginBottom: 12,
  },

  kpiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(6),
  },

  kpiIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 5,
  },

  kpiLabel: {
    width: 60,
    height: 11,
    borderRadius: 6,
  },

  kpiValue: {
    width: 70,
    height: 18,
    borderRadius: 8,
    marginTop: 4,
  },

  kpiSubText: {
    width: 80,
    height: 10,
    borderRadius: 6,
    marginTop: 6,
  },

  kpiBadge: {
    width: 50,
    height: 18,
    borderRadius: 12,
    position: 'absolute',
    bottom: 12,
    right: 12,
  },

  /* Chart Section */
  chartContainer: {
    paddingHorizontal: 20,
  },

  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },

  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(20),
  },

  chartTitle: {
    width: 150,
    height: 18,
    borderRadius: 8,
  },

  chartSubTitle: {
    width: 100,
    height: 13,
    borderRadius: 6,
    marginTop: 6,
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

  /* Listing Performance */
  listingContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
  },

  listingTopRow: {
    flexDirection: 'row',
  },

  unitImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },

  listingInfo: {
    flex: 1,
    marginLeft: 12,
  },

  listingTitle: {
    width: '60%',
    height: 16,
    borderRadius: 8,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrics.verticalScale(10),
  },

  statItem: {
    width: 40,
    height: 22,
    borderRadius: 6,
  },

  listingBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },

  statusTag: {
    width: 90,
    height: 22,
    borderRadius: 50,
  },

  trendValue: {
    width: 110,
    height: 14,
    borderRadius: 6,
  },
});
