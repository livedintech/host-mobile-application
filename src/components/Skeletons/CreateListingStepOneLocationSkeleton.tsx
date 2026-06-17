import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const CreateListingStepOneLocationSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>

        <View style={styles.map} />

        <View style={styles.markerFixed} />

        <View style={styles.header}>
          <View style={styles.searchBar} />
        </View>

        <View style={styles.footer}>
          <View style={styles.locateMeBtn} />
          <View style={styles.button} />
          <View style={styles.button} />
        </View>

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -22.5,
    marginTop: -45,
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  searchBar: {
    height: 52,
    borderRadius: 28,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(36),
    paddingBottom: Metrics.verticalScale(18),
  },

  locateMeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 25,
  },

  button: {
    height: 56,
    borderRadius: 16,
    marginBottom: 12,
  },
});

export default CreateListingStepOneLocationSkeleton;
