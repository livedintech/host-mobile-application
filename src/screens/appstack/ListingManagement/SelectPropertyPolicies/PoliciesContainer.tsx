import i18n from '@/locales/i18n/i18n';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi, createListingExportApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';

const policiesSchema = yup.object().shape({
  quiet_hours_start: yup.string().optional(),
  quiet_hours_end:   yup.string().optional(),
});

const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.validation.ota_required')),
});

type OtaAccountFormValues = { ota_account: string };
export type PoliciesFormValues = yup.InferType<typeof policiesSchema>;

export default function usePoliciesContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id);

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
    queryFn:  () => getChannelsUserbyId({ user_id: Number(user?.id) }),
    enabled:  !!user?.id,
  });

  const connectedAccounts = response?.data || [];
  const listingOptions = connectedAccounts
    .filter((item: any) => item.connection_type === 'Airbnb')
    .map((item: any) => ({
      label: `Airbnb - ${item?.id} - ${item?.channel_name}`,
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

  // ── Seed policies ─────────────────────────────────────────────────────────
  const seedPolicies = (): string[] => {
    const source = listing || propertyDetail;
    const result: string[] = [];
    if (source?.is_allow_pets)     result.push('pets');
    if (source?.is_smoking)        result.push('smoking');
    if (source?.is_allow_parties)  result.push('parties');
    if (source?.quiet_hours_start) result.push('quiet_hours');
    return result;
  };

  const [selectedPolicies, setSelectedPolicies] = useState<string[]>(seedPolicies);
  const [showTimeModal, setShowTimeModal]        = useState(false);
  const isPolicySelected = selectedPolicies.length > 0;

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<PoliciesFormValues>({
    resolver: yupResolver(policiesSchema) as any,
    defaultValues: {
      quiet_hours_start: listing?.quiet_hours_start ?? '',
      quiet_hours_end:   listing?.quiet_hours_end  ?? '',
    },
  });

  const togglePolicy = (id: string) => {
    if (id === 'quiet_hours') {
      if (selectedPolicies.includes(id)) {
        setSelectedPolicies(prev => prev.filter(p => p !== id));
      } else {
        setShowTimeModal(true);
      }
      return;
    }
    setSelectedPolicies(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id],
    );
  };

  const buildPayload = (data: PoliciesFormValues, isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:              propertyDetail?.name || 'New Property',
      is_allow_pets:     selectedPolicies.includes('pets'),
      is_smoking:        selectedPolicies.includes('smoking'),
      is_allow_parties:  selectedPolicies.includes('parties'),
      quiet_hours_start: selectedPolicies.includes('quiet_hours') ? data.quiet_hours_start : null,
      quiet_hours_end:   selectedPolicies.includes('quiet_hours') ? data.quiet_hours_end   : null,
    },
  });

  const { mutate: createListingDetailsPayload, isPending: isCreating } = useMutation({
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

  const onNext = (data: PoliciesFormValues) => {
    updateListing({
      is_allow_pets:     selectedPolicies.includes('pets'),
      is_smoking:        selectedPolicies.includes('smoking'),
      is_allow_parties:  selectedPolicies.includes('parties'),
      quiet_hours_start: selectedPolicies.includes('quiet_hours') ? data.quiet_hours_start : undefined,
      quiet_hours_end:   selectedPolicies.includes('quiet_hours') ? data.quiet_hours_end   : undefined,
    });
    createListingDetailsPayload(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE),
    });
  };

  const onSaveExit = (data: PoliciesFormValues) => {
    updateListing({
      is_allow_pets:     selectedPolicies.includes('pets'),
      is_smoking:        selectedPolicies.includes('smoking'),
      is_allow_parties:  selectedPolicies.includes('parties'),
      quiet_hours_start: selectedPolicies.includes('quiet_hours') ? data.quiet_hours_start : undefined,
      quiet_hours_end:   selectedPolicies.includes('quiet_hours') ? data.quiet_hours_end   : undefined,
    });
    if (isEdit) {
      updateListingDetails(buildPayload(data, true) as any);
    } else {
      createListingDetailsPayload(buildPayload(data, true) as any, {
        onSuccess: () => resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any),
      });
    }
  };

  return {
    control,
    errors,
    selectedPolicies,
    setSelectedPolicies,
    togglePolicy,
    showTimeModal,
    setShowTimeModal,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading: isCreating || isUpdating,
    isEdit,
    isPolicySelected,
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