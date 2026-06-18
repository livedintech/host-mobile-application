import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ViewReviewSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>
        <View style={styles.headerIcon} />

        <View style={styles.title} />

        <View style={styles.textBlock}>
          <View style={styles.label} />
          <View style={styles.line} />
          <View style={[styles.line, { width: '90%' }]} />
          <View style={[styles.line, { width: '60%' }]} />
        </View>

        <View style={styles.textBlock}>
          <View style={styles.label} />
          <View style={styles.line} />
          <View style={[styles.line, { width: '80%' }]} />
        </View>

        <View style={styles.overallRatingWrapper}>
          <View style={styles.barLabelRow}>
            <View style={styles.largeIconBox} />
            <View style={styles.barLabelLarge} />
          </View>
          <View style={styles.progressSection}>
            <View style={styles.largeBarBg} />
            <View style={styles.barValue} />
          </View>
        </View>

        <View style={styles.glassCard}>
          <View style={styles.glassHeader}>
            <View style={styles.glassHeaderLabel} />
            <View style={styles.idIconBox} />
          </View>

          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.barItemContainer}>
              <View style={styles.barLabelRow}>
                <View style={styles.iconBox} />
                <View style={styles.barLabel} />
              </View>
              <View style={styles.progressSection}>
                <View style={styles.barBg} />
                <View style={styles.barValueSmall} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.replyTitle} />
        <View style={styles.replyBox} />
        <View style={styles.charCount} />

        <View style={styles.bottomButtons}>
          <View style={styles.button} />
          <View style={styles.button} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },

  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: Metrics.verticalScale(20),
  },

  title: {
    width: '70%',
    height: 28,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(30),
  },

  textBlock: {
    marginBottom: Metrics.verticalScale(20),
  },

  label: {
    width: 90,
    height: 16,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(10),
  },

  line: {
    width: '100%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(8),
  },

  overallRatingWrapper: {
    marginBottom: Metrics.verticalScale(30),
    padding: 10,
    borderRadius: 15,
  },

  barLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(8),
  },

  largeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },

  barLabelLarge: {
    width: 140,
    height: 18,
    borderRadius: 8,
    marginLeft: 12,
  },

  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 46,
  },

  largeBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },

  barValue: {
    width: 30,
    height: 16,
    borderRadius: 6,
    marginLeft: 12,
  },

  glassCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: Metrics.verticalScale(20),
  },

  glassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(25),
  },

  glassHeaderLabel: {
    width: 180,
    height: 18,
    borderRadius: 8,
  },

  idIconBox: {
    width: 41,
    height: 41,
    borderRadius: 10,
  },

  barItemContainer: {
    marginBottom: Metrics.verticalScale(12),
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },

  barLabel: {
    width: 110,
    height: 14,
    borderRadius: 6,
    marginLeft: 12,
  },

  barBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },

  barValueSmall: {
    width: 24,
    height: 12,
    borderRadius: 6,
    marginLeft: 12,
  },

  replyTitle: {
    width: '50%',
    height: 26,
    borderRadius: 10,
    marginTop: Metrics.verticalScale(30),
    marginBottom: Metrics.verticalScale(15),
  },

  replyBox: {
    width: '100%',
    height: 100,
    borderRadius: 15,
  },

  charCount: {
    width: 110,
    height: 12,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(8),
  },

  bottomButtons: {
    marginTop: Metrics.verticalScale(30),
  },

  button: {
    width: '100%',
    height: 52,
    borderRadius: 28,
    marginBottom: Metrics.verticalScale(15),
  },
});

export default ViewReviewSkeleton;
