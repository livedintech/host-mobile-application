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

// Validation Schema
const signInSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Minimum 6 characters'),
  rememberMe: yup.boolean().default(false),
});

export default function useEnterPasswordContainer() {
  const { params } = useRoute();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      password: '',
      rememberMe: false,
    },
  });

  // Login Mutation placeholder
  const {
    mutate: loginPayload,
    isPending,
    isIdle,
  } = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginApi,
    onSuccess: ({ message }) => {
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
        phone: params
      });
    },
    onError: ({ message }) => {
      Toast.show({ type: 'error', text1: message || 'Login failed' });
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      phone_number: params,
      password: data?.password,
    };
    loginPayload(payload);
  };

  const gotToVerifyOTP = () => {
    const payload = {
      phone_number: params,
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
