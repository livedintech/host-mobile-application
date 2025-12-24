import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { MFCardPaymentView } from 'myfatoorah-reactnative';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useAddCardDetailContainer from './AddCardDetailContainer';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddCardDetailScreen = () => {
  const {
    isSaving,
    cardLoading,
    cardPaymentView,
    getCardViewStyle,
    handlePay,
  } = useAddCardDetailContainer();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        <View style={styles.cardSection}>
          {cardLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.INDIAN_RED} />
              <AppText text="Loading Secure Payment..." mt={10} color={Colors.SUPER_GREY} />
            </View>
          )}

          <MFCardPaymentView
            ref={cardPaymentView}
            paymentStyle={getCardViewStyle()}
            style={[styles.mfCardView, { opacity: cardLoading ? 0 : 1 }]}
          />
        </View>

        <View style={styles.footer}>
          <AppButton
            title={"Pay Now"}
            onPress={handlePay}
            disabled={cardLoading || isSaving}
            loading={cardLoading || isSaving}
          >
          </AppButton>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  innerContainer: { flex: 1, paddingHorizontal: Metrics.scale(20) },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: Metrics.verticalScale(20) },
  backBtn: { padding: Metrics.scale(5) },
  cardSection: { flex: 1, marginTop: Metrics.verticalScale(10) },
  loaderContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  mfCardView: { height: Metrics.verticalScale(400), width: '100%' },
  footer: { paddingVertical: Metrics.verticalScale(20) },
});

export default AddCardDetailScreen;