import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MFCardPaymentView, MFGooglePayButton, GooglePayButtonConstants } from 'myfatoorah-reactnative';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useAddNewPaymentMethodContainer from './AddNewPaymentMethodContainer';

const AddNewPaymentMethodScreen = () => {
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
    let loadingText = `Loading ${paymentMethodName || 'Payment'}...`;

    if (isProcessingPayment) {
      loadingText = "Processing Payment...";
    } else if (isSaving) {
      loadingText = "Saving Payment Details...";
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
        text={`Pay with ${paymentMethodName}`}
        fontSize={24}
        type="Bold"
        textAlign="center"
        color={Colors.BLACK}
        mt={20}
      />

      <AppText
        text="You will be redirected to complete your payment"
        fontSize={14}
        textAlign="center"
        color={Colors.SUPER_GREY}
        mt={10}
      />

      <View style={styles.instructionsList}>
        <View style={styles.instructionItem}>
          <AppText text="1️⃣" fontSize={20} />
          <AppText
            text={`Open ${paymentMethodName} app/website`}
            fontSize={14}
            color={Colors.BLACK}
            ml={10}
          />
        </View>

        <View style={styles.instructionItem}>
          <AppText text="2️⃣" fontSize={20} />
          <AppText
            text="Confirm payment details"
            fontSize={14}
            color={Colors.BLACK}
            ml={10}
          />
        </View>

        <View style={styles.instructionItem}>
          <AppText text="3️⃣" fontSize={20} />
          <AppText
            text="Complete authentication"
            fontSize={14}
            color={Colors.BLACK}
            ml={10}
          />
        </View>

        <View style={styles.instructionItem}>
          <AppText text="4️⃣" fontSize={20} />
          <AppText
            text="Return to app after payment"
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
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
                  ? "Enter your card details securely"
                  : "Quick and secure payment"
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
                      text="⟳ Retry Loading"
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
                text="🔒 Your payment information is encrypted and secure"
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
                    ? "Processing Payment..."
                    : isSaving
                      ? "Saving Details..."
                      : !isCardMethod
                        ? `Pay with ${paymentMethodName}`
                        : "Pay Now"
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
                  text="🔄 Reset Payment Form"
                  color={Colors.SUPER_GREY}
                  fontSize={12}
                  textAlign="center"
                />
              </TouchableOpacity>
            )}

            <AppText
              text="By proceeding, you agree to our terms and conditions"
              fontSize={11}
              color={Colors.SUPER_GREY}
              textAlign="center"
              mt={10}
            />
          </View>

        </View>
      </KeyboardAvoidingView>
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