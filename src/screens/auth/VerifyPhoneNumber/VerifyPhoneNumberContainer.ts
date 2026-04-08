import { useEffect, useCallback, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { OtpVerifyResponse, VerifyOtpPayload } from '@/types/api/authTypes';
import { resendOtpApi, verifyOtpApi } from '@/services/authApi';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const otpVerifySchema = yup.object().shape({
  otpCode: yup
    .string()
    .length(5, 'OTP must be exactly 5 digits')
    .required('Verification code is required'),
});

const RESEND_TIME_LIMIT = 60; // 60 seconds timer

export default function useVerifyPhoneNumberContainer() {
  const [timer, setTimer] = useState<number>(RESEND_TIME_LIMIT);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [resetKey, setResetKey] = useState(0); // Screen ke liye

  const { params } = useRoute();
  console.log('params', params);


  const actualPhone = (params as any)?.phone_number; // instead of params?.actualPhone
  const code = (params as any)?.phone_with_code;     // instead of params?.code
  const country_code = (params as any)?.country_code;
  const isLoginScreen = (params as any)?.isLoginScreen;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{ otpCode: string }>({
    defaultValues: { otpCode: '' },
    resolver: yupResolver(otpVerifySchema),
    mode: 'onChange',
  });

  const otpCode = watch('otpCode');

  // Verify OTP
  const {
    mutate: otpVerifyPayload,
    isPending,
    isIdle,
  } = useMutation<OtpVerifyResponse, Error, VerifyOtpPayload>({
    mutationFn: verifyOtpApi,
   onSuccess: ({ message }) => {
    Toast.show({ type: 'success', text1: message });

    const navParams = {
      country_code,      // e.g., 'SA'
      phone_number: actualPhone, // e.g., '123456789111'
      phone_with_code: code,     // e.g., '966'
      otp: otpCode,       // Only if login screen needs it
    };

    if (isLoginScreen) {
      navigate(NavigationRoutes.AUTH_STACK.ADD_NEW_PASSWORD, navParams);
    } else {
      navigate(NavigationRoutes.AUTH_STACK.MANAGE_LISTING, navParams);
    }
  },
  onError: ({ message }) => {
    Toast.show({ type: 'error', text1: message || 'Login failed' });
  },
  });

  // Resend OTP
  const {
    mutate: resendOtpPayload,
    isPending: isPendingResendOtp,
    isIdle: isIdleResendOtp,
  } = useMutation<OtpVerifyResponse, Error, VerifyOtpPayload>({
    mutationFn: resendOtpApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message });
      setTimer(RESEND_TIME_LIMIT);
      setIsResendDisabled(true);
    },
    onError: ({ message }) => {
      Toast.show({ type: 'error', text1: message || 'Login failed' });
    },
  });

  // ----------------- Timer Logic -----------------
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResendDisabled, timer]);

  // ----------------- Handlers -----------------

  const handleResendOtp = useCallback(() => {
    if (!isResendDisabled) {
      resendOtpPayload({
        country_code,
        phone_number: actualPhone,
        phone_with_code: code,
      });
    }
  }, [isResendDisabled, actualPhone, code, country_code]);

  const handleVerifyOtp = (data: { otpCode: string }) => {
    otpVerifyPayload({
      country_code,
      phone_number: actualPhone,
      phone_with_code: code,
      otp: data.otpCode,
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return {
    isLoading:
      (isPending && !isIdle) || (isPendingResendOtp && !isIdleResendOtp),
    control,
    errors,
    otpCode,
    timer,
    isResendDisabled,
    identifier: actualPhone,
    code,
    actualPhone,
    setValue,
    handleResendOtp,
    handleVerifyOtp: handleSubmit(handleVerifyOtp),
    formatTimer,
    setResetKey,
    resetKey,
    setIsResendDisabled,
    setTimer,
    RESEND_TIME_LIMIT,
  };
}
