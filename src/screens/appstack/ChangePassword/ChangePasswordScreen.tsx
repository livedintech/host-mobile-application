import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useChangePasswordContainer from './ChangePasswordContainer';
import PasswordField from '@/components/molecules/Input/PasswordField';
import { useTranslation } from 'react-i18next';
import BGImage from '@/components/molecules/BGImage/BGImage';

const ChangePasswordScreen = () => {
  const { t } = useTranslation();
  const { control, errors, handleSubmit, onSubmit, isLoading } = useChangePasswordContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" bounces={false}>
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <AppText
                text={t('app.change_password.title')}
                fontSize={32}
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
                textAlign="center"
              />
            </View>

            <View style={styles.form}>
              <PasswordField
                name="oldPassword"
                label={t('app.change_password.old_label')}
                control={control}
                errors={errors}
                placeholder={t('app.change_password.old_placeholder')}
              />

              <PasswordField
                name="newPassword"
                label={t('app.change_password.new_label')}
                control={control}
                errors={errors}
                placeholder={t('app.change_password.new_placeholder')}
              />

              <PasswordField
                name="confirmPassword"
                label={t('app.change_password.confirm_label')}
                control={control}
                errors={errors}
                placeholder={t('app.change_password.confirm_placeholder')}
              />

              <View style={styles.footer}>
                <AppButton
                  title={t('app.change_password.submit_btn')}
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  mt={40}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 25 },
  titleSection: { marginTop: 80, marginBottom: 40 },
  form: { flex: 1 },
  footer: { marginTop: 'auto', paddingBottom: 40 },
});

export default ChangePasswordScreen;
