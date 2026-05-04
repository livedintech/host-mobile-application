import { useState, useEffect } from 'react';
import i18n from '@/locales/i18n/i18n';
import { useRoute } from '@react-navigation/native';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { navigate, goBack } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getAmenitiesApi, CreateUpdateAmenitiesApi, createListingExportApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';

const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.validation.ota_required')),
});
type OtaAccountFormValues = { ota_account: string };

export default function useAmenitiesContainer() {
  const { user } = useAuthStore();
  const { listing_id, channel_id, updateListing, listing: propertyDetail } = useCreateListingStore();
  const { params } = useRoute<any>();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  useEffect(() => {
    const initial = isEdit ? (listing?.amenities ?? []) : [];
    setSelectedAmenities(initial);
  }, []);

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
  const { data: response,isLoading } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn:  () => getChannelsUserbyId({ user_id: Number(user?.id) }),
    enabled:  !!user?.id,
  });

  const connectedAccounts = response?.data || [];
  const listingOptions = connectedAccounts
    .filter((item: any) => item.connection_type === 'Airbnb')
    .map((item: any) => ({
      label: `Airbnb - ${item?.id}`,
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

  // ── Fetch amenities list ──────────────────────────────────────────────────
  const { data: rawAmenities = [], isLoading: isLoadingAmenities,refetch } = useQuery({
    queryKey: [STORAGE_CONST.AMENITIES],
    queryFn:  getAmenitiesApi,
  });

  const toggleAmenity = (key: string) => {
    setSelectedAmenities(prev =>
      prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key],
    );
  };

  const buildPayload = () => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: 0,
    amenities:     selectedAmenities,
  });

  const { mutate: syncAmenities, isPending } = useMutation({
    mutationFn: CreateUpdateAmenitiesApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err?.response?.data?.message || err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  const onNext = () => {
    updateListing({ amenities: selectedAmenities });
    syncAmenities(buildPayload() as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.MAKE_PROPERTY_STAND_OUT),
    });
  };

  const onSaveExit = () => {
    updateListing({ amenities: selectedAmenities });
    syncAmenities(buildPayload() as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        if (isEdit) {
          goBack();
        } else {
          navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
        }
      },
    });
  };

  const amenitiesList = [...rawAmenities].sort((a: any, b: any) =>
    a.label.localeCompare(b.label),
  );

  return {
    amenitiesList,
    selectedAmenities,
    toggleAmenity,
    onNext,
    onSaveExit,
    isLoading:         isPending,
    isLoadingAmenities,
    isEdit,
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
    refetch
  };
}