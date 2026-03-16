import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import InputField from '@/components/molecules/Input/InputField';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import useGathrenCreateAccountContainer from './GathrenCreateAccountContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const GathrenCreateAccountScreen = () => {
  const { control, errors, handleSubmit, onNext, onCreateAccount, isLoading } =
    useGathrenCreateAccountContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
    <View style={styles.container}>
      {/* <View style={styles.circleBg} /> */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleSection}>
          <AppText
            text="Create Gathern Account"
            fontSize={32}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
            textAlign="center"
          />
        </View>

        <View style={styles.formSection}>

          {/* Gender */}
          <DropdownField
            name="gender"
            control={control}
            errors={errors}
            label="Gender*"
            placeholder="Select Gender"
            data={GENDER_OPTIONS}
            rules={{ required: 'Gender is required' }}
          />

          {/* First Name */}
          <InputField
            name="firstname"
            control={control}
            errors={errors}
            label="First Name*"
            placeholder="Enter First Name"
            rules={{ required: 'First name is required' }}
          />

          {/* Last Name */}
          <InputField
            name="lastname"
            control={control}
            errors={errors}
            label="Last Name*"
            placeholder="Enter Last Name"
            rules={{ required: 'Last name is required' }}
          />

          {/* Username */}
          <InputField
            name="username"
            control={control}
            errors={errors}
            label="Username*"
            placeholder="Enter Username"
            rules={{ required: 'Username is required' }}
          />

          {/* Email */}
          <InputField
            name="email"
            control={control}
            errors={errors}
            label="Email*"
            placeholder="Enter Email"
            keyboardType="email-address"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            }}
          />

          {/* Phone */}
          <PhoneInputField
            control={control}
            errors={errors}
            label="Mobile*"
            countryFieldName="country"
            phoneFieldName="mobile"
          />

        </View>

        <View style={styles.footer}>
          <AppButton
            loading={isLoading}
            onPress={handleSubmit(onNext)}
            title="Next"
            mb={10}
          />
          <AppButton
            disabled={isLoading}
            onPress={onCreateAccount}
            title="Create New Account"
          />
        </View>
      </ScrollView>
    </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1},
  circleBg: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 600,
    height: 600,
    borderRadius: 300,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    zIndex: -1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  titleSection: {
    marginTop: 60,
    marginBottom: 40,
  },
  formSection: {
    flex: 1,
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default GathrenCreateAccountScreen;