import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MFCardPaymentView } from 'myfatoorah-reactnative';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useAddCardDetailContainer from './AddCardDetailContainer';

const AddCardDetailScreen = () => {
  const {
    isLoading,
    isProcessingPayment,
    isSaving,
    cardLoading,
    cardPaymentView,
    getCardViewStyle,
    handlePay,
    retrySession,
  } = useAddCardDetailContainer();

  // Loading Overlay Component
  const LoadingOverlay = () => {
    let loadingText = "Loading Secure Payment...";

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
              text="Add Payment Method"
              fontSize={24}
              type="Bold"
              color={Colors.BLACK}
            />
            <AppText
              text="Enter your card details securely"
              fontSize={14}
              color={Colors.SUPER_GREY}
              mt={5}
            />
          </View>

          {/* Card Input Section */}
          <View style={styles.cardSection}>

            {/* Show loading overlay when processing */}
            {cardLoading && <LoadingOverlay />}

            {/* MyFatoorah Card View */}
            <MFCardPaymentView
              ref={cardPaymentView}
              paymentStyle={getCardViewStyle()}
              style={[
                styles.mfCardView,
                { opacity: isLoading ? 0 : 1 }
              ]}
            />

            {/* Retry Button if loading failed */}
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
            <AppButton
              title={
                isProcessingPayment
                  ? "Processing Payment..."
                  : isSaving
                    ? "Saving Details..."
                    : "Pay Now"
              }
              onPress={handlePay}
              disabled={cardLoading}
              loading={cardLoading}
            />

            {/* Reset Session Button */}
            {!cardLoading && (
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

            {/* Additional Info */}
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
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: Metrics.scale(20)
  },
  headerSection: {
    paddingTop: Metrics.verticalScale(10),
    paddingBottom: Metrics.verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.SUPER_GREY || '#F0F0F0',
  },
  cardSection: {
    flex: 1,
    marginTop: Metrics.verticalScale(20),
    position: 'relative',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 10,
    borderRadius: 12,
  },
  mfCardView: {
    height: Metrics.verticalScale(400),
    width: '100%',
    minHeight: 350,
  },
  retryButton: {
    marginTop: Metrics.verticalScale(20),
    padding: Metrics.scale(15),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.INDIAN_RED,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
  },
  securityInfo: {
    paddingVertical: Metrics.verticalScale(15),
    alignItems: 'center',
  },
  securityBadge: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: Metrics.scale(15),
    paddingVertical: Metrics.verticalScale(10),
    borderRadius: 8,
  },
  footer: {
    paddingTop: Metrics.verticalScale(15),
    paddingBottom: Metrics.verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: Colors.SUPER_GREY || '#F0F0F0',
  },
  resetButton: {
    marginTop: Metrics.verticalScale(10),
    padding: Metrics.scale(8),
    alignItems: 'center',
  },
});

export default AddCardDetailScreen;