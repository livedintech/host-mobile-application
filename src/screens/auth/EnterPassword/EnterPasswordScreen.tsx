import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import PasswordField from '@/components/molecules/Input/PasswordField';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useEnterPasswordContainer from './EnterPasswordContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const EnterPasswordScreen = () => {
  const { isLoading, control, errors, handleSubmit,gotToVerifyOTP } = useEnterPasswordContainer();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        {/* Title Section */}
        <View style={styles.titleSection}>
          <AppText 
            text="Please enter your Password to continue." 
            fontSize={28} 
            textAlign="center" 
          />
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

          {/* Remember Me & Forgot Password Row */}
          <View style={styles.row}>
            <View style={styles.rememberMe}>
              <View style={styles.checkbox} />
              <AppText text="Remember me" fontSize={12} color={Colors.PINE_FOREST} type='Medium'/>
            </View>
            <ButtonView onPress={gotToVerifyOTP}>
              <AppText text="Forgot password?" fontSize={12} color={Colors.BRUNSWICK_GREEN} type="Medium"/>
            </ButtonView>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.bottomSec}>
          <AppButton
            loading={isLoading}
            onPress={handleSubmit}
            title="Continue"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20 
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  circleBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    borderWidth: 1, borderColor: '#E0E0E0', 
    justifyContent: 'center', alignItems: 'center', marginRight: 8 
  },
  backBtn: { 
    paddingHorizontal: 25, height: 40, borderRadius: 20, 
    borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center' 
  },
  titleSection: { marginTop: Metrics.verticalScale(80), alignItems: 'center' },
  form: { marginTop: Metrics.verticalScale(40) },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 15, 
    alignItems: 'center' 
  },
  rememberMe: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { 
    width: 18, height: 18, borderWidth: 1, 
    borderColor: '#E0E0E0', borderRadius: 4, marginRight: 8 
  },
  bottomSec: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    paddingBottom: Metrics.verticalScale(30) 
  },
  continueBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.BRUNSWICK_GREEN,
    borderRadius: 100,
    height: 56,
  }
});

export default EnterPasswordScreen;