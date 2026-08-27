import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, I18nManager } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { Colors } from '@/theme/colors';
import { s, vs } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import { Controller } from 'react-hook-form';
import useVerifyPhoneNumberContainer from './VerifyPhoneNumberContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const FIGMA_TEAL = '#09A389';

const VerifyPhoneNumberScreen = () => {
  const otpRef = useRef<any>(null);

  const {
    control,
    timer,
    isResendDisabled,
    code, 
    actualPhone,
    handleResendOtp,
    handleVerifyOtp,
    formatTimer,
    isLoading,
    setValue,
    setResetKey,
    setTimer,
    setIsResendDisabled,
    RESEND_TIME_LIMIT,
    resetKey
  } = useVerifyPhoneNumberContainer();
  const { t } = useTranslation();

  useFocusEffect(
  useCallback(() => {
    // Har baar screen focus ho, sab reset karo
    setValue('otpCode', '');
    setTimer(RESEND_TIME_LIMIT);
    setIsResendDisabled(true);
    setResetKey(prev => prev + 1); // OTP input forcefully re-render karega
  }, [setValue])
);


  // Logic to format the dynamic masked number
  const cleanCode = code?.replace(/\D/g, '') || '';
  const cleanPhone = actualPhone?.replace(/\D/g, '') || '';
  const lastFour = cleanPhone.slice(-4);
  const maskedLocal = cleanPhone.length > 9
    ? `XXX XXX ${lastFour}`
    : `XXX XX ${lastFour}`;

  const formattedDisplayNumber = `(+${cleanCode}) ${maskedLocal}`;

  // 3. New wrapper to clear fields and resend
  const onResendPress = useCallback(() => {
    if (!isResendDisabled) {
      otpRef.current?.setValue('');
      setValue('otpCode', '');  
      handleResendOtp();   
    }
  }, [isResendDisabled, handleResendOtp, setValue]);

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            <View style={styles.textSection}>
              <AppText type="Bold" fontSize={32} color={Colors.BLACK} lineHeight={40} textAlign="center">
                {t('auth.verify_phone.title_1')}{' '}
                <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>
                  {t('auth.verify_phone.title_2')}
                </AppText>
              </AppText>
              
              <View style={styles.subTextWrap}>
                <AppText
                  text={t('auth.verify_phone.subtitle')}
                  type="Regular"
                  fontSize={16}
                  color={Colors.BLACK}
                  textAlign="center"
                  style={{ opacity: 0.7 }}
                />
                <AppText
                  text={formattedDisplayNumber}
                  type="SemiBold"
                  fontSize={18}
                  color={Colors.BLACK}
                  textAlign="center"
                  mt={vs(5)}
                />
              </View>
            </View>

            <View style={[styles.otpWrapper, I18nManager.isRTL && styles.rtlFlip]}>
              <Controller
                control={control}
                name="otpCode"
                render={({ field: { onChange } }) => (
                  <OTPTextInput
                  key={resetKey}
                    ref={otpRef} // 4. Attach the ref here
                    handleTextChange={onChange}
                    textInputStyle={I18nManager.isRTL ? { ...styles.otpInput, transform: [{ scaleX: -1 }] } : styles.otpInput}
                    containerStyle={styles.otpContainer}
                    tintColor={FIGMA_TEAL}
                    offTintColor="#C4C4C4"
                    inputCount={5}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>

            <View style={styles.footerSec}>
              <AppText text={t('auth.verify_phone.didnt_receive')} fontSize={15} color={Colors.BLACK} />
              <AppText
                onPress={isResendDisabled ? undefined : onResendPress}
                text={isResendDisabled ? `${t('auth.verify_phone.resend_in')} ${formatTimer(timer)}` : t('auth.verify_phone.resend_here')}
                fontSize={15}
                type="Bold"
                color={FIGMA_TEAL}
              />
            </View>

            <View style={styles.bottomSec}>
              <AppButton
                loading={isLoading}
                onPress={handleVerifyOtp}
                title={t('auth.verify_phone.next')}
                backgroundColor={FIGMA_TEAL}
                color={Colors.WHITE}
                borderRadius={100}
                type="Bold"
                fontSize={18}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
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
  textSection: { width: '100%', marginBottom: vs(40) },
  subTextWrap: { marginTop: vs(15) },
  otpWrapper: { width: '100%', marginBottom: vs(40) },
  otpContainer: { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
  otpInput: {
    width: s(54),
    height: vs(64),
    borderWidth: 1,
    borderRadius: 12,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    color: Colors.BLACK,
    fontSize: 24,
  },
  footerSec: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  bottomSec: { flex: 1, width: '100%', justifyContent: 'flex-end', paddingBottom: vs(40), marginTop: vs(40) },
  rtlFlip: { transform: [{ scaleX: -1 }] },
});

export default VerifyPhoneNumberScreen;