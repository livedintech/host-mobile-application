import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { CheckUserApi, resendOtpApi } from '@/services/authApi';

const CALLING_CODES: Record<string, string> = {
  '966': 'SA',
  '92':  'PK',
  '971': 'AE',
  '973': 'BH',
  '965': 'KW',
  '968': 'OM',
  '974': 'QA',
  '1':   'US',
};

function parsePhone(phone: string): { country_code: string; phone_with_code: string; phone_number: string } {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');

  if (cleaned.startsWith('+')) {
    const digits = cleaned.slice(1);
    const sortedCodes = Object.keys(CALLING_CODES).sort((a, b) => b.length - a.length);
    for (const code of sortedCodes) {
      if (digits.startsWith(code)) {
        return {
          country_code:    CALLING_CODES[code],
          phone_with_code: code,
          phone_number:    digits.slice(code.length),
        };
      }
    }
  }

  return {
    country_code:    'SA',
    phone_with_code: '966',
    phone_number:    cleaned.replace(/^0/, ''),
  };
}

const DeepLinkHandlerScreen = ({ route, navigation }: any) => {
  const params         = route?.params ?? {};
  const parsedPhoneRef = useRef<ReturnType<typeof parsePhone> | null>(null);

  const goToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE }],
      })
    );
  };

  const { mutate: sendOtp } = useMutation({
    mutationFn: resendOtpApi,
    onSuccess: () => {
      const p = parsedPhoneRef.current!;
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE },
            {
              name: NavigationRoutes.AUTH_STACK.VERIFY_PHONE_NUMBER,
              params: {
                isLoginScreen:   false,
                isDeepLink:      true,
                country_code:    p.country_code,
                phone_number:    p.phone_number,
                phone_with_code: p.phone_with_code,
                dl_listing:      params.listing  || '',
                dl_name:         params.name     || '',
                dl_email:        params.email    || '',
                dl_phone:        params.phone    || '',
                dl_country:      params.country  || '',
                dl_state:        params.state    || '',
                dl_city:         params.city     || '',
                dl_district:     params.district || '',
                dl_ref:          params.ref      || '',
              },
            },
          ],
        })
      );
    },
    onError: () => {
      Toast.show({ type: 'error', text1: 'Failed to send OTP. Please try again.' });
      goToLogin();
    },
  });

  const { mutate: checkUser } = useMutation({
    mutationFn: CheckUserApi,
    onSuccess: () => {
      goToLogin();
    },
    onError: (error: any) => {
      if (error?.message === 'User not found') {
        const p = parsedPhoneRef.current!;
        sendOtp({
          country_code:    p.country_code,
          phone_number:    p.phone_number,
          phone_with_code: p.phone_with_code,
        });
      } else {
        goToLogin();
      }
    },
  });

  useEffect(() => {
    const { phone } = params;

    if (!phone) {
      goToLogin();
      return;
    }

    const parsedPhone      = parsePhone(phone);
    parsedPhoneRef.current = parsedPhone;

    checkUser({
      country_code:    parsedPhone.country_code,
      phone_number:    parsedPhone.phone_number,
      phone_with_code: parsedPhone.phone_with_code,
    });
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default DeepLinkHandlerScreen;
