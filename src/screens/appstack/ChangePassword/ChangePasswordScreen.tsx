import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import InputField from '@/components/molecules/Input/InputField'; 
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useChangePasswordContainer from './ChangePasswordContainer';
import PasswordField from '@/components/molecules/Input/PasswordField';
import { useTranslation } from 'react-i18next';

const ChangePasswordScreen = () => {
  const { t } = useTranslation();
  const { control, errors, handleSubmit, onSubmit, isLoading } = useChangePasswordContainer();

  return (
    <View style={styles.container}>
      {/* Decorative Circles Background */}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  content: { flex: 1, paddingHorizontal: 25 },
  titleSection: { marginTop: 80, marginBottom: 40 },
  form: { flex: 1 },
  footer: { marginTop: 'auto', paddingBottom: 40 }
});

export default ChangePasswordScreen;