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

export const bookingDetailsSchema = yup.object().shape({
  booking_type:       yup.string().required(i18n.t('app.validation.booking_type_required')),
  guest_eligibility:  yup.string().required(i18n.t('app.validation.guest_eligibility_required')),
  check_in_time:      yup.string().required(i18n.t('app.validation.checkin_time_required')),
  check_in_time_end:  yup.string().required(i18n.t('app.validation.checkin_time_required')),
  check_out_time:     yup.string().required(i18n.t('app.validation.checkout_time_required')),
  allow_same_day:     yup.string().required(i18n.t('app.validation.field_required')),
  cleanliness_status: yup.string().required(i18n.t('app.validation.cleanliness_required')),
});

export type BookingDetailsFormValues = yup.InferType<typeof bookingDetailsSchema>;

const to12Hour = (time?: string): string => {
  if (!time) return '';
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;
  const h = parseInt(match[1], 10);
  const m = match[2];
  return `${String(h % 12 || 12).padStart(2, '0')}:${m} ${h >= 12 ? 'pm' : 'am'}`;
};

export default function useBookingDetailsContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user }   = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id);
  console.log("listing",listing)

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
    .map((item: any) => ({ label: `Airbnb - ${item?.id} - ${item?.channel_name}`, value: item.ch_channel_id }));

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
  const { control, handleSubmit, formState: { errors } } = useForm<BookingDetailsFormValues>({
    resolver: yupResolver(bookingDetailsSchema) as any,
    defaultValues: {
      booking_type: isEdit
        ? (listing?.instant_booking === true || listing?.instant_booking === 1 || listing?.instant_booking === '1' ? 'Instant'
          : listing?.instant_booking === false || listing?.instant_booking === 0 || listing?.instant_booking === '0' ? 'Manual'
          : '') : '',
      guest_eligibility: isEdit
        ? (listing?.guest_eligibility === true || listing?.guest_eligibility === 1 ? 'Yes'
          : listing?.guest_eligibility === false || listing?.guest_eligibility === 0 ? 'No'
          : '') : '',
      check_in_time:      isEdit ? to12Hour(listing?.check_in_time)     : '',
      check_in_time_end:  isEdit ? to12Hour(listing?.check_in_time_end) : '',
      check_out_time:     isEdit ? to12Hour(listing?.check_out_time)    : '',
      allow_same_day:     isEdit
        ? (listing?.allow_same_day === true ? 'Yes' : listing?.allow_same_day === false ? 'No' : '')
        : '',
      cleanliness_status: isEdit ? (listing?.cleanliness_status ?? '') : '',
    },
  });

  const buildPayload = (data: BookingDetailsFormValues, isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:               propertyDetail?.name || 'New Property',
      instant_booking:    data.booking_type === 'Instant',
      guest_eligibility:  data.guest_eligibility === 'Yes',
      check_in_time:      data.check_in_time,
      check_in_time_end:  data.check_in_time_end,
      check_out_time:     data.check_out_time,
      allow_same_day:     data.allow_same_day === 'Yes',
      cleanliness_status: data.cleanliness_status,
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

  const onNext = (data: BookingDetailsFormValues) => {
    updateListing({
      instant_booking:    data.booking_type === 'Instant',
      guest_eligibility:  data.guest_eligibility === 'Yes',
      check_in_time:      data.check_in_time,
      check_in_time_end:  data.check_in_time_end,
      check_out_time:     data.check_out_time,
      allow_same_day:     data.allow_same_day === 'Yes',
      cleanliness_status: data.cleanliness_status,
    });
    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.ADD_BOOKING_RULES),
    });
  };

  const onSaveExit = (data: BookingDetailsFormValues) => {
    updateListing({
      instant_booking:    data.booking_type === 'Instant',
      guest_eligibility:  data.guest_eligibility === 'Yes',
      check_in_time:      data.check_in_time,
      check_in_time_end:  data.check_in_time_end,
      check_out_time:     data.check_out_time,
      allow_same_day:     data.allow_same_day === 'Yes',
      cleanliness_status: data.cleanliness_status,
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