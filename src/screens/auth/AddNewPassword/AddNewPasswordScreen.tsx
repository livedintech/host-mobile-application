import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import PasswordField from '@/components/molecules/Input/PasswordField';
import { Colors } from '@/theme/colors';
import useAddNewPasswordContainer from './AddNewPasswordContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';

const FIGMA_TEAL = '#09A389';

const AddNewPasswordScreen = () => {
  const { isLoading, control, errors, handleSubmit } = useAddNewPasswordContainer();
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
            {/* Title Section - Left Aligned Pattern */}
            <View style={styles.headerSection}>
              <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                {t('auth.add_new_password.title_1')}
              </AppText>
              <AppText type="Bold" fontSize={32} color={FIGMA_TEAL} lineHeight={40}>
                {t('auth.add_new_password.title_highlight')}{' '}
                <AppText type="Regular" fontSize={32} color={Colors.BLACK}>
                  {t('auth.add_new_password.title_end')}
                </AppText>
              </AppText>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <PasswordField
                label={t('auth.add_new_password.new_password_label')}
                name="password"
                control={control}
                errors={errors}
                placeholder=""
              />

              <View style={{ marginTop: vs(20) }}>
                <PasswordField
                  label={t('auth.add_new_password.confirm_password_label')}
                  name="confirmPassword"
                  control={control}
                  errors={errors}
                  placeholder=""
                />
              </View>

              {/* Password Strength Hint */}
              <AppText
                text={t('auth.add_new_password.password_hint')}
                fontSize={13}
                color="#707070"
                mt={vs(15)}
                lineHeight={20}
              />
            </View>

            {/* Action Button */}
            <View style={styles.bottomSec}>
              <AppButton
                loading={isLoading}
                onPress={handleSubmit}
                title={t('auth.add_new_password.continue')}
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
    paddingTop: vs(60), // Space for status bar/potential back button
  },
  headerSection: {
    marginBottom: vs(40),
  },
  form: {
    width: '100%',
  },
  bottomSec: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: vs(30),
    marginTop: vs(20),
  },
});

export default AddNewPasswordScreen;