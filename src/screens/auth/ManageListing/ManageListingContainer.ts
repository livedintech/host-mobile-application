import { useState } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { OtpVerifyResponse, VerifyOtpPayload } from '@/types/api/authTypes';
import { getSelectListingApi, resendOtpApi } from '@/services/authApi';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';

export default function useManageListingContainer() {
  const [localSelectedId, setLocalSelectedId] = useState<number | null>(null);
  const { params } = useRoute();

  const onSelect = (value: number | null) => {
    if (!value) return;
    const payload = {
      country_code: params?.country_code,
      phone_number: params?.phone_number,
      phone_with_code: params?.phone_with_code,
      listing_count: localSelectedId,
      pricing: plan?.price,
    };
    if (value === 1) {
      navigate(NavigationRoutes.AUTH_STACK.CREATE_ACCOUNT, { payload });
    } else {
      navigate(NavigationRoutes.AUTH_STACK.HUB_SPOT_DETAIL_FORM, { payload });
    }
  };

  const { data: data = [], isLoading, refetch } = useQuery({
    queryKey: [STORAGE_CONST.SELECT_LISTING],
    queryFn: getSelectListingApi,
  });

  const listingData =
    data
      ?.map((item: { name: string; id: string }) => ({
        label: item.name,
        value: item.id,
      }))
      .reverse() || [];

  const plan = data.find(item => item.id === 1);


  return {
    isLoading: isLoading,
    localSelectedId,
    setLocalSelectedId,
    onSelect,
    listingData,
    refetch
  };
}