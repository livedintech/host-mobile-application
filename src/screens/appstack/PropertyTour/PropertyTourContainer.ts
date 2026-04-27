import i18n from '@/locales/i18n/i18n';
import { useRoute } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { getListingPhotosApi, createListingExportApi } from '@/services/ createListingService';
import STORAGE_CONST from '@/constants/storage';
import { useAuthStore } from '@/store/useAuthStore';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import { queryClient } from '@/services/api';
import { CreateListingExportPayloadType } from '@/types/api/createListingTypes';
import { CreateListingDetailsResponse } from '@/types/api/createListingTypes';

const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.validation.ota_required')),
});
type OtaAccountFormValues = { ota_account: string };

export default function usePropertyTourContainer() {
  const route = useRoute<any>();
  const { listing_id } = useCreateListingStore();
  const { user } = useAuthStore();
  const { isEdit } = route.params || {};

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const {
    control: otaControl,
    handleSubmit: handleOtaSubmit,
    formState: { errors: otaErrors },
    watch: newWatch,
  } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
    defaultValues: { ota_account: '' },
  });

  const ota_Account = newWatch('ota_account');

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

  // ── GET photos ────────────────────────────────────────────────────────────
  const { data: photosData, isFetching, refetch } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_PHOTOS, String(listing_id)],
    queryFn: () => getListingPhotosApi({ listing_id: String(listing_id) }),
    enabled: Boolean(listing_id),
  });

  const existingPhotos = photosData?.data?.photos || {};

  const tourData = Object.keys(existingPhotos).map((categoryName, index) => {
    const photosArray = existingPhotos[categoryName] || [];
    const featuredPhoto = photosArray.find((p: any) => p.is_featured === true);
    const coverPhoto = featuredPhoto || photosArray[0];
    const coverImage = coverPhoto?.url || null;

    return {
      id:    index.toString(),
      title: categoryName,
      count: photosArray.length,
      image: coverImage,
    };
  });

  const handleCardPress = (selectedCategory: string) => {
    navigate(NavigationRoutes.APP_STACK.OTHER_VIDEOS, {
      isEdit,
      existingPhotos: existingPhotos[selectedCategory] || [],
      category: selectedCategory,
    });
  };

  return {
    tourData,
    handleExport,
    handleExportSubmit,
    handleCardPress,
    isFetching,
    refetch,
    // ✅ Export modal
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting,
  };
}