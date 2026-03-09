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

const FIGMA_TEAL = '#20957B';

const AddNewPasswordScreen = () => {
  const { isLoading, control, errors, handleSubmit } = useAddNewPasswordContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mainContent}>
              {/* Title Section - Left Aligned Pattern */}
              <View style={styles.headerSection}>
                <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                  Please enter your
                </AppText>
                <AppText type="Bold" fontSize={32} color={FIGMA_TEAL} lineHeight={40}>
                  new{' '}
                  <AppText type="Regular" fontSize={32} color={Colors.BLACK}>
                    password
                  </AppText>
                </AppText>
              </View>

              {/* Form Fields */}
              <View style={styles.form}>
                <PasswordField
                  label="New Password*"
                  name="password"
                  control={control}
                  errors={errors}
                  placeholder=""
                />

                <View style={{ marginTop: vs(20) }}>
                  <PasswordField
                    label="Confirm Password*"
                    name="confirmPassword"
                    control={control}
                    errors={errors}
                    placeholder=""
                  />
                </View>

                {/* Password Strength Hint */}
                <AppText
                  text="Please choose a stronger password. Try a mix of letters, numbers, and symbols."
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
                  title="Continue"
                  backgroundColor={FIGMA_TEAL}
                  color={Colors.WHITE}
                  borderRadius={100}
                  type="Bold"
                  fontSize={18}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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