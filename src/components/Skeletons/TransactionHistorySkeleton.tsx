import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const TransactionHistorySkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={24}>
      <View style={styles.container}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.dateLine} />
            <View style={styles.transactionCard}>
              <View style={styles.rowBetween}>
                <View style={styles.cardLogo} />
                <View style={styles.cardNumber} />
              </View>
              <View style={styles.amountLine} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
  },
  section: {
    marginBottom: 25,
  },
  dateLine: {
    width: 90,
    height: 14,
    borderRadius: 6,
    marginBottom: 10,
  },
  transactionCard: {
    padding: 20,
    borderRadius: 24,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogo: {
    width: 35,
    height: 22,
    borderRadius: 4,
  },
  cardNumber: {
    width: 100,
    height: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  amountLine: {
    width: 80,
    height: 22,
    borderRadius: 6,
    marginTop: 10,
  },
});

export default TransactionHistorySkeleton;
