import { useForm } from 'react-hook-form';
import i18n from '@/locales/i18n/i18n';
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
import { useState } from 'react';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';

const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.validation.ota_required')),
});
type OtaAccountFormValues = { ota_account: string };

export const bookingRulesSchema = yup.object().shape({
  long_term_stay: yup.mixed().required(i18n.t('app.validation.field_required')),
  min_gap_night:  yup.string().required(i18n.t('app.validation.field_required')),
  min_night_stay: yup.string().required(i18n.t('app.validation.field_required')),
  max_night_stay: yup.string().required(i18n.t('app.validation.field_required')),
});

export type BookingRulesFormValues = yup.InferType<typeof bookingRulesSchema>;

export default function useBookingRulesContainer() {
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

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<BookingRulesFormValues>({
    resolver: yupResolver(bookingRulesSchema) as any,
    defaultValues: {
      long_term_stay: isEdit
        ? (listing?.long_term_stay === true  || listing?.long_term_stay === 1 ? 1
          : listing?.long_term_stay === false || listing?.long_term_stay === 0 ? 0
          : '') : '',
      min_gap_night:  isEdit ? (listing?.min_gap_night !== undefined ? String(listing.min_gap_night) : '') : '',
      min_night_stay: isEdit ? (listing?.min_nights    !== undefined ? String(listing.min_nights)    : '') : '',
      max_night_stay: isEdit ? (listing?.max_nights    !== undefined ? String(listing.max_nights)    : '') : '',
    },
  });

  const buildPayload = (data: BookingRulesFormValues, isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:           propertyDetail?.name || i18n.t('common.new_listing'),
      long_term_stay: data.long_term_stay === 1 || data.long_term_stay === '1',
      min_gap_night:  Number(data.min_gap_night),
      min_nights:     Number(data.min_night_stay),
      max_nights:     Number(data.max_night_stay),
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

  const onNext = (data: BookingRulesFormValues) => {
    updateListing({
      long_term_stay: data.long_term_stay === 1 || data.long_term_stay === '1',
      min_gap_night:  Number(data.min_gap_night),
      min_nights:     Number(data.min_night_stay),
      max_nights:     Number(data.max_night_stay),
    });
    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.ADD_BOOKING_CANCEL_POLICIES),
    });
  };

  const onSaveExit = (data: BookingRulesFormValues) => {
    updateListing({
      long_term_stay: data.long_term_stay === 1 || data.long_term_stay === '1',
      min_gap_night:  Number(data.min_gap_night),
      min_nights:     Number(data.min_night_stay),
      max_nights:     Number(data.max_night_stay),
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