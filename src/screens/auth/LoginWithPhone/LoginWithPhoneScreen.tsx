import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useLoginWithPhoneContainer from './LoginWithPhoneContainer';
import { configureGoogleSignIn } from '@/services/googleConfig';
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { socialAuthApi } from '@/services/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { s, vs } from 'react-native-size-matters';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Checkbox from '@/components/molecules/Input/CheckBox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import DeviceInfo from 'react-native-device-info';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Metrics from '@/utility/Metrics';


const FIGMA_TEAL = '#20957B';

const LoginWithPhoneScreen = () => {
  const { control, errors, handleSubmit, isLoading, onSubmit, rememberMe, setRememberMe, handleAppleSignIn, handleGoogleSignIn } = useLoginWithPhoneContainer();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);


  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.keyboardAvoidingView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
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

            <View>
              <PhoneInputField
                label="Phone Number*"
                control={control}
                errors={errors}
                countryFieldName="country"
                phoneFieldName="phoneNumber"
              />
            </View>

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
                />
              </View>
            </View>

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

            <View style={styles.separatorRow}>
              <View style={styles.line} />
              <AppText text="Or" fontSize={14} color={Colors.NIGHT_OPACITY} mx={15} />
              <View style={styles.line} />
            </View>

            <View style={styles.socialWrapper}>
              <ButtonView
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
                activeOpacity={0.8}
                mb={15}
              >
                <Svgicons path="google" size={14} />
                <AppText text="Continue with Google" fontSize={14} ml={10} color={Colors.BLACK} />
              </ButtonView>
              {Platform.OS === 'ios' && (
                <ButtonView
                  style={styles.socialButton}
                  onPress={handleAppleSignIn}
                  activeOpacity={0.8}>
                  <Svgicons path="apple" size={14} />
                  <AppText text="Continue with Apple" fontSize={14} ml={10} color={Colors.BLACK} />
                </ButtonView>
              )}
            </View>
          </View>
          <AppText textAlign='center' text={`v${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`} />

        </KeyboardAwareScrollView>
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
  headerSection: { marginBottom: vs(50) },
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
  line: { flex: 1, height: 1, backgroundColor: '#EAEAEA' },
  socialWrapper: { width: '100%' },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrics.verticalScale(48),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
});

export default LoginWithPhoneScreen;