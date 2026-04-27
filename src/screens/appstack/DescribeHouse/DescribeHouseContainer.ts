import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import { useState } from 'react';

import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi, createListingExportApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { CreateListingDetailsPayload, CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';

const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.describe_house.validation_ota_required')),
});
type OtaAccountFormValues = { ota_account: string };

export const describeHouseSchema = yup.object().shape({
  name:                 yup.string().required(i18n.t('app.describe_house.validation_title_required')),
  listing_descriptions: yup.string().required(i18n.t('app.describe_house.validation_description_required')),
});

export type DescribeHouseFormValues = yup.InferType<typeof describeHouseSchema>;

const parseDescription = (raw: any): string => {
  if (!raw) return '';
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (typeof first === 'object' && first !== null) return first.description || '';
  if (typeof first === 'string') {
    try {
      const parsed = JSON.parse(first);
      return parsed?.description || first;
    } catch {
      return first;
    }
  }
  return '';
};

export default function useDescribeHouseContainer() {
  const { params }   = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user }     = useAuthStore();

  const listing  = params?.paramData?.listing;
  const editType = params?.editType;
  const isEdit   = Boolean(listing?.listing_id);

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  // ── OTA Form ──────────────────────────────────────────────────────────────
  const {
    control: otaControl,
    handleSubmit: handleOtaSubmit,
    formState: { errors: otaErrors },
    watch: otaWatch,
  } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
    defaultValues: { ota_account: '' },
  });

  const ota_Account = otaWatch('ota_account');

  // ── OTA Accounts ──────────────────────────────────────────────────────────
  const { data: response } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn: () => getChannelsUserbyId({ user_id: Number(user?.id) }),
    enabled: !!user?.id,
  });

  const connectedAccounts = response?.data || [];
  const listingOptions = connectedAccounts
    .filter((item: any) => item.connection_type === 'Airbnb')
    .map((item: any) => ({
      label: 'Airbnb',
      value: item.ch_channel_id,
    }));

  // ── Export Mutation ───────────────────────────────────────────────────────
  const { mutate: createListingExportPayload, isPending: isPendingExporting } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingExportPayloadType>({
      mutationFn: createListingExportApi,
      onSuccess: ({ message }: any) => {
        setBottomSheetVisible(false);
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        Toast.show({ type: 'success', text1: message || i18n.t('common.toast.exported') });
      },
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
    });

  const handleExport = () => setBottomSheetVisible(true);

  const handleExportSubmit = (data: OtaAccountFormValues) => {
    createListingExportPayload({
      channel_id: ota_Account,
      listing_id: String(listing_id),
    });
  };

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors }, watch } =
    useForm<DescribeHouseFormValues>({
      resolver: yupResolver(describeHouseSchema) as any,
      defaultValues: {
        name:                 isEdit ? (listing?.name ?? '') : '',
        listing_descriptions: isEdit ? (parseDescription(listing?.listing_descriptions) || '') : '',
      },
    });

  const titleLength       = (watch('name') || '').length;
  const descriptionLength = (watch('listing_descriptions') || '').length;

  const buildPayload = (
    data: DescribeHouseFormValues,
    isSaveAndExit: boolean = false,
  ): CreateListingDetailsPayload => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:                 data.name,
      listing_desc:         data.listing_descriptions,
      listing_descriptions: [{ description: data.listing_descriptions }],
    },
  });

  const { mutate: createListingDetailsPayload, isPending } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      Toast.show({ type: 'success', text1: message || i18n.t('common.toast.updated') });
      goBack();
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  const onNext = (data: DescribeHouseFormValues) => {
    updateListing({ name: data.name, listing_desc: data.listing_descriptions });
    createListingDetailsPayload(buildPayload(data, false), {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.ADD_PROPERTY_GUIDELINES),
    });
  };

  const onSaveExit = (data: DescribeHouseFormValues) => {
    updateListing({ name: data.name, listing_desc: data.listing_descriptions });
    if (isEdit) {
      updateListingDetails(buildPayload(data, true));
    } else {
      createListingDetailsPayload(buildPayload(data, true), {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
      });
    }
  };

  return {
    isEdit,
    isLoading: isPending || isUpdating,
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    titleLength,
    descriptionLength,
    editType,
    // ✅ Export
    handleExport,
    handleExportSubmit,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting,
  };
}