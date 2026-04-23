import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useWatch } from 'react-hook-form'; // Added useWatch

import InputField from '@/components/molecules/Input/InputField';
import PasswordField from '@/components/molecules/Input/PasswordField';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { Colors } from '@/theme/colors';
import { s, vs } from 'react-native-size-matters';
import useCreateAccountContainer from './CreateAccountContainer';
import Checkbox from '@/components/molecules/Input/CheckBox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Metrics from '@/utility/Metrics';
import { handleOpenLink } from '@/utility/Utils';
import { useTranslation } from 'react-i18next';

const FIGMA_TEAL = '#09A389';
const DISABLED_GRAY = '#A0A0A0'; // Color for disabled state

const CreateAccountScreen = () => {
  const { control, errors, handleSubmit, isLoading, handleLanguage, isTermsAccepted, toggleTerms } = useCreateAccountContainer();
  const { t } = useTranslation();


  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            {/* Title Section */}
            <View style={styles.textSection}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 5 }}>
                <AppText type="Regular" fontSize={20} color={Colors.BLACK} >
                  {t('auth.create_account.title_1')}
                </AppText>
                <AppText type="SemiBold" fontSize={20} color={FIGMA_TEAL}>
                  {t('auth.create_account.title_2')}
                </AppText>
              </View>
              <AppText
                text={t('auth.create_account.subtitle')}
                fontSize={16}
                color={Colors.DARK_CHARCOAL}
                mt={14}
              />
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              <InputField
                label={t('auth.create_account.full_name')}
                name="fullName"
                control={control}
                errors={errors}
                placeholder=""
              />
              <PasswordField
                label={t('auth.create_account.password')}
                name="password"
                control={control}
                errors={errors}
                placeholder=""
              />
              <AppText
                text={t('auth.create_account.password_hint')}
                fontSize={11}
                color={Colors.DARK_CHARCOAL}
                style={styles.passwordHint}
              />
            </View>

            {/* Terms and Conditions Section */}
            <View style={styles.termsWrapper}>
              {/* <Controller
                control={control}
                name="agreeToTerms"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    isChecked={!!value}
                    onPress={() => onChange(!value)}
                  />
                )}
              /> */}
              <Checkbox
                isChecked={isTermsAccepted}
                onPress={toggleTerms}
              />
              <AppText fontSize={10} color={Colors.NIGHT} style={styles.termsText}>
                {t('auth.create_account.terms_1')}{' '}
                <AppText fontSize={10} color={Colors.NIGHT} style={styles.underline} onPress={()=>handleOpenLink('https://livedin.co/privacy-policy')}>{t('auth.create_account.terms_and_conditions')}</AppText>
                {' '}{t('auth.create_account.terms_2')}{' '}
                <AppText fontSize={10} color={Colors.NIGHT} style={styles.underline} onPress={()=>handleOpenLink('https://livedin.co/privacy-policy')}>{t('auth.create_account.privacy_policy')}</AppText>
              </AppText>
            </View>

            {/* Action Button */}
            <View style={styles.bottomSec}>
              <AppButton
                loading={isLoading}
                onPress={handleSubmit}
                title={t('auth.create_account.next')}
                fontSize={18}
                disabled={!isTermsAccepted}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </BGImage>
  );
};

// ... Styles remain the same ...
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  mainContent: {
    flex: 1,
    paddingHorizontal: s(24),
    paddingTop: vs(20),
    alignItems: 'center',
  },
  textSection: { width: '100%', marginBottom: vs(30) },
  form: { width: '100%' },
  passwordHint: { marginTop: vs(8), lineHeight: 18, opacity: 0.6 },
  termsWrapper: {
    flexDirection: 'row',
    marginTop: vs(20),
    width: '100%',
    paddingRight: s(20),
  },
  termsText: { flex: 1, marginLeft: Metrics.scale(14) },
  underline: { textDecorationLine: 'underline' },
  bottomSec: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: vs(30),
    marginTop: vs(20),
  },
});

export default CreateAccountScreen;