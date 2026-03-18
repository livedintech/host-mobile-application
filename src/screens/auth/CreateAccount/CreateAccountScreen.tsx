// import React from 'react';
// import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import InputField from '@/components/molecules/Input/InputField';
// import PasswordField from '@/components/molecules/Input/PasswordField';
// import AppText from '@/components/molecules/AppText/AppText';
// import AppButton from '@/components/molecules/AppButton/AppButton';
// import Metrics from '@/utility/Metrics';
// import { Colors } from '@/theme/colors';
// import useCreateAccountContainer from './CreateAccountContainer';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const CreateAccountScreen = () => {
//     const { control, errors, handleSubmit, isLoading } = useCreateAccountContainer();

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Background Circles */}
//             <View style={styles.circleBgContainer} pointerEvents="none">
//                 <View style={styles.circleLarge} />
//                 <View style={styles.circleMedium} />
//             </View>

//             <KeyboardAvoidingView
//                 style={{ flex: 1 }}
//                 behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
//             >
//                 <ScrollView
//                     contentContainerStyle={styles.innerContainer}
//                     keyboardShouldPersistTaps="handled"
//                 >
//                     {/* Title Section */}
//                     <View style={styles.titleSection}>
//                         <AppText
//                             text="Create your free account"
//                             type="Bold"
//                             fontSize={28}
//                             textAlign="center"
//                             color={Colors.BRUNSWICK_GREEN}
//                         />
//                         <AppText
//                             text="Welcome to livedin. Let’s build a brighter hosting journey together."
//                             type="Regular"
//                             textAlign="center"
//                             color={Colors.BLACK}
//                             style={styles.subTitle}
//                         />
//                     </View>

//                     {/* Form Fields */}
//                     <View style={styles.form}>
//                         <InputField
//                             label="Full Name *"
//                             name="fullName"
//                             control={control}
//                             errors={errors}
//                             placeholder=""
//                         />
//                         <PasswordField
//                             label="Password *"
//                             name="password"
//                             control={control}
//                             errors={errors}
//                             placeholder=""
//                         />
//                         <AppText
//                             text="Please choose a stronger password. Try a mix of letters, numbers, and symbols."
//                             color={Colors.SUPER_GREY}
//                         />
//                     </View>

//                     {/* Submit Button */}
//                     <View style={styles.footer}>
//                         <AppButton
//                             onPress={handleSubmit}
//                             title="Next"
//                             loading={isLoading}
//                             style={styles.nextBtn}
//                         />
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// };

// export default CreateAccountScreen;

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: Colors.WHITE },
//     innerContainer: { flexGrow: 1, paddingHorizontal: Metrics.scale(25), justifyContent: 'center' },
//     titleSection: { marginBottom: Metrics.verticalScale(40) },
//     subTitle: { marginTop: 10, lineHeight: 24, paddingHorizontal: 10 },
//     form: { width: '100%' },
//     footer: { marginTop: Metrics.verticalScale(50) },
//     nextBtn: {
//         backgroundColor: Colors.WHITE,
//         borderWidth: 1,
//         borderColor: '#D1D1D1',
//         borderRadius: 100,
//     },
//     // Background Circles
//     circleBgContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
//     circleLarge: {
//         width: Metrics.screenWidth * 1.5,
//         height: Metrics.screenWidth * 1.5,
//         borderRadius: 1000,
//         borderWidth: 1,
//         borderColor: '#F9F9F9',
//         position: 'absolute'
//     },
//     circleMedium: {
//         width: Metrics.screenWidth * 0.9,
//         height: Metrics.screenWidth * 0.9,
//         borderRadius: 1000,
//         borderWidth: 1,
//         borderColor: '#F2F2F2',
//         position: 'absolute'
//     },
// });

import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';

import InputField from '@/components/molecules/Input/InputField';
import PasswordField from '@/components/molecules/Input/PasswordField';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { Colors } from '@/theme/colors';
import { s, vs } from 'react-native-size-matters';
import useCreateAccountContainer from './CreateAccountContainer';
import Checkbox from '@/components/molecules/Input/CheckBox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const FIGMA_TEAL = '#20957B';

const CreateAccountScreen = () => {
  const { control, errors, handleSubmit, isLoading } = useCreateAccountContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.mainContent}>
            {/* Title Section */}
            <View style={styles.textSection}>
              <AppText type="Bold" fontSize={32} color={Colors.BLACK} lineHeight={40} textAlign="center">
                Create Your Free{' '}
                <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>
                  Account
                </AppText>
              </AppText>
              <AppText
                text="Welcome to livedin. Let’s build a brighter hosting journey together."
                type="Regular"
                fontSize={16}
                color={Colors.BLACK}
                style={styles.subText}
                textAlign="center"
              />
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              <InputField
                label="Full Name *"
                name="fullName"
                control={control}
                errors={errors}
                placeholder=""
              />
              <PasswordField
                label="Password *"
                name="password"
                control={control}
                errors={errors}
                placeholder=""
              />
              <AppText
                text="Please choose a stronger password. Try a mix of letters, numbers, and symbols."
                fontSize={13}
                color={Colors.DARK_CHARCOAL}
                style={styles.passwordHint}
              />
            </View>

            {/* Terms and Conditions Section */}
            <View style={styles.termsWrapper}>
              <Controller
                control={control}
                name="agreeToTerms"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    isChecked={!!value}
                    onPress={() => onChange(!value)}
                  />
                )}
              />
              <AppText fontSize={13} color={Colors.BLACK} style={styles.termsText}>
                I confirm that I have read and accept the{' '}
                <AppText fontSize={13} color={Colors.BLACK} style={styles.underline}>terms and conditions</AppText>
                {' '}and{' '}
                <AppText fontSize={13} color={Colors.BLACK} style={styles.underline}>privacy policy</AppText>
              </AppText>
            </View>

            {/* Action Button */}
            <View style={styles.bottomSec}>
              <AppButton
                loading={isLoading}
                onPress={handleSubmit}
                title="Next"
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
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: s(24),
    paddingTop: vs(20),
    alignItems: 'center',
  },
  textSection: {
    width: '100%',
    marginBottom: vs(30),
  },
  subText: {
    marginTop: vs(10),
    lineHeight: 22,
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  passwordHint: {
    marginTop: vs(8),
    lineHeight: 18,
    opacity: 0.6,
  },
  termsWrapper: {
    flexDirection: 'row',
    marginTop: vs(20),
    width: '100%',
    paddingRight: s(20),
  },
  checkbox: {
    marginRight: s(12),
    marginTop: 2,
  },
  termsText: {
    lineHeight: 18,
    flex: 1,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  bottomSec: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: vs(30),
    marginTop: vs(20),
  },
});

export default CreateAccountScreen;
