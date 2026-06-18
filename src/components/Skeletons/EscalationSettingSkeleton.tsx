import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const EscalationSettingSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>
        <View style={styles.titleLine} />
        <View style={styles.descLine} />

        <View style={styles.card}>
          <View style={styles.cardTitle} />
          <View style={styles.cardDesc} />
          <View style={styles.graph} />
        </View>

        <View style={styles.inputLabel} />
        <View style={styles.input} />

        <View style={styles.switchCard}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel} />
            <View style={styles.switch} />
          </View>
          <View style={styles.cardDesc} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitle} />
          <View style={styles.cardDesc} />
          <View style={styles.graph} />
        </View>

        <View style={styles.inputLabel} />
        <View style={styles.input} />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrics.verticalScale(20),
  },
  titleLine: {
    width: '60%',
    height: 26,
    borderRadius: 10,
    marginBottom: Metrics.verticalScale(10),
  },
  descLine: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(24),
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: Metrics.verticalScale(24),
  },
  cardTitle: {
    width: '50%',
    height: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  cardDesc: {
    width: '90%',
    height: 13,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(16),
  },
  graph: {
    width: '100%',
    height: 80,
    borderRadius: 12,
  },
  inputLabel: {
    width: '70%',
    height: 14,
    borderRadius: 6,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    marginBottom: Metrics.verticalScale(24),
  },
  switchCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: Metrics.verticalScale(24),
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    width: '50%',
    height: 15,
    borderRadius: 6,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
  },
});

export default EscalationSettingSkeleton;
