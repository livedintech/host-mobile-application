import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const CreateChecklistSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={16}>
      <View style={styles.container}>

        <View style={styles.titleRow}>
          <View style={styles.title} />
        </View>
        <View style={styles.subtitle} />
        <View style={styles.addSectionBtn} />

        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.header}>
              <View style={styles.sectionName} />
              <View style={styles.chevronCircle} />
            </View>
          </View>
        ))}

      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Metrics.verticalScale(10),
  },

  titleRow: {
    marginBottom: Metrics.verticalScale(10),
  },

  title: {
    width: 220,
    height: 26,
    borderRadius: 8,
  },

  subtitle: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginBottom: Metrics.verticalScale(20),
  },

  addSectionBtn: {
    alignSelf: 'flex-end',
    width: 110,
    height: 32,
    borderRadius: 20,
    marginBottom: Metrics.verticalScale(20),
  },

  card: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionName: {
    width: 180,
    height: 18,
    borderRadius: 6,
  },

  chevronCircle: {
    width: 35,
    height: 35,
    borderRadius: 35,
  },
});

export default CreateChecklistSkeleton;
