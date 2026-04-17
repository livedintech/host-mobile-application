import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

// ── Schema ────────────────────────────────────────────────────────────────────
export const bookingDetailsSchema = yup.object().shape({
  booking_type: yup.string().required('Booking type is required'),
  guest_eligibility: yup.string().required('Guest eligibility is required'),
  check_in_time: yup.string().required('Check-in time is required'),
  check_out_time: yup.string().required('Check-out time is required'),
  allow_same_day: yup.string().required('This field is required'),    // 🆕 NEW
  cleanliness_status: yup.string().required('Cleanliness status is required'), // 🆕 NEW
});

export type BookingDetailsFormValues = yup.InferType<typeof bookingDetailsSchema>;

// ── Container ─────────────────────────────────────────────────────────────────
export default function useBookingDetailsContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id); // ✅ consistent


  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<BookingDetailsFormValues>({
    resolver: yupResolver(bookingDetailsSchema) as any,
    // useBookingDetailsContainer.ts — defaultValues fix

   defaultValues: {
  booking_type:       isEdit
    ? (listing?.instant_booking === true  || listing?.instant_booking === 1 || listing?.instant_booking === '1' ? 'Instant'
      : listing?.instant_booking === false || listing?.instant_booking === 0 || listing?.instant_booking === '0' ? 'Manual'
      : '')
    : '',

  guest_eligibility:  isEdit
    ? (listing?.guest_eligibility === true  || listing?.guest_eligibility === 1 ? 'Yes'
      : listing?.guest_eligibility === false || listing?.guest_eligibility === 0 ? 'No'
      : '')
    : '',

  check_in_time:      isEdit ? (listing?.check_in_time  ?? '') : '',
  check_out_time:     isEdit ? (listing?.check_out_time ?? '') : '',

  allow_same_day:     isEdit
    ? (listing?.allow_same_day === true  ? 'Yes'
      : listing?.allow_same_day === false ? 'No'
      : '')
    : '',

  cleanliness_status: isEdit ? (listing?.cleanliness_status ?? '') : '',
},
  });

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: BookingDetailsFormValues, isSaveAndExit: boolean = false) => ({
    user_id: String(user?.id),
    channel_id,
    listing_id: String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || 'New Listing',
      instant_booking: data.booking_type === 'Instant',  // ✅ swagger key (boolean)
      guest_eligibility: data.guest_eligibility === 'Yes', // ✅ swagger key (boolean)
      check_in_time: data.check_in_time,                // ✅ swagger key
      check_out_time: data.check_out_time,               // ✅ swagger key
      allow_same_day: data.allow_same_day === 'Yes',     // 🆕 NEW
      cleanliness_status: data.cleanliness_status,         // 🆕 NEW
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  const { mutate: updateDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
      goBack();
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  // ---- Handlers ----
  const onNext = (data: BookingDetailsFormValues) => {
    updateListing({
      instant_booking: data.booking_type === 'Instant',
      guest_eligibility: data.guest_eligibility === 'Yes',
      check_in_time: data.check_in_time,
      check_out_time: data.check_out_time,
      allow_same_day: data.allow_same_day === 'Yes',
      cleanliness_status: data.cleanliness_status,
    });

    // onNext — always create flow
    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.ADD_BOOKING_RULES),
    });
  };

  const onSaveExit = (data: BookingDetailsFormValues) => {
    updateListing({
      instant_booking: data.booking_type === 'Instant',
      guest_eligibility: data.guest_eligibility === 'Yes',
      check_in_time: data.check_in_time,
      check_out_time: data.check_out_time,
      allow_same_day: data.allow_same_day === 'Yes',
      cleanliness_status: data.cleanliness_status,
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
    isEdit
  };

}