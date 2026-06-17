import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ReviewManagementSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.container}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.guestName} />

            <View style={styles.detailsContainer}>
              <View style={styles.listingName} />
              <View style={styles.bookingLabel} />
              <View style={styles.bookingDates} />
            </View>

            <View style={styles.sectionMargin}>
              <View style={styles.rowAlignCenter}>
                <View style={styles.iconBox} />
                <View style={styles.sectionLabel} />
              </View>

              <View style={styles.progressWrapper}>
                <View style={styles.track} />
                <View style={styles.scoreValue} />
              </View>

              <View style={styles.buttonRow}>
                <View style={styles.flex1Button} />
                <View style={styles.primaryButton} />
              </View>
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
    paddingTop: Metrics.verticalScale(20),
  },

  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: Metrics.verticalScale(15),
  },

  guestName: {
    width: '50%',
    height: 18,
    borderRadius: 8,
    marginBottom: Metrics.verticalScale(27),
  },

  detailsContainer: {
    marginBottom: Metrics.verticalScale(15),
  },

  listingName: {
    width: '60%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(24),
  },

  bookingLabel: {
    width: 100,
    height: 14,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(12),
    marginBottom: Metrics.verticalScale(6),
  },

  bookingDates: {
    width: '70%',
    height: 13,
    borderRadius: 6,
  },

  sectionMargin: {
    marginTop: Metrics.verticalScale(15),
  },

  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },

  sectionLabel: {
    width: 140,
    height: 14,
    borderRadius: 6,
    marginLeft: 10,
  },

  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.verticalScale(10),
  },

  track: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },

  scoreValue: {
    width: 24,
    height: 14,
    borderRadius: 6,
    marginLeft: 10,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrics.verticalScale(15),
  },

  flex1Button: {
    flex: 1,
    height: 45,
    borderRadius: 25,
  },

  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 25,
    marginLeft: 10,
  },
});

export default ReviewManagementSkeleton;
