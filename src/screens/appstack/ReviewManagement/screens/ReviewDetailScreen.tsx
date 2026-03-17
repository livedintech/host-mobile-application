import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { configureGoogleSignIn } from '@/services/googleConfig';
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { socialAuthApi } from '@/services/authApi';
import { SocialAuthPayload } from '@/types/api/authTypes';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { s, vs } from 'react-native-size-matters';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Checkbox from '@/components/molecules/Input/CheckBox';
import useLoginWithPhoneContainer from '@/screens/auth/LoginWithPhone/LoginWithPhoneContainer';

// The exact Figma shade you requested
const FIGMA_TEAL = '#20957B';

const LoginWithPhoneScreen = () => {
  const { control, errors, handleSubmit, isLoading, onSubmit } = useLoginWithPhoneContainer();
  const { setToken, setUser } = useAuthStore();
  // const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { user } = response.data;
        const payload: SocialAuthPayload = {
          sub: user.id,
          name: user.name || '',
          email: user.email,
          fcm_token: '',
        };

        const result = await socialAuthApi(payload);
        setToken(result?.access_token);
        setUser(result?.user);
        Toast.show({ type: 'success', text1: result?.message || 'Logged in successfully' });
      }
    } catch (error: any) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Google Sign-In error', error.message);
      }
    }
  };

  // Restored: handleOnAppleLogin
  // const handleOnAppleLogin = async () => {
  //   setIsAppleLoading(true);
  //   try {
  //     const { error, userInfo } = await appleAuthLogin();
  //     if (error || !userInfo) return;

  //     const payload: SocialAuthPayload = {
  //       email: userInfo.email || '',
  //       name: userInfo.fullName?.givenName || '',
  //       sub: userInfo.user,
  //       fcm_token: '',
  //     };
      
  //     const result = await socialAuthApi(payload);
  //     setToken(result?.access_token);
  //     setUser(result?.user);
  //     Toast.show({ type: 'success', text1: "Logged in successfully" });
  //   } catch (err) {
  //     console.log('❌ Error in handleOnAppleLogin:', err);
  //   } finally {
  //     setIsAppleLoading(false);
  //   }
  // };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Header Text Section */}
              <View style={styles.headerSection}>
                <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                  Please enter your
                </AppText>
                <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                  phone number to
                </AppText>
                <AppText type="Bold" fontSize={32} color={FIGMA_TEAL} lineHeight={40}>
                  continue
                </AppText>
              </View>

              {/* Input Section */}
              <View style={styles.inputSection}>
                <PhoneInputField
                  label="Phone Number*"
                  control={control}
                  errors={errors}
                  countryFieldName="country"
                  phoneFieldName="phoneNumber"
                />
              </View>

              {/* Remember Me Row - Aligned Right */}
              <View style={styles.rememberMeRow}>
                <View style={styles.rememberMeContainer}>
                  <Checkbox
                    isChecked={rememberMe}
                    onPress={() => setRememberMe(!rememberMe)}
                  />
                  <AppText 
                    text="Remember me" 
                    color={Colors.PINE_FOREST} 
                    type="Medium" 
                    fontSize={14} 
                    ml={s(8)} 
                  />
                </View>
              </View>

              {/* Main Action Button */}
              <AppButton
                title="Next"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                backgroundColor={FIGMA_TEAL}
                color={Colors.WHITE}
                borderRadius={100}
                mt={vs(10)}
                fontSize={18}
                type="Bold"
              />

              {/* Or Separator */}
              <View style={styles.separatorRow}>
                <View style={styles.line} />
                <AppText text="Or" fontSize={14} color={Colors.NIGHT_OPACITY} mx={15} />
                <View style={styles.line} />
              </View>

              {/* Social Logins */}
              <View style={styles.socialWrapper}>
                <TouchableOpacity 
                    style={styles.socialButton} 
                    onPress={handleGoogleSignIn}
                    activeOpacity={0.8}
                >
                  <Svgicons path="google" size={20} />
                  <AppText text="Continue with Google" fontSize={16} ml={10} color={Colors.BLACK} />
                </TouchableOpacity>

                {/* Restored Apple Button Placeholder */}
                {/* <TouchableOpacity 
                    style={[styles.socialButton, { marginTop: 16 }]} 
                    onPress={handleOnAppleLogin}
                    activeOpacity={0.8}
                >
                  <Svgicons path="apple" size={20} />
                  <AppText text="Continue with Apple" fontSize={16} ml={10} color={Colors.BLACK} />
                </TouchableOpacity> */}
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
  keyboardAvoidingView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { 
    flex: 1, 
    paddingHorizontal: s(24), 
    paddingTop: vs(60), 
    paddingBottom: vs(20) 
  },
  headerSection: {
    marginBottom: vs(50),
  },
  inputSection: {
    marginBottom: vs(15),
  },
  rememberMeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: vs(25),
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: vs(25),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  socialWrapper: {
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: vs(54),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default LoginWithPhoneScreen;