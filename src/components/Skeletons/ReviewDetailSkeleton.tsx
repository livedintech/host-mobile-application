import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ReviewDetailSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.container}>
        <View style={styles.styleRow}>
          <View style={styles.arrowCircle} />
          <View style={styles.dotsCircle} />
        </View>

        <View style={styles.guestNameRow}>
          <View style={styles.guestName} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitle} />
            <View style={styles.iconCircle} />
          </View>

          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.guestInfoRow}>
              <View style={styles.rowIconContainer} />
              <View style={styles.infoContent}>
                <View style={styles.infoLabel} />
                <View style={styles.infoValue} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <View style={styles.smallLabel} />
              <View style={styles.smallValue} />
              <View style={styles.hSpacer} />
              <View style={styles.smallLabel} />
              <View style={styles.smallValue} />
            </View>
            <View style={styles.vDivider} />
            <View style={styles.gridItem}>
              <View style={styles.smallLabel} />
              <View style={styles.smallValue} />
              <View style={styles.hSpacer} />
              <View style={styles.smallLabel} />
              <View style={styles.smallValue} />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.flexRowTwo}>
                <View style={styles.cardTitle} />
                <View style={styles.iconCircle} />
              </View>
              <View style={styles.propertyName} />
              <View style={styles.propertyAddress} />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitle} />
            <View style={styles.iconCircle} />
          </View>

          <View style={styles.bookingInfoContainer}>
            {[1, 2, 3, 4].map((_, index) => (
              <View key={index} style={styles.bookingRow}>
                <View style={styles.bookingLabel} />
                <View style={styles.bookingValue} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitle} />
            <View style={styles.iconCircle} />
          </View>

          <View style={styles.ratingContent}>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.ratingRow}>
                <View style={styles.ratingIconContainer} />
                <View style={styles.progressContainer}>
                  <View style={styles.ratingLabel} />
                  <View style={styles.barWrapper}>
                    <View style={styles.progressBarBg} />
                    <View style={styles.progressValue} />
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.buttonRow}>
              <View style={styles.halfButton} />
              <View style={styles.halfButton} />
            </View>
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

  styleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Metrics.verticalScale(30),
  },

  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  dotsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  guestNameRow: {
    marginBottom: Metrics.verticalScale(20),
  },

  guestName: {
    width: '60%',
    height: 28,
    borderRadius: 10,
  },

  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: Metrics.verticalScale(15),
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Metrics.verticalScale(12),
  },

  cardTitle: {
    width: 150,
    height: 18,
    borderRadius: 8,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 16,
  },

  guestInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.verticalScale(15),
  },

  rowIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    marginRight: 5,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    width: 110,
    height: 13,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(6),
  },

  infoValue: {
    width: '80%',
    height: 13,
    borderRadius: 6,
  },

  gridRow: {
    flexDirection: 'row',
  },

  gridItem: {
    flex: 1,
  },

  smallLabel: {
    width: 80,
    height: 12,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(6),
  },

  smallValue: {
    width: 100,
    height: 14,
    borderRadius: 6,
  },

  hSpacer: {
    height: Metrics.verticalScale(15),
  },

  vDivider: {
    width: 1,
    marginHorizontal: 15,
  },

  flexRowTwo: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(20),
  },

  propertyName: {
    width: '70%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(8),
  },

  propertyAddress: {
    width: '90%',
    height: 12,
    borderRadius: 6,
  },

  bookingInfoContainer: {
    marginTop: Metrics.verticalScale(5),
  },

  bookingRow: {
    marginBottom: Metrics.verticalScale(15),
  },

  bookingLabel: {
    width: 140,
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(6),
  },

  bookingValue: {
    width: 100,
    height: 13,
    borderRadius: 6,
  },

  ratingContent: {
    marginTop: Metrics.verticalScale(5),
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(20),
  },

  ratingIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },

  progressContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  ratingLabel: {
    width: 120,
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(5),
  },

  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },

  progressValue: {
    width: 24,
    height: 14,
    borderRadius: 6,
    marginLeft: 10,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrics.verticalScale(10),
    gap: 10,
  },

  halfButton: {
    flex: 1,
    height: 48,
    borderRadius: 25,
  },
});

export default ReviewDetailSkeleton;
