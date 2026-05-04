import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi, createListingExportApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import { useState } from 'react';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';

const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.validation.ota_required')),
});
type OtaAccountFormValues = { ota_account: string };

export const cancelPoliciesSchema = yup.object().shape({
  airbnb_policy:          yup.string().required(i18n.t('app.validation.airbnb_policy_required')),
  airbnb_longterm_policy: yup.string().required(i18n.t('app.validation.airbnb_longterm_required')),
  gathern_policy:         yup.string().optional(),
  booking_com_policy:     yup.string().optional(),

  // gathern_policy:         yup.string().required(i18n.t('app.validation.gathern_policy_required')),
  // booking_com_policy:     yup.string().required(i18n.t('app.validation.bookingcom_policy_required')),
});

export type CancelPoliciesValues = yup.InferType<typeof cancelPoliciesSchema>;

export default function useBookingCancelPoliciesContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user }   = useAuthStore();

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
    .map((item: any) => ({ label: `Airbnb - ${item?.id}`, value: item.ch_channel_id }));

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

  // ── Helper ────────────────────────────────────────────────────────────────
  const getPolicyValue = (raw: any, fallback: any): string => {
    if (raw === null || raw === undefined) {
      if (fallback === null || fallback === undefined) return '';
      if (typeof fallback === 'string' && fallback !== '') return fallback;
      if (fallback?.id !== undefined) return String(fallback.id);
      return '';
    }
    if (typeof raw === 'object' && raw?.id !== undefined) {
      const idToSlug: Record<number, string> = { 1: 'flexible', 2: 'moderate', 3: 'strict' };
      return idToSlug[raw.id] || String(raw.id);
    }
    if (typeof raw === 'string' && raw !== '') return raw;
    if (typeof raw === 'number') {
      const idToSlug: Record<number, string> = { 1: 'flexible', 2: 'moderate', 3: 'strict' };
      return idToSlug[raw] || String(raw);
    }
    return '';
  };

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<CancelPoliciesValues>({
    resolver: yupResolver(cancelPoliciesSchema) as any,
    defaultValues: {
      airbnb_policy:          isEdit ? getPolicyValue(listing?.cancellation_policy, null)     : '',
      airbnb_longterm_policy: isEdit ? (listing?.airbnb_longterm_policy ?? '')                       : '',
      gathern_policy:         isEdit ? getPolicyValue(listing?.gathern_cancellation_policy, null)    : '',
      booking_com_policy:     isEdit ? getPolicyValue(listing?.bookingCom_cancellation_policy, null) : '',
    },
  });

  const buildPayload = (data: CancelPoliciesValues, isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:                           propertyDetail?.name || 'New Listing',
      cancellation_policy:     data.airbnb_policy,
      airbnb_longterm_policy:         data.airbnb_longterm_policy,
      gathern_cancellation_policy:    data.gathern_policy,
      bookingCom_cancellation_policy: data.booking_com_policy,
    },
  });

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

  const onNext = (data: CancelPoliciesValues) => {
    updateListing({
      cancellation_policy:     data.airbnb_policy,
      airbnb_longterm_policy:         data.airbnb_longterm_policy,
      gathern_cancellation_policy:    data.gathern_policy,
      bookingCom_cancellation_policy: data.booking_com_policy,
    });
    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING),
    });
  };

  const onSaveExit = (data: CancelPoliciesValues) => {
    updateListing({
      cancellation_policy:     data.airbnb_policy,
      airbnb_longterm_policy:         data.airbnb_longterm_policy,
      gathern_cancellation_policy:    data.gathern_policy,
      bookingCom_cancellation_policy: data.booking_com_policy,
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
  };
}