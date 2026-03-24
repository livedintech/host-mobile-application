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
import { useState } from 'react';
import { usePhoneStore } from '@/store/usePhoneStore';
import { useRememberMeStore } from '@/store/useRememberMeStore';
import { GoogleSignin, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import appleAuth, {
  AppleRequestOperation,
  AppleRequestScope,
  AppleCredentialState,
} from '@invertase/react-native-apple-authentication';
import { storage } from '@/storage/mmkv';

export default function useLoginWithPhoneContainer() {
  const { cca2, callingCode, phoneNumber: storePhoneNo, rememberMe, setRememberMe } = useRememberMeStore();
  const setPhoneData = usePhoneStore((state) => state.setPhoneData);
  const [phoneNumber, setphoneNumber] = useState('');
  const { setToken, setUser } = useAuthStore()

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
      // Navigate ONLY after the OTP has been successfully sent

      navigate(NavigationRoutes.AUTH_STACK.VERIFY_PHONE_NUMBER, {
        isLoginScreen: false,
        phone: countryCallingCode + phoneNo,
        code: countryCallingCode,
        actualPhone: phoneNo
      });
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
      const payload = {
        countryCca2,
        countryCallingCode,
        phoneNo
      };
      navigate(NavigationRoutes.AUTH_STACK.ENTER_PASSWORD, payload);
    },
    onError: error => {
      if (error?.message === 'User not found') {
        setPhoneData({ phoneNumber: phoneNumber });

        // Trigger the OTP send here
        sendOtpForNewUser({ phone_number: phoneNumber });
      } else {
        Toast.show({
          type: 'error',
          text1: error.message || 'Something went wrong',
        });
      }
    },
  });

  const onSubmit = async (data: checkUserisExistFormValues) => {
    const fullPhone = data?.country?.callingCode + data?.phoneNumber;
    setphoneNumber(fullPhone);
    checkUserPayload({ phone_number: fullPhone });
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
          text1: result?.message || 'Logged in successfully',
        });
      }
    } catch (error: any) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Google Sign-In error', error.message);
      }
    }
  };

  // ----------------- Apple Sign In -----------------
  const handleAppleSignIn = async () => {
    try {
      const appleAuthResponse = await appleAuth.performRequest({
        requestedOperation: 0, // LOGIN
        requestedScopes: [0, 1], // FULL_NAME, EMAIL
      });
 
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthResponse.user,
      );
 
      if (credentialState !== 1) { // 1 = AUTHORIZED
        Alert.alert('Apple Sign-In', 'Authorization failed. Please try again.');
        return;
      }
 
      const APPLE_USER_KEY = `apple_user_${appleAuthResponse.user}`;
 
      let email = appleAuthResponse.email || '';
      let name = appleAuthResponse.fullName
        ? `${appleAuthResponse.fullName.givenName || ''} ${appleAuthResponse.fullName.familyName || ''}`.trim()
        : '';
 
      if (email) {
        // Pehli baar — email mil gayi, store kar lo
        storage.set(APPLE_USER_KEY, JSON.stringify({ email, name }));
      } else {
        // Doosri baar — stored data se lo
        const stored = storage.getString(APPLE_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          email = parsed.email || '';
          name = name || parsed.name || '';
        }
      }
 
      const result = await socialAuthApi({
        sub: appleAuthResponse.user,
        name,
        email,
        fcm_token: '',
      });

      console.log('Apple Response:', {
  user: appleAuthResponse.user,
  email: appleAuthResponse.email,
  fullName: appleAuthResponse.fullName,
});

console.log('Final email being sent:', email);
console.log('Final name being sent:', name);
 
      setToken(result?.access_token);
      setUser(result?.user);
      Toast.show({
        type: 'success',
        text1: result?.message || 'Logged in successfully',
      });
    } catch (error: any) {
      // 1000 = user cancelled Apple sign-in
      if (error.code !== '1000') {
        Alert.alert('Apple Sign-In error', error.message);
      }
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
