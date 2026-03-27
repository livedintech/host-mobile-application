import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useTTLockCredentialsContainer from './TTLockCredentialsContainer';
import InputField from '@/components/molecules/Input/InputField';
import PasswordField from '@/components/molecules/Input/PasswordField';
import AppButton from '@/components/molecules/AppButton/AppButton';

// Custom design components
import { goBack } from '@/services/navigationService';
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
          contentContainerStyle={styles.scrollContent}
        >
          {/* Mixed Color Title */}
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
            {/* Email Input with Asterisk */}
            <InputField
              label="Email*"
              name="username"
              control={control}
              errors={errors}
              placeholder="tooba@example.com"
              keyboardType="email-address"
            />

            {/* Password Input with Asterisk */}
            <PasswordField
              label="Password*"
              name="password"
              control={control}
              errors={errors}
              placeholder="********"
            />
          </View>

          {/* Disclaimer/Instruction Text */}
          <AppText
            text="Enter your TTLock account credentials to connect and manage your smart lock. Don't have an account yet? Simply create one using the TTLock Smart Lock app, then return here to sign in and continue."
            fontSize={13}
            color={Colors.BLACK_53_PERCENT}
            style={styles.instruction}
          />

          {/* Styled Connect Button */}
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
  header: {
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(10),
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: Metrics.scale(25),
    paddingBottom: Metrics.verticalScale(40),
  },
  titleWrapper: {
    marginTop: Metrics.verticalScale(40),
    marginBottom: Metrics.verticalScale(30),
  },
  form: {
    width: '100%',
  },
  instruction: {
    marginTop: Metrics.verticalScale(25),
    lineHeight: 18,
  },
  footer: {
    marginTop: Metrics.verticalScale(60),
  },
});

export default TTLockCredentialsScreen;
