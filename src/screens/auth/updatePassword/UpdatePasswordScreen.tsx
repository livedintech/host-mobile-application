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

const UpdatePasswordScreen = () => {
  const { control, errors, handleSubmit, isLoading, watch } = UpdatePasswordContainer();
  
  // We "watch" the password field to compare it with the confirm field
  const password = watch("password");

  return (
        <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>

    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.titleSection}>
          <AppText text="Set New Password" fontSize={28} textAlign="center" type="Bold" />
        </View>

        <View style={styles.form}>
          <PasswordField
            label="New Password *"
            name="password"
            control={control}
            errors={errors}
            placeholder="Enter new password"
            rules={{
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" }
            }}
          />

          <View style={{ marginTop: 20 }}>
            <PasswordField
              label="Confirm Password *"
              name="confirmPassword"
              control={control}
              errors={errors}
              placeholder="Re-type your password"
              rules={{
                required: "Please confirm your password",
                validate: (value: string) => 
                  value === password || "Passwords do not match"
              }}
            />
          </View>
        </View>

        <View style={styles.bottomSec}>
          <AppButton loading={isLoading} onPress={handleSubmit} title="Update Password" />
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