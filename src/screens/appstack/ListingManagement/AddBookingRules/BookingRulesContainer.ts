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

// --- SCHEMA ---
export const bookingRulesSchema = yup.object().shape({
  long_term_stay: yup.string().required('This field is required'),
  min_gap_night: yup.string().required('This field is required'),
  min_night_stay: yup.string().required('This field is required'),
  max_night_stay: yup.string().required('This field is required'),
});

export type BookingRulesFormValues = yup.InferType<typeof bookingRulesSchema>;

export default function useBookingRulesContainer() {
  const { params } = useRoute() as any;
  
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, formState: { errors } } = useForm<BookingRulesFormValues>({
    resolver: yupResolver(bookingRulesSchema) as any,
    defaultValues: {
      long_term_stay: listing?.long_term_stay ?? propertyDetail?.long_term_stay ?? '',
      min_gap_night: String(listing?.min_gap_night ?? propertyDetail?.min_gap_night ?? ''),
      min_night_stay: String(listing?.min_night_stay ?? propertyDetail?.min_night_stay ?? ''),
      max_night_stay: String(listing?.max_night_stay ?? propertyDetail?.max_night_stay ?? ''),
    },
  });

  // ---- Mutations ----
  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: error => Toast.show({ type: 'error', text1: error.message || 'Something went wrong' }),
  });

  const { mutate: updateDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
      goBack();
    },
    onError: error => Toast.show({ type: 'error', text1: error.message || 'Something went wrong' }),
  }); 

  // ---- Payload builder ----
  const buildPayload = (data: BookingRulesFormValues, isSaveAndExit: boolean = false) => ({
    channel_id,
    listing_id: String(listing_id || listing?.id),
    user_id: String(user?.id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || listing?.name || 'New Listing',
      long_term_stay: data.long_term_stay,
      min_gap_night: data.min_gap_night,
      min_night_stay: data.min_night_stay,
      max_night_stay: data.max_night_stay,
    },
  });

  // ---- Handlers ----
  const onNext = (data: BookingRulesFormValues) => {
    updateListing({
      // @ts-ignore
      long_term_stay: data.long_term_stay,
      min_gap_night: data.min_gap_night,
      min_night_stay: data.min_night_stay,
    });

    const payload = buildPayload(data, false);
    if (isEdit) {
      updateDetails(payload as any);
    } else {
      createDetails(payload as any, {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.ADD_BOOKING_CANCEL_POLICIES), // Update this with next screen route
      });
    }
  };

  const onSaveExit = (data: BookingRulesFormValues) => {
    const payload = buildPayload(data, true);
    if (isEdit) {
      updateDetails(payload as any);
    } else {
      createDetails(payload as any, {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
      });
    }
  };

  return { control, errors, handleSubmit, onNext, onSaveExit, isLoading: isCreating || isUpdating };
}