import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const AIAutoReplySkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={28}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitle} />
          <View style={styles.headerSwitch} />
        </View>
        <View style={styles.descriptionLine} />
        <View style={styles.descriptionLineShort} />

        {/* Cards */}
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>

            <View style={styles.cardHeader}>
              <View style={styles.cardTitle} />
              <View style={styles.actionIcons}>
                <View style={styles.iconCircle} />
                <View style={styles.iconCircle} />
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerLabels}>
                <View style={styles.footerLabel} />
                <View style={styles.footerValue} />
              </View>
              <View style={styles.switchPlaceholder} />
            </View>

          </View>
        ))}

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    width: '60%',
    height: 30,
    borderRadius: 10,
  },
  headerSwitch: {
    marginLeft: 'auto',
    width: 50,
    height: 26,
    borderRadius: 13,
  },
  descriptionLine: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(8),
  },
  descriptionLineShort: {
    width: '40%',
    height: 14,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(8),
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    width: '50%',
    height: 18,
    borderRadius: 6,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLabels: {
    flex: 1,
  },
  footerLabel: {
    width: 100,
    height: 14,
    borderRadius: 6,
    marginBottom: 6,
  },
  footerValue: {
    width: 130,
    height: 13,
    borderRadius: 6,
  },
  switchPlaceholder: {
    width: 44,
    height: 24,
    borderRadius: 12,
  },
});

export default AIAutoReplySkeleton;
