import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useTTLockCredentialsContainer from './TTLockCredentialsContainer';
import InputField from '@/components/molecules/Input/InputField';
import PasswordField from '@/components/molecules/Input/PasswordField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';

const TTLockCredentialsScreen = () => {
  const { control, errors, handleSubmit, isLoading } =
    useTTLockCredentialsContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          // Apply flexGrow: 1 to ensure it fills the screen for centering
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.titleWrapper}>
            <AppText fontSize={30} type="Medium" color={Colors.BLACK}>
              Enter your{' '}
              <AppText
                text="TT Lock"
                fontSize={30}
                type="Bold"
                color={Colors.PRIMARY_TEAL}
              />{' '}
              account credentials
            </AppText>
          </View>

          <View style={styles.form}>
            <InputField
              label="Email*"
              name="username"
              control={control}
              errors={errors}
              placeholder="tooba@example.com"
              keyboardType="email-address"
            />

            <PasswordField
              label="Password*"
              name="password"
              control={control}
              errors={errors}
              placeholder="********"
            />
          </View>

          <AppText
            text="Enter your TTLock account credentials to connect and manage your smart lock. Don't have an account yet? Simply create one using the TTLock Smart Lock app, then return here to sign in and continue."
            fontSize={11}
            lineHeight={6}
            color={Colors.BLACK_53_PERCENT}
            style={styles.instruction}
          />

          <View style={styles.footer}>
            <AppButton
              title="Connect"
              onPress={handleSubmit}
              loading={isLoading}
              backgroundColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              borderRadius={25}
            />
          </View>
        </ScrollView>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    // This is the "magic" part for vertical centering in a ScrollView
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingHorizontal: Metrics.scale(25),
    paddingBottom: Metrics.verticalScale(40),
  },
  titleWrapper: {
    // Removed large top margin to keep it perfectly centered
    marginBottom: Metrics.verticalScale(52),
  },
  form: {
    width: '100%',
  },
  instruction: {
    marginTop: Metrics.verticalScale(25),
    lineHeight: 18,
  },
  footer: {
    marginTop: Metrics.verticalScale(150),
  },
});

export default TTLockCredentialsScreen;