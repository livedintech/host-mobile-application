import i18n from '@/locales/i18n/i18n';
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
    .length(5, i18n.t('auth.verify_phone.validation_otp_length'))
    .required(i18n.t('auth.verify_phone.validation_otp_required')),
});

const RESEND_TIME_LIMIT = 60; // 60 seconds timer

export default function useVerifyPhoneNumberContainer() {
  const [timer, setTimer] = useState<number>(RESEND_TIME_LIMIT);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [resetKey, setResetKey] = useState(0); // Screen ke liye

  const { params } = useRoute();

  const actualPhone = (params as any)?.phone_number;
  const code = (params as any)?.phone_with_code;
  const country_code = (params as any)?.country_code;
  const isLoginScreen = (params as any)?.isLoginScreen;
  const isDeepLink = (params as any)?.isDeepLink;

  const dlListing = (params as any)?.dl_listing || '';
  const dlName = (params as any)?.dl_name || '';
  const dlEmail = (params as any)?.dl_email || '';
  const dlPhone = (params as any)?.dl_phone || '';
  const dlCountry = (params as any)?.dl_country || '';
  const dlState = (params as any)?.dl_state || '';
  const dlCity = (params as any)?.dl_city || '';
  const dlDistrict = (params as any)?.dl_district || '';
  const dlRef = (params as any)?.dl_ref || '';

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
  const { mutateAsync: verifyOtpPayload, isPending: isPendingVerifyOtp } =
    useMutation<OtpVerifyResponse, Error, VerifyOtpPayload>({
      mutationFn: verifyOtpApi,
      onError: ({ message }) => {
        Toast.show({
          type: 'error',
          text1: message || i18n.t('auth.verify_phone.login_failed'),
        });
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
      Toast.show({
        type: 'error',
        text1: message || i18n.t('auth.verify_phone.login_failed'),
      });
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

  const handleVerifyOtp = async (data: { otpCode: string }) => {
    const phoneParams = {
      country_code,
      phone_number: actualPhone,
      phone_with_code: code,
      otp: data.otpCode,
    };

    try {
      await verifyOtpPayload(phoneParams);
    } catch {
      return;
    }

    if (isLoginScreen) {
      navigate(NavigationRoutes.AUTH_STACK.ADD_NEW_PASSWORD, {
        country_code: phoneParams.country_code,
        phone_number: phoneParams.phone_number,
        phone_with_code: phoneParams.phone_with_code,
        otp: phoneParams.otp,
      });
      return;
    }

    if (isDeepLink) {
      if (!dlListing) {
        navigate(NavigationRoutes.AUTH_STACK.MANAGE_LISTING, {
          ...phoneParams,
          name: dlName,
          email: dlEmail,
          country: dlCountry,
          state: dlState,
          city: dlCity,
          district: dlDistrict,
          ref: dlRef,
        });
      } else if (String(dlListing) === '1') {
        navigate(NavigationRoutes.AUTH_STACK.CREATE_ACCOUNT, {
          payload: {
            ...phoneParams,
            listing_count: 1,
            pricing: null,
            name: dlName,
            ref: dlRef,
          },
        });
      } else if (String(dlListing) === '2' || String(dlListing) === '3') {
        navigate(NavigationRoutes.AUTH_STACK.HUB_SPOT_DETAIL_FORM, {
          name: dlName,
          email: dlEmail,
          phone: dlPhone,
          country: dlCountry,
          state: dlState,
          city: dlCity,
          district: dlDistrict,
          ref: dlRef,
        });
      } else {
        navigate(NavigationRoutes.AUTH_STACK.MANAGE_LISTING, {
          ...phoneParams,
          name: dlName,
        });
      }
      return;
    }

    navigate(NavigationRoutes.AUTH_STACK.MANAGE_LISTING, phoneParams);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return {
    isLoading: isPendingVerifyOtp || (isPendingResendOtp && !isIdleResendOtp),
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
