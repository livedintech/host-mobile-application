// useBookingRulesContainer.ts
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
export const bookingRulesSchema = yup.object().shape({
  long_term_stay: yup.mixed().required('This field is required'),
  min_gap_night: yup.string().required('This field is required'),
  min_night_stay: yup.string().required('This field is required'), // form field name
  max_night_stay: yup.string().required('This field is required'), // form field name
});

export type BookingRulesFormValues = yup.InferType<typeof bookingRulesSchema>;

// ── Container ─────────────────────────────────────────────────────────────────
export default function useBookingRulesContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id); // ✅ consistent

  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<BookingRulesFormValues>({
    resolver: yupResolver(bookingRulesSchema) as any,
    // useBookingRulesContainer.ts — defaultValues fix

    defaultValues: {
  long_term_stay: isEdit
    ? (listing?.long_term_stay === true  || listing?.long_term_stay === 1 ? 1
      : listing?.long_term_stay === false || listing?.long_term_stay === 0 ? 0
      : '')
    : '',

  min_gap_night:  isEdit ? (listing?.min_gap_night !== undefined ? String(listing.min_gap_night) : '') : '',
  min_night_stay: isEdit ? (listing?.min_nights    !== undefined ? String(listing.min_nights)    : '') : '',
  max_night_stay: isEdit ? (listing?.max_nights    !== undefined ? String(listing.max_nights)    : '') : '',
},
  });

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: BookingRulesFormValues, isSaveAndExit: boolean = false) => ({
    user_id: String(user?.id),
    channel_id,
    listing_id: String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || 'New Listing',
      long_term_stay: data.long_term_stay === 1 || data.long_term_stay === '1', // ✅ boolean
      min_gap_night: Number(data.min_gap_night),  // ✅ swagger key
      min_nights: Number(data.min_night_stay), // ✅ swagger key
      max_nights: Number(data.max_night_stay), // ✅ swagger key
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

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onNext = (data: BookingRulesFormValues) => {
    updateListing({
      long_term_stay: data.long_term_stay === 1 || data.long_term_stay === '1',
      min_gap_night: Number(data.min_gap_night),
      min_nights: Number(data.min_night_stay),
      max_nights: Number(data.max_night_stay),
    });

    // onNext — always create flow
    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.ADD_BOOKING_CANCEL_POLICIES),
    });
  };

  const onSaveExit = (data: BookingRulesFormValues) => {
    updateListing({
      long_term_stay: data.long_term_stay === 1 || data.long_term_stay === '1',
      min_gap_night: Number(data.min_gap_night),
      min_nights: Number(data.min_night_stay),
      max_nights: Number(data.max_night_stay),
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