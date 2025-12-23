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

/**
 * Validation Schema: Screenshot mein 5 digits hain,
 * isliye length(5) set ki gayi hai.
 */
const otpVerifySchema = yup.object().shape({
  otpCode: yup
    .string()
    .length(4, 'OTP must be exactly 4 digits')
    .required('Verification code is required'),
});

const RESEND_TIME_LIMIT = 60; // 60 seconds timer

export default function useVerifyPhoneNumberContainer() {
  const [timer, setTimer] = useState<number>(RESEND_TIME_LIMIT);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const { params } = useRoute();
  const phone = params?.phone;
  const listing_count = params?.listing_count;

  const isLoginScreen = params?.isLoginScreen;
  console.log('params', params);

  const {
    control,
    handleSubmit,
    watch,
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
      if (isLoginScreen) {
        navigate(NavigationRoutes.AUTH_STACK.ADD_NEW_PASSWORD, {
          phone: phone,
          otp: otpCode,
        });
      }
      else{
        navigate(NavigationRoutes.AUTH_STACK.CREATE_ACCOUNT, {
          phone: phone,
          listing_count: listing_count
        });
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
      const payload = {
        phone_number: phone,
      };

      resendOtpPayload(payload);
    }
  }, [isResendDisabled, params]);

  const handleVerifyOtp = (data: { otpCode: string }) => {
    const payload = {
      phone_number: phone,
      otp: data.otpCode,
    };
    otpVerifyPayload(payload);
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
    identifier: phone,
    handleResendOtp,
    handleVerifyOtp: handleSubmit(handleVerifyOtp),
    formatTimer,
  };
}
