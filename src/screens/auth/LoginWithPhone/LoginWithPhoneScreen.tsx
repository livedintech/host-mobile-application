import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Metrics from '@/utility/Metrics';
import useLoginWithPhoneContainer from './LoginWithPhoneContainer';
import { configureGoogleSignIn } from '@/services/googleConfig';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

const LoginWithPhoneScreen = () => {
  const { control, errors, handleSubmit, isLoading, onSubmit } = useLoginWithPhoneContainer();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      Alert.alert(JSON.stringify(userInfo))
    } catch (error: any) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Google Sign-In error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background circles */}
      <View style={styles.circleContainer} pointerEvents="none">
        <View style={styles.circleLarge} />
        <View style={styles.circleMedium} />
        <View style={styles.circleSmall} />
      </View>

      <View style={styles.content}>
        <View style={styles.centerContent}>
          <AppText
            text="Please enter your phone number to continue."
            textAlign="center"
            fontSize={28}
            px={20}
            mb={40}
          />
          <PhoneInputField
            label="Phone Number*"
            control={control}
            errors={errors}
            countryFieldName="country"
            phoneFieldName="phoneNumber"
          />
        </View>

        {/* 1. Next Button (Original Component) */}
        <AppButton
          title="Next"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />

        {/* 2. "Or" Separator Section */}
        <View style={styles.separatorRow}>
          <View style={styles.line} />
          <View style={{ marginHorizontal: 16 }}>
             <AppText text="Or" fontSize={16} />
          </View>
          <View style={styles.line} />
        </View>

        {/* 3. Social Login Buttons */}
        <View style={styles.socialWrapper}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
            <View style={styles.iconWrapper}>
              <Svgicons path="google" size={20} />
            </View>
            <AppText text="Continue with Google" fontSize={16} />
          </TouchableOpacity>

          {/* <TouchableOpacity style={[styles.socialButton, { marginTop: 16 }]} onPress={() => {}}>
            <View style={styles.iconWrapper}>
              <Svgicons path="apple" size={20} />
            </View>
            <AppText text="Continue with Apple" fontSize={16} />
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 24, paddingBottom: 40 },
  centerContent: { flex: 1, justifyContent: 'center' },

  iconWrapper: {
    marginRight: 12, // This provides the pixel-perfect gap seen in the SS
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Pixel Perfect Separator
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE', // Very light grey from SS
  },

  // Social Button Styling
  socialWrapper: {
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 100, // Pill shape
    borderWidth: 1,
    borderColor: '#E0E0E0', // Subtle border
    backgroundColor: '#FFFFFF',
  },

  // Circles
  circleContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  circleLarge: { width: Metrics.screenWidth * 1.5, height: Metrics.screenWidth * 1.5, borderRadius: 1000, borderWidth: 1, borderColor: '#F8F8F8', position: 'absolute' },
  circleMedium: { width: Metrics.screenWidth * 1.1, height: Metrics.screenWidth * 1.1, borderRadius: 1000, borderWidth: 1, borderColor: '#F4F4F4', position: 'absolute' },
  circleSmall: { width: Metrics.screenWidth * 0.7, height: Metrics.screenWidth * 0.7, borderRadius: 1000, borderWidth: 1, borderColor: '#F0F0F0', position: 'absolute' },
});

export default LoginWithPhoneScreen;