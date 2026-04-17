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
export const bookingDetailsSchema = yup.object().shape({
  booking_type: yup.string().required('Booking type is required'),
  guest_eligibility: yup.string().required('Guest eligibility is required'),
  check_in_time: yup.string().required('Check-in time is required'),
  check_out_time: yup.string().required('Check-out time is required'),
  allow_same_day: yup.string().required('This field is required'),
  cleanliness_status: yup.string().required('Cleanliness status is required'),
});

export type BookingDetailsFormValues = yup.InferType<typeof bookingDetailsSchema>;

export default function useBookingDetailsContainer() {
  const { params } = useRoute() as any;
  
  // Store variables
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, formState: { errors } } = useForm<BookingDetailsFormValues>({
    resolver: yupResolver(bookingDetailsSchema) as any,
    defaultValues: {
      booking_type: listing?.booking_type ?? propertyDetail?.booking_type ?? 'Instant',
      guest_eligibility: listing?.guest_eligibility ?? propertyDetail?.guest_eligibility ?? 'Yes',
      check_in_time: listing?.check_in_time ?? propertyDetail?.check_in_time ?? '',
      check_out_time: listing?.check_out_time ?? propertyDetail?.check_out_time ?? '',
      allow_same_day: listing?.allow_same_day ?? propertyDetail?.allow_same_day ?? 'Yes',
      cleanliness_status: listing?.cleanliness_status ?? propertyDetail?.cleanliness_status ?? '',
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
  const buildPayload = (data: BookingDetailsFormValues, isSaveAndExit: boolean = false) => ({
    channel_id,
    listing_id: String(listing_id || listing?.id),
    user_id: String(user?.id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || listing?.name || 'New Listing',
  booking_type: data.booking_type,
  guest_eligibility: data.guest_eligibility === 'Yes' ? 1 : 0,
  check_in_time: data.check_in_time,
  check_out_time: data.check_out_time,
  allow_same_day_booking: data.allow_same_day === 'Yes' ? 1 : 0,
  cleanliness_status: data.cleanliness_status,
    },
  });

  // ---- Handlers ----
  const onNext = (data: BookingDetailsFormValues) => {
    // 1. Store Update
    updateListing({
      booking_type: data.booking_type,
      check_in_time: data.check_in_time,
      check_out_time: data.check_out_time,
    });

    // 2. API Hit
    const payload = buildPayload(data, false);
    if (isEdit) {
      updateDetails(payload as any);
    } else {
      createDetails(payload as any, {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.ADD_BOOKING_RULES), // Agli screen par jayein
      });
    }
  };

  const onSaveExit = (data: BookingDetailsFormValues) => {
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