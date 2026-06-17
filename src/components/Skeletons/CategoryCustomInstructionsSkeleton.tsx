import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const CategoryCustomInstructionsSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <View style={styles.container}>
        <View style={styles.titleLine} />
        <View style={styles.descLineLong} />
        <View style={styles.descLineShort} />

        <View style={styles.addMoreButton} />

        {[1, 2].map((_, index) => (
          <View key={index} style={styles.sectionContainer}>
            <View style={styles.fieldLabel} />
            <View style={styles.textarea} />

            <View style={[styles.fieldLabel, { marginTop: Metrics.verticalScale(10) }]} />
            <View style={styles.dropdown} />

            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <View style={styles.checkboxLabel} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.scale(24),
    paddingTop: Metrics.verticalScale(50),
  },
  titleLine: {
    width: '70%',
    height: 26,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 12,
  },
  descLineLong: {
    width: '100%',
    height: 14,
    borderRadius: 6,
    marginTop: 6,
  },
  descLineShort: {
    width: '60%',
    height: 14,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: Metrics.verticalScale(20),
  },
  addMoreButton: {
    width: 110,
    height: 36,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginBottom: Metrics.verticalScale(15),
  },
  sectionContainer: {
    marginBottom: Metrics.verticalScale(20),
  },
  fieldLabel: {
    width: 130,
    height: 14,
    borderRadius: 6,
    marginBottom: 8,
  },
  textarea: {
    width: '100%',
    height: Metrics.verticalScale(120),
    borderRadius: 12,
  },
  dropdown: {
    width: '100%',
    height: Metrics.verticalScale(54),
    borderRadius: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.verticalScale(15),
    padding: 12,
    borderRadius: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  checkboxLabel: {
    width: 150,
    height: 14,
    borderRadius: 6,
    marginLeft: 10,
  },
});

export default CategoryCustomInstructionsSkeleton;
