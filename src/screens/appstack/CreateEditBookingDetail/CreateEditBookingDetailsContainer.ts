import { useForm } from 'react-hook-form';
import i18n from '@/locales/i18n/i18n';
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

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<BookingDetailsFormValues>({
    resolver: yupResolver(bookingDetailsSchema) as any,
    defaultValues: {
      booking_type: isEdit
        ? (listing?.instant_booking === 'everyone' ? 'everyone'
          : listing?.instant_booking === 'off' ? 'off'
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
      instant_booking:    data.booking_type,
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
      instant_booking:    data.booking_type,
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
      instant_booking:    data.booking_type,
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