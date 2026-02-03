import React from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View
} from 'react-native';
import { vs } from 'react-native-size-matters';

import PaymentBreakdown from '@/components/molecules/PaymentBreakDown/PaymentBreakDown';

const PaymentBreakdownScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Container to maintain the Figma's clean white aesthetic */}
        <View style={styles.contentWrapper}>
          <PaymentBreakdown />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingVertical: vs(10),
  },
  contentWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
});

export default PaymentBreakdownScreen;