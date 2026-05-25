import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  checkUserisExistFormValues,
  checkUserisExistSchema
} from '@/validation/auth/authSchemas';
import { useMutation } from '@tanstack/react-query';
import {
  CheckUserExistPayload,
  CheckUserExistResponse
} from '@/types/api/authTypes';
import { CheckUserApi, resendOtpApi, socialAuthApi } from '@/services/authApi'; // Import resendOtpApi
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useState, useRef } from 'react';
import { usePhoneStore } from '@/store/usePhoneStore';
import { useRememberMeStore } from '@/store/useRememberMeStore';
import { GoogleSignin, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import appleAuth from '@invertase/react-native-apple-authentication';

import { storage } from '@/storage/mmkv';

export default function useLoginWithPhoneContainer() {
  const { cca2, callingCode, phoneNumber: storePhoneNo, rememberMe, setRememberMe } = useRememberMeStore();
  const setPhoneData = usePhoneStore((state) => state.setPhoneData);
  const [phoneNumber, setphoneNumber] = useState('');
  const { setToken, setUser } = useAuthStore()
  const isDeletedUserFlow = useRef(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<checkUserisExistFormValues>({
    resolver: yupResolver(checkUserisExistSchema),
    defaultValues: {
      country: { cca2: cca2 || 'SA', callingCode: callingCode || '966' },
      phoneNumber: storePhoneNo || '',
    },
  });

  const countryCca2 = watch('country')?.cca2;
  const countryCallingCode = watch('country')?.callingCode;
  const phoneNo = watch('phoneNumber');

  // --- 1. Mutation to Send OTP (to be called if user is not found) ---
  const { mutate: sendOtpForNewUser, isPending: isSendingOtp } = useMutation({
    mutationFn: resendOtpApi,
    onSuccess: () => {
      navigate(NavigationRoutes.AUTH_STACK.VERIFY_PHONE_NUMBER, {
        isLoginScreen: isDeletedUserFlow.current,
        country_code: countryCca2,
        phone_number: phoneNo,
        phone_with_code: countryCallingCode,
      });
      isDeletedUserFlow.current = false;
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Failed to send verification code',
      });
    }
  });

  // --- 2. Mutation to Check User Existence ---
  const {
    mutate: checkUserPayload,
    isPending,
    isIdle,
  } = useMutation<CheckUserExistResponse, Error, CheckUserExistPayload>({
    mutationFn: CheckUserApi,
    onSuccess: () => {
      navigate(NavigationRoutes.AUTH_STACK.ENTER_PASSWORD, {
        country_code: countryCca2,
        phone_number: phoneNo,
        phone_with_code: countryCallingCode,
      });
    },
    onError: error => {
      if (error?.message === 'User not found') {
        setPhoneData({ phoneNumber: phoneNumber });
        sendOtpForNewUser({
          country_code: countryCca2,
          phone_number: phoneNo,
          phone_with_code: countryCallingCode,
        });
      } else if ((error as any)?.is_deleted === 1) {
        isDeletedUserFlow.current = true;
        sendOtpForNewUser({
          country_code: countryCca2,
          phone_number: phoneNo,
          phone_with_code: countryCallingCode,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: error.message || i18n.t('common.toast.something_went_wrong'),
        });
      }
    },
  });

  const onSubmit = async (data: checkUserisExistFormValues) => {
    const countryCode = data?.country?.cca2; // e.g., 'PK'
    const callingCode = data?.country?.callingCode; // e.g., '92'
    const localPhone = data?.phoneNumber; // e.g., '3001234567'
    const fullPhone = callingCode + localPhone; // e.g., '923001234567'

    setphoneNumber(fullPhone);

    checkUserPayload({
      country_code: countryCca2,
      phone_number: phoneNo,
      phone_with_code: countryCallingCode,
    });
  };

  // ----------------- Google Sign In -----------------
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { user } = response.data;
        const result = await socialAuthApi({
          sub: user.id,
          name: user.name || '',
          email: user.email,
          fcm_token: '',
        });
        setToken(result?.access_token);
        setUser(result?.user);
        Toast.show({
          type: 'success',
          text1: result?.message || i18n.t('auth.login.logged_in_success'),
        });
      }
    } catch (error: any) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert(i18n.t('auth.login.google_signin_error'), error.message);
      }
    }
  };

  // ----------------- Apple Sign In -----------------
  const handleAppleSignIn = async () => {
    try {
      if (!appleAuth.isSupported) {
        Alert.alert(i18n.t('auth.login.apple_signin_title'), i18n.t('auth.login.apple_signin_unsupported'));
        return;
      }

      const appleAuthResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [
          appleAuth.Scope.FULL_NAME,
          appleAuth.Scope.EMAIL,
        ],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthResponse.user,
      );

      if (credentialState !== appleAuth.State.AUTHORIZED) {
        Alert.alert(i18n.t('auth.login.apple_signin_title'), i18n.t('auth.login.apple_signin_auth_failed'));
        return;
      }

      const APPLE_USER_KEY = `apple_user_${appleAuthResponse.user}`;

      let email = appleAuthResponse.email || '';
      let name = appleAuthResponse.fullName
        ? `${appleAuthResponse.fullName.givenName || ''} ${appleAuthResponse.fullName.familyName || ''}`.trim()
        : '';

      if (email) {
        storage.set(APPLE_USER_KEY, JSON.stringify({ email, name }));
      } else {
        const stored = storage.getString(APPLE_USER_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            email = parsed?.email || '';
            name = name || parsed?.name || '';
          } catch {
            email = '';
          }
        }
      }

      if (!email) {
        Alert.alert(
          i18n.t('auth.login.apple_signin_title'),
          i18n.t('auth.login.apple_signin_no_email'),
        );
        return;
      }

      const result = await socialAuthApi({
        sub: appleAuthResponse.user,
        name,
        email,
        fcm_token: '',
      });

      setToken(result?.access_token);
      setUser(result?.user);
      Toast.show({
        type: 'success',
        text1: result?.message || i18n.t('auth.login.logged_in_success'),
      });

    } catch (error: any) {
      if (error.code === '1000' || error.code === 'ERR_CANCELED') return;
      Alert.alert(i18n.t('auth.login.apple_signin_error_title'), error?.message || i18n.t('common.toast.something_went_wrong'));
    }
  };

  return {
    // Combine loading states so the button shows spinner during both calls
    isLoading: (isPending && !isIdle) || isSendingOtp,
    control,
    errors,
    watch,
    handleSubmit,
    onSubmit,
    rememberMe,
    setRememberMe,
    handleGoogleSignIn,
    handleAppleSignIn
  };
}
