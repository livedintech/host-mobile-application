import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import useLoginWithPhoneContainer from './LoginWithPhoneContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Metrics from '@/utility/Metrics';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginWithPhoneScreen = () => {
  const { control, errors, handleSubmit, isLoading, onSubmit, } =
    useLoginWithPhoneContainer();
  return (
    <SafeAreaView style={styles.container}>
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
            fontSize={30}
            px={30}
            mb={43}
          />
          <PhoneInputField
            label="Phone Number*"
            control={control}
            errors={errors}
            countryFieldName="country"
            phoneFieldName="phoneNumber"
          />
        </View>
        <AppButton
          title="Next"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
         
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  headerRight: { flexDirection: 'row', gap: 10 },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#D1D1D1',
    justifyContent: 'center',
    // alignItems: 'center',
    borderWidth: 1,
  },
  backBtn: {
    paddingHorizontal: 25,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    justifyContent: 'center',
  },
  centerContent: { flex: 1, justifyContent: 'center' },
  inputWrapper: {
    flexDirection: 'row',
    height: 60,
    borderWidth: 1,
    borderColor: '#0D3D39',
    borderRadius: 8,
    overflow: 'hidden',
  },
  countryPicker: {
    width: 70,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRightWidth: 1,
    borderRightColor: '#D1D1D1',
  },
  flagPlaceholder: { width: 24, height: 16, backgroundColor: '#006C35' },
  textInput: { flex: 1, paddingHorizontal: 15, fontSize: 16, color: '#000' },
  nextBtn: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 100,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  circleLarge: {
    width: Metrics.screenWidth * 1.5,
    height: Metrics.screenWidth * 1.5,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    position: 'absolute',
  },
  circleMedium: {
    width: Metrics.screenWidth * 1.1,
    height: Metrics.screenWidth * 1.1,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F4F4F4',
    position: 'absolute',
  },
  circleSmall: {
    width: Metrics.screenWidth * 0.7,
    height: Metrics.screenWidth * 0.7,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'absolute',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default LoginWithPhoneScreen;
