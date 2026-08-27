import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import PasswordField from '@/components/molecules/Input/PasswordField';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import UpdatePasswordContainer from './UpdatePasswordContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { useTranslation } from 'react-i18next';

const UpdatePasswordScreen = () => {
  const { t } = useTranslation();
  const { control, errors, handleSubmit, isLoading, watch } = UpdatePasswordContainer();
  
  // We "watch" the password field to compare it with the confirm field
  const password = watch("password");

  return (
        <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>

    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.titleSection}>
          <AppText text={t('auth.update_password.title')} fontSize={28} textAlign="center" type="Bold" />
        </View>

        <View style={styles.form}>
          <PasswordField
            label={t('auth.update_password.new_password_label')}
            name="password"
            control={control}
            errors={errors}
            placeholder={t('auth.update_password.new_password_placeholder')}
            rules={{
              required: t('auth.update_password.error_required'),
              minLength: { value: 8, message: t('auth.update_password.error_min_length') }
            }}
          />

          <View style={{ marginTop: 20 }}>
            <PasswordField
              label={t('auth.update_password.confirm_password_label')}
              name="confirmPassword"
              control={control}
              errors={errors}
              placeholder={t('auth.update_password.confirm_password_placeholder')}
              rules={{
                required: t('auth.update_password.error_confirm_required'),
                validate: (value: string) =>
                  value === password || t('auth.update_password.error_no_match')
              }}
            />
          </View>
        </View>

        <View style={styles.bottomSec}>
          <AppButton loading={isLoading} onPress={handleSubmit} title={t('auth.update_password.update_btn')} />
        </View>
      </ScrollView>
    </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  scrollContainer: { 
    flexGrow: 1, 
    paddingHorizontal: 20 
  },
  titleSection: { 
    marginTop: Metrics.verticalScale(60), 
    alignItems: 'center' 
  },
  form: { 
    marginTop: Metrics.verticalScale(40) 
  },
  bottomSec: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Metrics.verticalScale(30)
  },
  bgContainer: {
    flex: 1,
  },
});

export default UpdatePasswordScreen;