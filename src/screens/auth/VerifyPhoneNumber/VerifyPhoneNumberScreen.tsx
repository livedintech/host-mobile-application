import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { Colors } from '@/theme/colors';
import { s, vs } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import { Controller } from 'react-hook-form';
import useVerifyPhoneNumberContainer from './VerifyPhoneNumberContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { maskPhoneNumber } from '@/utility/helpers';
import BGImage from '@/components/molecules/BGImage/BGImage';

const FIGMA_TEAL = '#20957B';

const VerifyPhoneNumberScreen = () => {
  const {
    control,
    otpCode,
    timer,
    isResendDisabled,
    identifier,
    handleResendOtp,
    handleVerifyOtp,
    formatTimer,
    isLoading,
  } = useVerifyPhoneNumberContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mainContent}>
              {/* Title Section */}
              <View style={styles.textSection}>
                <AppText type="Bold" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                  Verify Your{' '}
                  <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>
                    Phone Number
                  </AppText>
                </AppText>
                <AppText
                  text={`We have sent you 5-digit verification code at\n${maskPhoneNumber(identifier)}`}
                  type="Regular"
                  fontSize={16}
                  color={Colors.BLACK}
                  style={styles.subText}
                />
              </View>

              {/* OTP Input Section */}
              <View style={styles.otpWrapper}>
                <Controller
                  control={control}
                  name="otpCode"
                  render={({ field: { onChange } }) => (
                    <OTPTextInput
                      handleTextChange={onChange}
                      textInputStyle={styles.otpInput}
                      containerStyle={styles.otpContainer}
                      tintColor={FIGMA_TEAL}
                      offTintColor="#EAEAEA"
                      inputCount={4}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>

              {/* Footer Resend Link */}
              <View style={styles.footerSec}>
                <AppText
                  text="Didn’t receive the code? "
                  fontSize={15}
                  color={Colors.BLACK}
                />
                <AppText
                  onPress={isResendDisabled ? undefined : handleResendOtp}
                  text={isResendDisabled ? `Resend in ${formatTimer(timer)}` : "Resend here"}
                  fontSize={15}
                  type="Bold"
                  color={FIGMA_TEAL}
                />
              </View>

              <View style={styles.bottomSec}>
                <AppButton
                  loading={isLoading}
                  onPress={handleVerifyOtp}
                  title="Next"
                  backgroundColor={FIGMA_TEAL}
                  color={Colors.WHITE}
                  borderRadius={100}
                  type="Bold"
                  fontSize={18}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  mainContent: {
    flex: 1,
    paddingHorizontal: s(24),
    paddingTop: vs(60),
    alignItems: 'center',
  },
  textSection: {
    width: '100%',
    marginBottom: vs(40),
  },
  subText: {
    marginTop: vs(15),
    lineHeight: 24,
  },
  otpWrapper: {
    width: '100%',
    marginBottom: vs(20),
  },
  otpContainer: {
    width: '100%',
    justifyContent: 'space-between',
  },
  otpInput: {
    width: s(52),
    height: vs(60),
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: 1, // Ensure no underline style is forced
    color: Colors.BLACK,
    fontSize: 24,
  },
  footerSec: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: vs(10),
  },
  bottomSec: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: vs(30),
    marginTop: vs(40),
  },
  fullWidthBtn: {
    width: '100%',
  }
});

export default VerifyPhoneNumberScreen;
