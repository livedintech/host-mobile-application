import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView'
import useLoginContainer from './LoginContainer'
import InputField from '@/components/molecules/Input/InputField'
import PasswordField from '@/components/molecules/Input/PasswordField'
import AppText from '@/components/molecules/AppText/AppText'
import AppButton from '@/components/molecules/AppButton/AppButton'
import Metrics from '@/utility/Metrics'
import { useTranslation } from 'react-i18next'

const LoginScreen = () => {
  const { control, errors, handleSubmit, isLoading } = useLoginContainer()
  const { t } = useTranslation()
  return (
    <RefreshableScrollView style={styles.container}>
        <AppText text={t('auth.login_email.title')} type='SemiBold' fontSize={24} mb={5}/>
      {/* Form Fields */}
        <InputField
          label={t('auth.login_email.email_label')}
          name="email"
          control={control}
          errors={errors}
          placeholder={t('auth.login_email.email_placeholder')}
          keyboardType={'email-address'}
        />
        <PasswordField
          label={t('auth.login_email.password_label')}
          name="password"
          control={control}
          errors={errors}
          placeholder={t('auth.login_email.password_placeholder')}
          rules={{ required: t('auth.update_password.error_required') }}
        />
        <AppButton onPress={handleSubmit} title={t('auth.login_email.login_btn')} mb={8} loading={isLoading} />
    </RefreshableScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container:{
    paddingHorizontal: Metrics.baseMargin
  }
})