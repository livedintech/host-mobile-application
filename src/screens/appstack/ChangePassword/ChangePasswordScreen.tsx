import React from 'react';
import { StyleSheet, View, SafeAreaView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import InputField from '@/components/molecules/Input/InputField'; 
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useChangePasswordContainer from './ChangePasswordContainer';
import PasswordField from '@/components/molecules/Input/PasswordField';

const ChangePasswordScreen = () => {
  const { control, errors, handleSubmit, onSubmit, isLoading } = useChangePasswordContainer();

  return (
    <View style={styles.container}>
      {/* Decorative Circles Background */}

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <AppText 
            text="Change Your Password" 
            fontSize={32} 
            type="Bold" 
            color={Colors.BRUNSWICK_GREEN} 
            textAlign="center" 
          />
        </View>

        <View style={styles.form}>
          <PasswordField
            name="oldPassword"
            label="Old Password *"
            control={control}
            errors={errors}
            placeholder="Enter old password"
          />

          <PasswordField
            name="newPassword"
            label="New Password *"
            control={control}
            errors={errors}
            placeholder="Enter new password"
          />

          <PasswordField
            name="confirmPassword"
            label="Confirm Password *"
            control={control}
            errors={errors}
            placeholder="Confirm new password"
          />

          <View style={styles.footer}>
            <AppButton 
              title="Change Password" 
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