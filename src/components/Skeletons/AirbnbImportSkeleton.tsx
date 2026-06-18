import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const AirbnbImportSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.container}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleText} />
              <View style={styles.iconBox} />
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={styles.labelText} />
                <View style={styles.valueText} />
              </View>
              <View style={styles.infoRow}>
                <View style={styles.labelTextLong} />
                <View style={styles.valueText} />
              </View>
            </View>

            <View style={styles.dropdown} />

            <View style={styles.buttonWrapper}>
              <View style={styles.button} />
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
    paddingTop: 10,
  },

  card: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#fff',
    marginBottom: 20,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Metrics.verticalScale(20),
  },

  titleText: {
    width: '60%',
    height: 18,
    borderRadius: 8,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },

  infoSection: {
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Metrics.verticalScale(10),
  },

  labelText: {
    width: 90,
    height: 14,
    borderRadius: 6,
  },

  labelTextLong: {
    width: 110,
    height: 14,
    borderRadius: 6,
  },

  valueText: {
    width: 60,
    height: 14,
    borderRadius: 6,
  },

  dropdown: {
    height: 50,
    borderRadius: 12,
    marginBottom: 15,
  },

  buttonWrapper: {
    width: Metrics.scale(219),
    alignSelf: 'center',
  },

  button: {
    height: 44,
    borderRadius: 16,
  },
});

export default AirbnbImportSkeleton;
