import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const PaymentMethodListSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={17}>
      <View style={styles.container}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardLogo} />

            <View style={styles.cardInfo}>
              <View style={styles.cardLabel} />
              <View style={styles.expiryLabel} />
            </View>

            <View style={styles.cardActions}>
              <View style={styles.iconRow}>
                <View style={styles.iconBtn} />
                <View style={styles.iconBtn} />
              </View>
              <View style={styles.badge} />
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
    paddingTop: Metrics.verticalScale(24),
  },

  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#fff',
    marginBottom: 14,
    borderRadius: 17,
    padding: 15,
  },

  cardLogo: {
    width: 46,
    height: 32,
    borderRadius: 6,
    marginRight: 14,
    alignSelf: 'center',
  },

  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  cardLabel: {
    width: '60%',
    height: 15,
    borderRadius: 6,
  },

  expiryLabel: {
    width: '40%',
    height: 12,
    borderRadius: 6,
    marginTop: Metrics.verticalScale(8),
  },

  cardActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    width: 19,
    height: 19,
    borderRadius: 4,
    marginLeft: 6,
  },

  badge: {
    width: 70,
    height: 22,
    borderRadius: 8,
    marginTop: Metrics.verticalScale(10),
  },
});

export default PaymentMethodListSkeleton;
