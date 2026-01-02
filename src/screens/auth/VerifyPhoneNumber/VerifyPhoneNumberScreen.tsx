import React from 'react';
import { StyleSheet, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { Controller } from 'react-hook-form';
import useVerifyPhoneNumberContainer from './VerifyPhoneNumberContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { formatPhoneNumber, maskPhoneNumber } from '@/utility/helpers';

const VerifyPhoneNumberScreen = () => {
  const {
    control,
    errors,
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
    <SafeAreaView style={styles.container}>

      {/* Background Decorative Circles */}
      <View style={styles.circleBgContainer} pointerEvents="none">
        <View style={styles.circleLarge} />
        <View style={styles.circleMedium} />
      </View>

      <View style={styles.content}>
        {/* Title & Subtitle */}
        <View style={styles.textSection}>
          <AppText
            text="Verify your Phone Number"
            type="Bold"
            fontSize={28}
            textAlign="center"
            color={Colors.BRUNSWICK_GREEN}
          />
          <AppText
            text={`We have sent you 4 - digit verification code at\n${maskPhoneNumber(identifier) }`}
            type="Regular"
            textAlign="center"
            color={Colors.SUPER_GREY}
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
                tintColor={Colors.BRUNSWICK_GREEN}
                offTintColor="#E0E0E0"
                inputCount={4}
                keyboardType="numeric"
              />
            )}
          />
          {errors.otpCode && (
            <AppText
              text={errors.otpCode.message || ''}
              color={Colors.INDIAN_RED}
              textAlign="center"
              mt={10}
            />
          )}
        </View>

        {/* Action Button */}
        <AppButton
          title={isLoading ? 'Loading...' : 'Confirm'}
          style={[styles.confirmBtn, { opacity: otpCode.length < 4 ? 0.6 : 1 }]}
          onPress={handleVerifyOtp}
          disabled={otpCode.length < 4 || isLoading}
        />

        {/* Footer Resend Link */}
        {isResendDisabled ? (
          <AppText  mt={40} text={`Resend in ${formatTimer(timer)}`} />
        ) : (
          <View style={styles.footerSec}>
            <AppText
              text="Didn’t receive the code?"
              color={Colors.SUPER_GREY}
            />
            <AppText onPress={handleResendOtp} text="Resend here" color={Colors.PINE_FOREST} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(20),
    marginTop: Metrics.verticalScale(10),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backBtn: {
    paddingHorizontal: 25,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textSection: {
    marginBottom: 40,
  },
  subText: {
    marginTop: 15,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  otpWrapper: {
    width: '100%',
    marginBottom: 40,
  },
  otpContainer: {
    width: '100%',
  },
  otpInput: {
    width: Metrics.scale(64),
    height: Metrics.verticalScale(60),
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    color: Colors.BLACK,
    fontSize: 24,
    fontWeight: '600',
  },
  confirmBtn: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  resendWrapper: {
    marginTop: 30,
  },
  // Background circles
  circleBgContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  circleLarge: {
    width: Metrics.screenWidth * 1.6,
    height: Metrics.screenWidth * 1.6,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F9F9F9',
    position: 'absolute',
  },
  circleMedium: {
    width: Metrics.screenWidth * 1.0,
    height: Metrics.screenWidth * 1.0,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    position: 'absolute',
  },
  footerSec: {
    flexDirection: 'row',
    marginTop: Metrics.verticalScale(40),
    gap: 5,
  },
});

export default VerifyPhoneNumberScreen;
