import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ChatSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitle} />
          <View style={styles.hamburgerBtn} />
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox} />
          <View style={styles.filterBtn} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <View style={styles.tab} />
          <View style={styles.tab} />
          <View style={styles.tab} />
          <View style={styles.tab} />
        </View>

        {/* Chat Rows */}
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <View key={index} style={styles.chatRow}>
            <View style={styles.avatar} />
            <View style={styles.chatInfo}>
              <View style={styles.infoTop}>
                <View style={styles.nameLine} />
                <View style={styles.dateLine} />
              </View>
              <View style={styles.previewLine} />
            </View>
          </View>
        ))}

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrics.verticalScale(16),
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.scale(22),
    marginBottom: Metrics.verticalScale(30),
  },
  headerTitle: {
    width: '50%',
    height: 30,
    borderRadius: 10,
  },
  hamburgerBtn: {
    width: 22,
    height: 18,
    borderRadius: 4,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(22),
    marginBottom: Metrics.verticalScale(30),
    gap: 10,
  },
  searchBox: {
    flex: 1,
    height: Metrics.verticalScale(50),
    borderRadius: Metrics.verticalScale(25),
  },
  filterBtn: {
    width: Metrics.verticalScale(50),
    height: Metrics.verticalScale(50),
    borderRadius: Metrics.verticalScale(25),
  },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: Metrics.scale(22),
    gap: 8,
    marginBottom: Metrics.verticalScale(37),
  },
  tab: {
    width: 70,
    height: Metrics.verticalScale(40),
    borderRadius: Metrics.verticalScale(20),
  },

  chatRow: {
    flexDirection: 'row',
    paddingHorizontal: Metrics.scale(22),
    paddingVertical: Metrics.verticalScale(16),
    alignItems: 'center',
  },
  avatar: {
    width: Metrics.images.large,
    height: Metrics.images.large,
    borderRadius: Metrics.images.large / 2,
  },
  chatInfo: {
    flex: 1,
    marginLeft: Metrics.scale(14),
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(8),
  },
  nameLine: {
    width: '50%',
    height: 14,
    borderRadius: 6,
  },
  dateLine: {
    width: 50,
    height: 12,
    borderRadius: 6,
  },
  previewLine: {
    width: '80%',
    height: 13,
    borderRadius: 6,
  },
});

export default ChatSkeleton;
