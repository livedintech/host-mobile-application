import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const PhotoUploadTemplateSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <View style={styles.container}>

        <View style={styles.headerRow}>
          <View style={styles.backIcon} />
          <View style={styles.progressCircle} />
        </View>

        <View style={styles.step} />
        <View style={styles.title} />

        <View style={styles.infoSection}>
          <View style={styles.infoLine} />
          <View style={styles.infoLine} />
          <View style={styles.infoLineShort} />
        </View>

        <View style={styles.sectionTitle} />

        <View style={styles.grid}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.photoTile} />
          ))}
        </View>

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 15,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(15),
  },

  backIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  progressCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  step: {
    width: '40%',
    height: 18,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(25),
    marginBottom: Metrics.verticalScale(23),
  },

  title: {
    width: '70%',
    height: 30,
    borderRadius: 8,
  },

  infoSection: {
    marginTop: Metrics.verticalScale(15),
  },

  infoLine: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(8),
  },

  infoLineShort: {
    width: '60%',
    height: 14,
    borderRadius: 6,
  },

  sectionTitle: {
    width: '50%',
    height: 22,
    borderRadius: 8,
    marginTop: Metrics.verticalScale(30),
    marginBottom: Metrics.verticalScale(15),
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  photoTile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: Metrics.verticalScale(10),
  },
});

export default PhotoUploadTemplateSkeleton;
