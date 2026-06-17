import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import useListingExport from '@/hooks/useListingExport';

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

  // ── Export ────────────────────────────────────────────────────────────────
  const {
    bottomSheetVisible,
    setBottomSheetVisible,
    handleExport,
    handleExportSubmit,
    handleOtaSubmit,
    otaControl,
    otaErrors,
    listingOptions,
    isPendingExporting,
  } = useListingExport();

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
      name:                           propertyDetail?.name || 'New Property',
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
        onSuccess: () => resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any),
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