import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import i18n from '@/locales/i18n/i18n';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import { createListingExportApi } from '@/services/ createListingService';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { showAirbnbExportPopup } from '@/services/airbnbExportPopupService';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { CreateListingDetailsResponse } from '@/types/api/createListingTypes';

const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.validation.ota_required')),
});

export type OtaAccountFormValues = { ota_account: string };

interface UseListingExportOptions {
  successMessage?: string;
  onSuccess?: (response: CreateListingDetailsResponse) => void;
}

export default function useListingExport(options?: UseListingExportOptions) {
  const { user } = useAuthStore();
  const { listing_id } = useCreateListingStore();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const {
    control: otaControl,
    handleSubmit: handleOtaSubmit,
    formState: { errors: otaErrors },
    watch,
  } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
    defaultValues: { ota_account: '' },
  });

  const ota_Account = watch('ota_account');

  const { data: response, isLoading: isLoadingChannelList, refetch: refetchListingOptions } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn: () => getChannelsUserbyId({ user_id: Number(user?.id) }),
    enabled: !!user?.id,
  });

  const connectedAccounts = response?.data || [];
  const listingOptions = connectedAccounts
    .filter((item: any) => item.connection_type === 'Airbnb')
    .map((item: any) => ({
      label: `Airbnb - ${item?.id} - ${item?.channel_name}`,
      value: item.ch_channel_id,
    }));

  const handleExport = () => setBottomSheetVisible(true);

  const { mutate: createListingExportPayload, isPending: isPendingExporting } =
    useMutation<CreateListingDetailsResponse, Error, { channel_id?: string | null; listing_id?: string | null }>({
      mutationFn: createListingExportApi,
      onSuccess: (data) => {
        setBottomSheetVisible(false);
        // listing_id badal sakti hai refetch par, isliye hamesha latest se invalidate
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        Toast.show({ type: 'success', text1: options?.successMessage || data.message || i18n.t('common.toast.exported') });
        if (data.popup) showAirbnbExportPopup();
        options?.onSuccess?.(data);
      },
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
    });

  const handleExportSubmit = (data: OtaAccountFormValues) => {
    createListingExportPayload({
      channel_id: data?.ota_account || ota_Account,
      listing_id: String(listing_id),
    });
  };

  return {
    bottomSheetVisible,
    setBottomSheetVisible,
    handleExport,
    handleExportSubmit,
    handleOtaSubmit,
    otaControl,
    otaErrors,
    listingOptions,
    connectedAccounts,
    isLoadingChannelList,
    refetchListingOptions,
    isPendingExporting,
  };
}
