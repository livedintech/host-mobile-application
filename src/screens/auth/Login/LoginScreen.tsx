import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView'
import useLoginContainer from './LoginContainer'
import InputField from '@/components/molecules/Input/InputField'
import PasswordField from '@/components/molecules/Input/PasswordField'
import AppText from '@/components/molecules/AppText/AppText'
import AppButton from '@/components/molecules/AppButton/AppButton'
import Metrics from '@/utility/Metrics'

const LoginScreen = () => {
  const { control, errors, handleSubmit, isLoading } = useLoginContainer()
  return (
    <RefreshableScrollView style={styles.container}>
        <AppText text='Login to Your Account' type='SemiBold' fontSize={24} mb={5}/>
      {/* Form Fields */}
        <InputField
          label='Email address'
          name="email"
          control={control}
          errors={errors}
          placeholder="Enter Email"
          keyboardType={'email-address'}
        />
        <PasswordField
          label='Password'
          name="password"
          control={control}
          errors={errors}
          placeholder="Enter Password"
          rules={{ required: 'Password is required' }}
        />
        <AppButton onPress={handleSubmit} title='Login' mb={8} loading={isLoading} />
    </RefreshableScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container:{
    paddingHorizontal: Metrics.baseMargin
  }
})