import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MFCardPaymentView, MFGooglePayButton, GooglePayButtonConstants } from 'myfatoorah-reactnative';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useAddNewPaymentMethodContainer from './AddNewPaymentMethodContainer';
import { useTranslation } from 'react-i18next';

const AddNewPaymentMethodScreen = () => {
  const { t } = useTranslation();

  const {
    isLoading,
    isProcessingPayment,
    isSaving,
    cardLoading,
    paymentMethodName,
    paymentMethodType, 
    googlePayRef,     
    sessionId,    
    isCardMethod,
    cardPaymentView,
    getCardViewStyle,
    handlePay,
    retrySession,
  } = useAddNewPaymentMethodContainer();

  // Loading Overlay Component
  const LoadingOverlay = () => {
    let loadingText = t('auth.add_payment.loading_payment', { name: paymentMethodName || 'Payment' });

    if (isProcessingPayment) {
      loadingText = t('auth.add_payment.processing_payment')
    } else if (isSaving) {
      loadingText = t('auth.add_payment.saving_payment')
    }

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.INDIAN_RED} />
        <AppText
          text={loadingText}
          mt={10}
          color={Colors.SUPER_GREY}
          textAlign="center"
        />
      </View>
    );
  };

  // Wallet Payment Instructions (for STC Pay, Apple Pay, Google Pay)
  const WalletInstructions = () => (
    <View style={styles.walletContainer}>
      <View style={styles.walletIcon}>
        <AppText text="💳" fontSize={48} />
      </View>

      <AppText
        text={t('auth.add_payment.pay_with', { name: paymentMethodName })}
        fontSize={24}
        type="Bold"
        textAlign="center"
        color={Colors.BLACK}
        mt={20}
      />

      <AppText
        text={t('auth.add_payment.redirect_text')}
        fontSize={14}
        textAlign="center"
        color={Colors.SUPER_GREY}
        mt={10}
      />

      <View style={styles.instructionsList}>
        <View style={styles.instructionItem}>
          <AppText text="1️⃣" fontSize={20} />
          <AppText
            text={t('auth.add_payment.step_1', { name: paymentMethodName })}
            fontSize={14}
            color={Colors.BLACK}
            ml={10}
          />
        </View>

        <View style={styles.instructionItem}>
          <AppText text="2️⃣" fontSize={20} />
          <AppText
            text={t('auth.add_payment.step_2')}
            fontSize={14}
            color={Colors.BLACK}
            ml={10}
          />
        </View>

        <View style={styles.instructionItem}>
          <AppText text="3️⃣" fontSize={20} />
          <AppText
            text={t('auth.add_payment.step_3')}
            fontSize={14}
            color={Colors.BLACK}
            ml={10}
          />
        </View>

        <View style={styles.instructionItem}>
          <AppText text="4️⃣" fontSize={20} />
          <AppText
            text={t('auth.add_payment.step_4')}
            fontSize={14}
            color={Colors.BLACK}
            ml={10}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <View style={styles.innerContainer}>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <AppText
              text={`${paymentMethodName || 'Payment'}`}
              fontSize={24}
              type="Bold"
              color={Colors.BLACK}
            />
            <AppText
              text={
                isCardMethod
                  ? t('auth.add_payment.subtitle_card')
                  : t('auth.add_payment.subtitle_wallet')
              }
              fontSize={14}
              color={Colors.SUPER_GREY}
              mt={5}
            />
          </View>

          {/* Payment Content Section */}
          <View style={styles.cardSection}>

            {/* Show loading overlay when processing */}
            {cardLoading && <LoadingOverlay />}

            {/* Google Pay Button */}
            {paymentMethodType === 'google_pay' && !isLoading && (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                {sessionId ? (
                  <MFGooglePayButton
                    ref={googlePayRef}
                    style={{ width: '100%', height: 55 }}
                    theme={GooglePayButtonConstants.Themes.Dark}
                    type={GooglePayButtonConstants.Types.Buy}
                    radius={12}
                  />
                ) : (
                  <ActivityIndicator color={Colors.INDIAN_RED} />
                )}
              </View>
            )}

            {/* CARD METHOD: Show MyFatoorah Card Form */}
            {isCardMethod && paymentMethodType !== 'google_pay' && (
              <>
                <MFCardPaymentView
                  ref={cardPaymentView}
                  paymentStyle={getCardViewStyle()}
                  style={[
                    styles.mfCardView,
                    { opacity: isLoading ? 0 : 1 }
                  ]}
                />

                {!isLoading && !cardPaymentView.current && (
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={retrySession}
                  >
                    <AppText
                      text={t('auth.add_payment.retry_loading')}
                      color={Colors.INDIAN_RED}
                      type="Bold"
                      fontSize={16}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* WALLET METHOD: Show Instructions (STC Pay, etc.) */}
            {!isCardMethod && paymentMethodType !== 'google_pay' && !isLoading && (
              <WalletInstructions />
            )}
          </View>

          {/* Security Info Badge */}
          <View style={styles.securityInfo}>
            <View style={styles.securityBadge}>
              <AppText
                text={t('auth.add_payment.security_text')}
                fontSize={12}
                color={Colors.SUPER_GREY}
                textAlign="center"
              />
            </View>
          </View>

          {/* Footer with Pay Button */}
          <View style={styles.footer}>
            {/* Hide main button for Google Pay as it has its own button */}
            {paymentMethodType !== 'google_pay' && (
              <AppButton
                title={
                  isProcessingPayment
                    ? t('auth.add_payment.processing_btn')
                    : isSaving
                      ? t('auth.add_payment.saving_btn')
                      : !isCardMethod
                        ? t('auth.add_payment.pay_with', { name: paymentMethodName })
                        : t('auth.add_payment.pay_now')
                }
                onPress={handlePay}
                disabled={cardLoading}
                loading={cardLoading}
              />
            )}

            {!cardLoading && isCardMethod && paymentMethodType !== 'google_pay' && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={retrySession}
              >
                <AppText
                  text={t('auth.add_payment.reset_form')}
                  color={Colors.SUPER_GREY}
                  fontSize={12}
                  textAlign="center"
                />
              </TouchableOpacity>
            )}

            <AppText
              text={t('auth.add_payment.agree_terms')}
              fontSize={11}
              color={Colors.SUPER_GREY}
              textAlign="center"
              mt={10}
            />
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  innerContainer: { flex: 1, paddingHorizontal: Metrics.scale(20) },
  headerSection: { paddingTop: Metrics.verticalScale(10), paddingBottom: Metrics.verticalScale(20), borderBottomWidth: 1, borderBottomColor: Colors.SUPER_GREY || '#F0F0F0' },
  cardSection: { flex: 1, marginTop: Metrics.verticalScale(20), position: 'relative' },
  loaderContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: 10, borderRadius: 12 },
  mfCardView: { height: Metrics.verticalScale(400), width: '100%', minHeight: 350 },
  retryButton: { marginTop: Metrics.verticalScale(20), padding: Metrics.scale(15), alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.INDIAN_RED, borderRadius: 12, backgroundColor: Colors.WHITE },
  walletContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: Metrics.verticalScale(40) },
  walletIcon: { width: Metrics.scale(100), height: Metrics.scale(100), borderRadius: 50, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  instructionsList: { marginTop: Metrics.verticalScale(30), width: '100%' },
  instructionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: Metrics.verticalScale(15), padding: Metrics.scale(12), backgroundColor: '#F8F9FA', borderRadius: 8 },
  securityInfo: { paddingVertical: Metrics.verticalScale(15), alignItems: 'center' },
  securityBadge: { backgroundColor: '#F8F9FA', paddingHorizontal: Metrics.scale(15), paddingVertical: Metrics.verticalScale(10), borderRadius: 8 },
  footer: { paddingTop: Metrics.verticalScale(15), paddingBottom: Metrics.verticalScale(20), borderTopWidth: 1, borderTopColor: Colors.SUPER_GREY || '#F0F0F0' },
  resetButton: { marginTop: Metrics.verticalScale(10), padding: Metrics.scale(8), alignItems: 'center' },
});

export default AddNewPaymentMethodScreen;