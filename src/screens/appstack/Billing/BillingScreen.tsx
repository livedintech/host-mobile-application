import { useTranslation } from 'react-i18next';
import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useBillingContainer from './BillingContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const BillingScreen = () => {
  const { t } = useTranslation();
  const { goToTransactionHistory, goToSubscriptionHistory,goToPaymentMethod } = useBillingContainer();

  const BillingOption = ({ title, onPress }: { title: string, onPress?: () => void }) => (
    <GradientBorder borderRadius={20} style={styles.cardWrapper}>
      <View style={styles.cardInner}>
        <AppText text={title} fontSize={18} type="Medium" color={Colors.PINE_FOREST} />
        <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
          <Pressable style={styles.arrowCircleInner} onPress={onPress}>
            <Svgicons path='ArrowUpRightIcon' size={30}/>
          </Pressable>
        </GradientBorder>
      </View>
    </GradientBorder>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Billing Label with Icon */}
        <View style={styles.billingHeader}>
          <AppText text={t('app.billing.title')} fontSize={32} type="Bold" color={Colors.PINE_FOREST} pr={10}/>
          <Svgicons path='cardIcon' size={70}/>
        </View>

        {/* Options List */}
        <View style={styles.listContainer}>
          <BillingOption title={t('app.billing.payment_method')} onPress={goToPaymentMethod}/>
          <BillingOption title={t('app.billing.subscription')} onPress={goToSubscriptionHistory}/>
          <BillingOption title={t('app.billing.transaction_history')} onPress={goToTransactionHistory}/>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 100 },
  billingHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 50, marginBottom: 30 },

  cardWrapper: { marginBottom: 15 },
  cardInner: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: Colors.WHITE,
    height: 75, 
    borderRadius: 19,
    paddingHorizontal: 20,
  },

  arrowCircleInner: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  listContainer: { marginTop: 10 }
});

export default BillingScreen;
