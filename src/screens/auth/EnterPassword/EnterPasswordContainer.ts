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

// Validation Schema
const signInSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Minimum 6 characters'),
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
        navigate(NavigationRoutes.AUTH_STACK.PAYMENT,{ phone: data?.user?.phone,pricing: data?.user?.subscription?.price })
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
      Toast.show({ type: 'error', text1: message || 'Login failed' });
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
        phone: params?.countryCallingCode + params?.phoneNo,
        code: params?.countryCallingCode,
        actualPhone: params?.phoneNo
      });

    },
    onError: ({ message }) => {
      Toast.show({ type: 'error', text1: message || 'Login failed' });
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      phone_number: params?.countryCallingCode + params?.phoneNo,
      password: data?.password,
    };
    // Remember Me logic
    if (data.rememberMe) {
      setRememberMe(true);
      setPhoneData(
        params?.phoneNo,
        params?.countryCca2,
        params?.countryCallingCode,
      );
      setPassword(data.password);
    } else {
      setRememberMe(false);
      clearCredentials();
    }
    loginPayload(payload);
  };

  const gotToVerifyOTP = () => {
    const payload = {
      phone_number: params?.countryCallingCode + params?.phoneNo,
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
