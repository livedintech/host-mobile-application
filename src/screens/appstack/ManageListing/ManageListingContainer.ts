import { useState, useCallback } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  OtpVerifyResponse,
  VerifyOtpPayload,
} from '@/types/api/authTypes';
import { forgotPasswordApi, resendOtpApi } from '@/services/authApi';
import Toast from 'react-native-toast-message';

export const listingData = [
  { id: '3', label: '1-3', isEnable: true },
  { id: '2', label: '4-30', isEnable: false },
  { id: '1', label: '30+', isEnable: false },
];

export default function useManageListingContainer() {
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const { params } = useRoute();

  const {
    mutate: resendOtpPayload,
    isPending: isPendingResendOtp,
    isIdle: isIdleResendOtp,
  } = useMutation<OtpVerifyResponse, Error, VerifyOtpPayload>({
    mutationFn: resendOtpApi,
    onSuccess: ({ message }) => {
      navigate(NavigationRoutes.AUTH_STACK.VERIFY_PHONE_NUMBER, {
        isLoginScreen: false,
        phone: params,
        listing_count: selectedListing
      });
    },
    onError: ({ message }) => {
      Toast.show({ type: 'error', text1: message || 'Login failed' });
    },
  });

  const onSelect = useCallback((id: string) => {
    setSelectedListing(id);
    const payload = {
      phone_number: params,
    };
    resendOtpPayload(payload);
  }, []);

  return {
    isLoading: isPendingResendOtp && !isIdleResendOtp,
    selectedListing,
    onSelect,
  };
}
