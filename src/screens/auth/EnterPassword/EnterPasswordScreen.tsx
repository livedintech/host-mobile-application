import React from 'react';
import { StyleSheet, View } from 'react-native';
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

const FIGMA_TEAL = Colors.PRIMARY_TEAL;

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
            {/* Note: Ensure your Parent Navigation or Header component 
                handles the Back Arrow and 'العربية' button seen in the image.
            */}

            <View style={styles.centerBody}>
              {/* Title Section */}
              <View style={styles.headerSection}>
                <AppText type="Regular" fontSize={30} color={Colors.BLACK} lineHeight={42}>
                  Please enter your
                </AppText>
                <AppText type="Regular" fontSize={30} color={Colors.BLACK} lineHeight={42}>
                  password to{' '}
                  <AppText type="SemiBold" fontSize={30} color={FIGMA_TEAL}>
                    continue
                  </AppText>
                </AppText>
              </View>

              {/* Form Fields */}
              <View style={styles.form}>
                <PasswordField
                  label="Password *"
                  name="password"
                  control={control as any}
                  errors={errors}
                  placeholder=""
                  // Ensure your PasswordField component uses a transparent/thin underline style per design
                />

                {/* Forgot Password Link - Aligned Right */}
                <View style={styles.forgotRow}>
                  <ButtonView onPress={gotToVerifyOTP} style={styles.forgotBtn}>
                    <AppText text="Forgot password?" color={Colors.BLACK} fontSize={14} />
                  </ButtonView>
                </View>
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
                borderRadius={100} // Keeps the pill shape
                type="SemiBold"
                fontSize={16}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: s(30),
    justifyContent: 'space-between', // Pushes bottomSec to the bottom
  },
  centerBody: {
    flex: 1,
    justifyContent: 'center', // Centers the text and input vertically like the design
    marginTop: vs(20),
  },
  headerSection: {
    marginBottom: vs(40),
  },
  form: {
    width: '100%',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: vs(8),
  },
  forgotBtn: {
    paddingVertical: 5,
  },
  bottomSec: {
    paddingBottom: vs(100),
    width: '100%',
  },
  buttonHeight: {
    height: vs(50), // Ensures the button has enough presence
  },
});

export default EnterPasswordScreen;