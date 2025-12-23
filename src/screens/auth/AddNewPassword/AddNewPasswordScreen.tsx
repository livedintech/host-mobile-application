import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import PasswordField from '@/components/molecules/Input/PasswordField';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useAddNewPasswordContainer from './AddNewPasswordContainer';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddNewPasswordScreen = () => {
  const { isLoading, control, errors, handleSubmit, } = useAddNewPasswordContainer();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <AppText 
            text="Please enter your new Password." 
            fontSize={32} 
            type="Medium" 
            color={Colors.PINE_FOREST} 
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

          <View style={{ marginTop: 20 }}>
            <PasswordField
              label="Confirm Password *"
              name="confirmPassword"
              control={control}
              errors={errors}
              placeholder=""
            />
          </View>

          {/* Password Strength Hint */}
          <AppText 
            text="Please choose a stronger password. Try a mix of letters, numbers, and symbols." 
            fontSize={12} 
            color="#707070" 
            mt={15} 
            lineHeight={18}
          />
        </View>

        {/* Continue Button */}
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
  titleSection: { 
    marginTop: Metrics.verticalScale(80), 
    alignItems: 'center',
    paddingHorizontal: 10
  },
  form: { marginTop: Metrics.verticalScale(40) },
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

export default AddNewPasswordScreen;