import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_PADDING = 16;
const PANEL_PADDING = Metrics.scale(20);

const CreateListingStepOneLocationSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* ── Map ───────────────────────────────────────────────── */}
      <SkeletonPlaceholder borderRadius={0}>
        <View style={styles.map} />
      </SkeletonPlaceholder>

      {/* ── Fixed Center Pin ─────────────────────────────────── */}
      <View style={styles.markerFixed}>
        <SkeletonPlaceholder borderRadius={22.5} backgroundColor="#d7dee0" highlightColor="#ffffff">
          <View style={styles.markerDot} />
        </SkeletonPlaceholder>
      </View>

      {/* ── Search Bar (top) ─────────────────────────────────── */}
      <View style={styles.header}>
        <SkeletonPlaceholder borderRadius={28} backgroundColor="#d7dee0" highlightColor="#ffffff">
          <View style={styles.searchBar} />
        </SkeletonPlaceholder>
      </View>

      {/* ── Footer (bottom) ──────────────────────────────────── */}
      <View style={styles.footer}>
        <SkeletonPlaceholder borderRadius={24} backgroundColor="#d7dee0" highlightColor="#ffffff">
          <View style={styles.locateMeBtn} />
        </SkeletonPlaceholder>

        <View style={styles.footerBtnPanel}>
          <SkeletonPlaceholder borderRadius={16} backgroundColor="#c9cdce" highlightColor="#eef1f1">
            <View>
              <View style={[styles.button, { marginBottom: 12 }]} />
              <View style={styles.button} />
            </View>
          </SkeletonPlaceholder>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -22.5,
    marginTop: -45,
  },

  markerDot: {
    width: 45,
    height: 45,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: HEADER_PADDING,
    paddingTop: HEADER_PADDING,
  },

  searchBar: {
    width: SCREEN_WIDTH - HEADER_PADDING * 2,
    height: 52,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  locateMeBtn: {
    width: 48,
    height: 48,
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 25,
  },

  footerBtnPanel: {
    backgroundColor: '#e2e5e5',
    paddingHorizontal: PANEL_PADDING,
    paddingTop: Metrics.verticalScale(36),
    paddingBottom: Metrics.verticalScale(18),
  },

  button: {
    width: SCREEN_WIDTH - PANEL_PADDING * 2,
    height: 56,
  },
});

export default CreateListingStepOneLocationSkeleton;
