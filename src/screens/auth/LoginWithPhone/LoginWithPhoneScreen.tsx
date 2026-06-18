import React, { useEffect } from 'react';
import {
  View,
  StyleSheet, Platform,
  I18nManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useLoginWithPhoneContainer from './LoginWithPhoneContainer';
import { configureGoogleSignIn } from '@/services/googleConfig';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors } from '@/theme/colors';
import { s, vs } from 'react-native-size-matters';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Checkbox from '@/components/molecules/Input/CheckBox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import DeviceInfo from 'react-native-device-info';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { useTranslation } from 'react-i18next';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { CrashlyticsService } from '@/services/crashlytics.service';


const FIGMA_TEAL = Colors.PRIMARY_TEAL;

const LoginWithPhoneScreen = () => {
  
  const { control, errors, handleSubmit, isLoading, onSubmit, rememberMe, setRememberMe, handleAppleSignIn, handleGoogleSignIn } = useLoginWithPhoneContainer();
  const { t } = useTranslation();

  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAwareScrollView
        style={{ flex: 1, }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <AppText type="Regular" fontSize={30} color={Colors.BLACK} lineHeight={40}>
              {t('auth.login.title_1')}
            </AppText>
            <AppText type="Regular" fontSize={30} color={Colors.BLACK} lineHeight={40}>
              {t('auth.login.title_2')}
            </AppText>
            <AppText type="SemiBold" fontSize={30} color={FIGMA_TEAL} lineHeight={40}>
              {t('auth.login.title_3')}
            </AppText>
          </View>

          <View style={styles.inputWrapper}>
            <PhoneInputField
              label={t('auth.login.phone_label')}
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
                text={t('auth.login.remember_me')}
                color={Colors.DARK_1C}
                type="Medium"
                fontSize={12}
                ml={s(8)}
              />
            </View>
          </View>

          <AppButton
            title={t('auth.login.next')}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            backgroundColor={FIGMA_TEAL}
            color={Colors.WHITE}
            borderRadius={100}
            mt={vs(30)}
            mb={vs(30)}
            fontSize={16}
            type="Regular"
          />

          {/* {__DEV__ && ( */}
            <AppButton
              title="Test Crash"
              onPress={() => CrashlyticsService.testCrash()}
              backgroundColor={Colors.INDIAN_RED}
              mb={vs(15)}
              color={Colors.WHITE}
              borderRadius={100}
              fontSize={14}
              type="Regular"
            />
          {/* )} */}

          <View style={styles.separatorRow}>
            <View style={styles.line} />
            <AppText text={t('common.or')} fontSize={14} color={Colors.NIGHT_OPACITY} mx={15} />
            <View style={styles.line} />
          </View>

          <View style={styles.socialWrapper}>
            <ButtonView
              style={styles.socialButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
              mb={vs(12)}
            >
              <Svgicons path="google" size={18} />
              <AppText text={t('auth.login.continue_google')} fontSize={14} style={{
                marginLeft: I18nManager.isRTL ? 0 : 10,
                marginRight: I18nManager.isRTL ? 10 : 0,
              }} color={Colors.BLACK} />
            </ButtonView>
            {Platform.OS === 'ios' && (
              <ButtonView
                style={styles.socialButton}
                onPress={handleAppleSignIn}
                activeOpacity={0.8}>
                <Svgicons path="apple" size={14} />
                <AppText text={t('auth.login.continue_apple')} fontSize={14} style={{
                  marginLeft: I18nManager.isRTL ? 0 : 10,
                  marginRight: I18nManager.isRTL ? 10 : 0,
                }} color={Colors.BLACK} />
              </ButtonView>
            )}
          </View>
        </View>

        <AppText
          textAlign='center'
          style={styles.versionText}
          text={`v${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}
        />
      </KeyboardAwareScrollView>

    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Metrics.baseMargin, paddingTop: Platform.OS === 'ios' ? vs(60) : vs(40), },
  headerSection: {
    marginBottom: vs(25)
  },
  inputWrapper: {
    marginBottom: vs(10)
  },
  rememberMeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: vs(15),
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: vs(15), // Reduced from 25
  },
  line: { flex: 1, height: 1, backgroundColor: '#EAEAEA' },
  socialWrapper: { width: '100%' },
  socialButton: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: vs(48),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  versionText: {
    marginBottom: vs(15),
    opacity: 0.5,
    fontSize: 12
  }
});

export default LoginWithPhoneScreen;