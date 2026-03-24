import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import PasswordField from '@/components/molecules/Input/PasswordField';
import { Colors } from '@/theme/colors';
import useEnterPasswordContainer from './EnterPasswordContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const FIGMA_TEAL = '#20957B';

const EnterPasswordScreen = () => {
  const { isLoading, control, errors, handleSubmit, gotToVerifyOTP } = useEnterPasswordContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            {/* Title Section - Left Aligned */}
            <View style={styles.headerSection}>
              <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                Please enter your
              </AppText>
              <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                password to{' '}
                <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>
                  continue
                </AppText>
              </AppText>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <PasswordField
                label="Password *"
                name="password"
                control={control}
                errors={errors}
                placeholder=""
              />

              {/* Forgot Password Link */}
              <View style={styles.forgotRow}>
                <ButtonView onPress={gotToVerifyOTP} style={styles.forgotBtn}>
                  <AppText text="Forgot password?" color={Colors.BLACK} fontSize={14} />
                </ButtonView>
              </View>
            </View>

            {/* Bottom Action Button */}
            <View style={styles.bottomSec}>
              <AppButton
                loading={isLoading}
                onPress={handleSubmit}
                title="Continue"
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
    paddingTop: vs(40),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingTop: vs(10),
    alignItems: 'center',
  },
  backButton: {
    width: s(40),
    height: s(40),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  langButton: {
    paddingHorizontal: s(15),
    paddingVertical: vs(5),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: Colors.WHITE,
  },
  headerSection: {
    marginBottom: vs(50),
  },
  form: {
    width: '100%',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: vs(10),
  },
  forgotBtn: {
    paddingVertical: 5,
  },
  bottomSec: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: vs(30),
    marginTop: vs(20),
  },
});

export default EnterPasswordScreen;