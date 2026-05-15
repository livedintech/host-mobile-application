import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import InputField from '@/components/molecules/Input/InputField';
import PasswordField from '@/components/molecules/Input/PasswordField';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { Colors } from '@/theme/colors';
import { s, vs } from 'react-native-size-matters';
import useCreateAccountContainer from './CreateAccountContainer';
import Checkbox from '@/components/molecules/Input/CheckBox';
import AccountDeleteModal from '@/components/molecules/AccountDeleteModal/AccoutDeleteModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Metrics from '@/utility/Metrics';
import { handleOpenLink } from '@/utility/Utils';
import { useTranslation } from 'react-i18next';

const FIGMA_TEAL = '#09A389';

const CreateAccountScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    isLoading,
    isTermsAccepted,
    toggleTerms,
    showBackModal,
    confirmGoBack,
    cancelGoBack,
  } = useCreateAccountContainer();

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
            <View style={styles.headerSection}>
              <AppText type="Regular" fontSize={30} color={Colors.BLACK} lineHeight={40}>
                {t('auth.create_account.title_1')}
                <AppText type="SemiBold" fontSize={30} color={FIGMA_TEAL} lineHeight={40}>
                  {t('auth.create_account.title_2')}
                </AppText>
              </AppText>
              <AppText
                text={t('auth.create_account.subtitle')}
                type="Regular"
                fontSize={16}
                color={Colors.DARK_CHARCOAL}
                mt={vs(10)}
                lineHeight={24}
                style={{ opacity: 0.8 }}
              />
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              <InputField
                label={t('auth.create_account.full_name')}
                name="fullName"
                control={control as any}
                errors={errors}
                placeholder=""
              />
              <View style={styles.passwordWrapper}>
                <InputField
                  label={t('auth.create_account.email')}
                  name="email"
                  control={control as any}
                  errors={errors}
                  placeholder=""
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.passwordWrapper}>
                <PasswordField
                  label={t('auth.create_account.password')}
                  name="password"
                  control={control as any}
                  errors={errors}
                  placeholder=""
                />
              </View>
              <AppText
                text={t('auth.create_account.password_hint')}
                fontSize={13}
                color={Colors.DARK_CHARCOAL}
                mt={vs(8)}
                lineHeight={18}
                style={{ opacity: 0.6 }}
              />
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsWrapper}>
              <Checkbox isChecked={isTermsAccepted} onPress={toggleTerms} />
              <AppText fontSize={13} color={Colors.NIGHT} style={styles.termsText}>
                {t('auth.create_account.terms_1')}{' '}
                <AppText
                  fontSize={13}
                  color={Colors.NIGHT}
                  style={styles.underline}
                  onPress={() => handleOpenLink('https://livedin.co/privacy-policy')}
                >
                  {t('auth.create_account.terms_and_conditions')}
                </AppText>
                {' '}{t('auth.create_account.terms_2')}{' '}
                <AppText
                  fontSize={12}
                  color={Colors.NIGHT}
                  style={styles.underline}
                  onPress={() => handleOpenLink('https://livedin.co/privacy-policy')}
                >
                  {t('auth.create_account.privacy_policy')}
                </AppText>
              </AppText>
            </View>

            {/* Action Button */}
            <View style={styles.bottomSec}>
              <AppButton
                loading={isLoading}
                onPress={handleSubmit}
                title={t('auth.create_account.next')}
                disabled={!isTermsAccepted}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

      <AccountDeleteModal
        isVisible={showBackModal}
        onClose={cancelGoBack}
        onConfirm={confirmGoBack}
        title={t('auth.create_account.exit_modal_title')}
        description={t('auth.create_account.exit_modal_text')}
      />
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
  },
  headerSection: {
    marginBottom: vs(40),
  },
  form: {
    width: '100%',
  },
  passwordWrapper: {
    marginTop: vs(20),
  },
  termsWrapper: {
    flexDirection: 'row',
    marginTop: vs(24),
    width: '100%',
    paddingRight: s(10),
  },
  termsText: { flex: 1, marginLeft: Metrics.scale(12), lineHeight: 18 },
  underline: { textDecorationLine: 'underline' },
  bottomSec: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: vs(30),
    marginTop: vs(20),
  },

});

export default CreateAccountScreen;
