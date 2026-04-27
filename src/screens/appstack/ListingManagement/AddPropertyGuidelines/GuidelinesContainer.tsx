import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi, getTTLOCKSApi, createListingExportApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import { useState } from 'react';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';

const otaAccountSchema = yup.object({
  ota_account: yup.string().required('Please select an OTA account'),
});
type OtaAccountFormValues = { ota_account: string };

export default function useGuidelinesContainer() {
  const { params }     = useRoute<any>();
  const hideWifiFields = params?.hideWifiFields;
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user }       = useAuthStore();

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
    .map((item: any) => ({ label: 'Airbnb', value: item.ch_channel_id }));

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

  // ── Schema ────────────────────────────────────────────────────────────────
  const guidelinesSchema = yup.object().shape({
    arrival_guide:         yup.string().required('Arrival guide is required'),
    property_rules:        yup.string().required('Property rules are required'),
    checkout_instructions: yup.string().required('Check-out instructions are required'),
    wifi_username:  hideWifiFields ? yup.string() : yup.string().required('Wifi username is required'),
    wifi_password:  hideWifiFields ? yup.string() : yup.string().required('Wifi password is required'),
    door_lock_code: hideWifiFields ? yup.string() : yup.string().required('Please select a door lock'),
  });

  type GuidelinesFormValues = yup.InferType<typeof guidelinesSchema>;

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors }, watch } =
    useForm<GuidelinesFormValues>({
      resolver: yupResolver(guidelinesSchema) as any,
      defaultValues: {
        arrival_guide:         listing?.arrival_guide         ?? propertyDetail?.arrival_guide         ?? '',
        property_rules:        listing?.house_rule            ?? propertyDetail?.house_rule            ?? '',
        checkout_instructions: listing?.cleaning_instructions ?? propertyDetail?.cleaning_instructions ?? '',
        wifi_username:         listing?.wifi_network          ?? propertyDetail?.wifi_network          ?? '',
        wifi_password:         listing?.wifi_password         ?? propertyDetail?.wifi_password         ?? '',
        door_lock_code:        listing?.door_lock_code        ?? propertyDetail?.door_lock_code        ?? '',
      },
    });

  const arrivalGuideLength         = (watch('arrival_guide') || '').length;
  const houseRulesLength           = (watch('property_rules') || '').length;
  const checkoutInstructionsLength = (watch('checkout_instructions') || '').length;

  // ── Lock Options ──────────────────────────────────────────────────────────
  const { data: rawTTLocks = [], isLoading: isLoadingTTLocks } = useQuery({
    queryKey: [STORAGE_CONST.TT_LOCKS],
    queryFn:  getTTLOCKSApi,
  });

  const lockOptions = rawTTLocks.map((lock: any) => ({
    label: lock.alias,
    value: String(lock.lock_id),
  }));

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: GuidelinesFormValues, isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:                  propertyDetail?.name || 'New Listing',
      arrival_guide:         data.arrival_guide,
      house_rule:            data.property_rules,
      cleaning_instructions: data.checkout_instructions,
      wifi_network:          data.wifi_username,
      wifi_password:         data.wifi_password,
      door_lock_code:        String(data.door_lock_code),
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  const { mutate: updateDetails, isPending: isUpdating } = useMutation({
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

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onNext = (data: GuidelinesFormValues) => {
    updateListing({
      arrival_guide:         data.arrival_guide,
      house_rule:            data.property_rules,
      cleaning_instructions: data.checkout_instructions,
      wifi_network:          data.wifi_username,
      wifi_password:         data.wifi_password,
      door_lock_code:        data.door_lock_code,
    });
    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES),
    });
  };

  const onSaveExit = (data: GuidelinesFormValues) => {
    updateListing({
      arrival_guide:         data.arrival_guide,
      house_rule:            data.property_rules,
      cleaning_instructions: data.checkout_instructions,
      wifi_network:          data.wifi_username,
      wifi_password:         data.wifi_password,
      door_lock_code:        data.door_lock_code,
    });
    if (isEdit) {
      updateDetails(buildPayload(data, true) as any);
    } else {
      createDetails(buildPayload(data, true) as any, {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
      });
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading: isCreating || isUpdating,
    arrivalGuideLength,
    houseRulesLength,
    checkoutInstructionsLength,
    isEdit,
    hideWifiFields,
    lockOptions,
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