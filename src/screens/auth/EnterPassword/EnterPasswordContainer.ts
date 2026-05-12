import i18n, { getStoredLanguage } from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { forgotPasswordApi, loginApi } from '@/services/authApi';
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
} from '@/types/api/authTypes';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import { useRememberMeStore } from '@/store/useRememberMeStore';
import { usePhoneStore } from '@/store/usePhoneStore';
import { NotificationService } from '@/services/notification.service';

// Validation Schema
const signInSchema = yup.object().shape({
  password: yup
    .string()
    .required(i18n.t('auth.enter_password.validation_password_required'))
    .min(6, i18n.t('auth.enter_password.validation_password_min')),
  rememberMe: yup.boolean().default(false),
});

export default function useEnterPasswordContainer() {
  const {
    callingCode,
    cca2,
    clearCredentials,
    password,
    phoneNumber,
    rememberMe,
    setPhoneData,
    setRememberMe,
    setPassword,
  } = useRememberMeStore();
  const { setToken, setUser } = useAuthStore();
  const { clearPhoneData } = usePhoneStore()

  const { params } = useRoute();
  const { phone_number, phone_with_code, country_code } = params;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      password: password || '',
      rememberMe: rememberMe || false,
    },
  });

  // Login Mutation placeholder
  const {
    mutate: loginPayload,
    isPending,
    isIdle,
  } = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginApi,
    onSuccess: ({ data, message }) => {
      if (data?.is_first_login == 1) {
        navigate(NavigationRoutes.AUTH_STACK.UPDATE_PASSWORD, {
          userId: data?.user?.id,
        });
        return;
      }
      clearPhoneData()
      if (data?.user?.signup_step === 'step_1') {
        navigate(NavigationRoutes.AUTH_STACK.PAYMENT, {
          phone_number: data?.user?.phone,
          phone_with_code: data?.user?.phone_with_code,
          country_code: data?.user?.country_code,
          pricing: data?.user?.subscription?.price
        });
      }
      else if (data?.user?.signup_step === 'step_2') {
        setToken(data?.access_token);
        setUser(data?.user);
      }
      else {
        setToken(data?.access_token);
        setUser(data?.user);
      }
      Toast.show({ type: 'success', text1: message });
    },
    onError: ({ message }) => {
      Toast.show({ type: 'error', text1: message || i18n.t('auth.enter_password.login_failed') });
    },
  });

  // Forgot Mutation
  const {
    mutate: forgotPayload,
    isPending: isPendingForgot,
    isIdle: isIdleForgot,
  } = useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: forgotPasswordApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message });
      navigate(NavigationRoutes.AUTH_STACK.VERIFY_PHONE_NUMBER, {
        isLoginScreen: true,
        phone_number: phone_number,
        phone_with_code: phone_with_code,
        country_code: country_code,
      });

    },
    onError: ({ message }) => {
      Toast.show({ type: 'error', text1: message || i18n.t('auth.enter_password.login_failed') });
    },
  });

  const onSubmit = async (data: any) => {
    const token = await NotificationService.getToken();
    const payload = {
      country_code: country_code,        // previous screen se aya
      phone_number: phone_number,        // previous screen se aya
      phone_with_code: phone_with_code,  // previous screen se aya
      password: data?.password,
      fcm_token: token,
      language: getStoredLanguage(),
    };
    // Remember Me logic
    if (data.rememberMe) {
      setRememberMe(true);
      setPhoneData(phone_number, country_code, phone_with_code);
      setPassword(data.password);
    } else {
      setRememberMe(false);
      clearCredentials();
    }
    loginPayload(payload);
  };

  const gotToVerifyOTP = () => {
    const payload = {
      country_code: country_code,
      phone_number: phone_number,
      phone_with_code: phone_with_code,
    };
    forgotPayload(payload);
  };

  return {
    isLoading: (isPending && !isIdle) || (isPendingForgot && !isIdleForgot),
    control,
    errors,
    isValid,
    handleSubmit: handleSubmit(onSubmit),
    gotToVerifyOTP,
  };
}
