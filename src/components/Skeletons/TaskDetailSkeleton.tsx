import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const TaskDetailSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={18}>
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={styles.iconBtn} />
        </View>

        <View style={styles.pageTitle} />

        <View style={styles.glassCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitle} />
            <View style={styles.editIcon} />
          </View>

          <View style={styles.label} />
          <View style={styles.valueLine} />
          <View style={styles.valueLineShort} />

          <View style={styles.label} />
          <View style={styles.valueLineMedium} />

          <View style={styles.label} />
          <View style={styles.dropdown} />
        </View>

        <View style={styles.glassCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitle} />
            <View style={styles.smallIcon} />
          </View>

          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.timelineRow}>
              <View style={styles.iconCircle} />
              <View>
                <View style={styles.timelineLabel} />
                <View style={styles.timelineValue} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
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
    paddingHorizontal: 25,
    paddingTop: Metrics.verticalScale(10),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  pageTitle: {
    width: '70%',
    height: 30,
    borderRadius: 8,
    marginTop: Metrics.verticalScale(20),
    marginBottom: Metrics.verticalScale(30),
  },

  glassCard: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  cardHeaderTitle: {
    width: 150,
    height: 18,
    borderRadius: 6,
  },

  editIcon: {
    width: 44,
    height: 44,
    borderRadius: 18,
  },

  smallIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },

  label: {
    width: 130,
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(8),
  },

  valueLine: {
    width: '100%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(8),
  },

  valueLineShort: {
    width: '60%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(20),
  },

  valueLineMedium: {
    width: '80%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(20),
  },

  dropdown: {
    width: '100%',
    height: 50,
    borderRadius: 12,
  },

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(16),
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 15,
  },

  timelineLabel: {
    width: 110,
    height: 14,
    borderRadius: 6,
    marginBottom: 6,
  },

  timelineValue: {
    width: 90,
    height: 13,
    borderRadius: 6,
  },

  footer: {
    marginTop: Metrics.verticalScale(20),
  },

  button: {
    height: 50,
    borderRadius: 25,
    marginBottom: 12,
  },
});

export default TaskDetailSkeleton;
