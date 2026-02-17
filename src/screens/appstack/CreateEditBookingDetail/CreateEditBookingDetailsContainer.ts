import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BookingDetailsFormValues, bookingDetailsSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import Toast from 'react-native-toast-message';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoute } from '@react-navigation/native';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

export default function useBookingDetailsContainer() {
  const { params } = useRoute();
  const { listing_id, channel_id } = useCreateListingStore();
  const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const bookingTypeOptions = [
    { label: 'Instant', value: 'instant' },
    { label: 'Request', value: 'request' },
  ];

  const guestEligibilityOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  const { control, handleSubmit, formState: { errors } } = useForm<BookingDetailsFormValues>({
    resolver: yupResolver(bookingDetailsSchema) as any,
    defaultValues: {
      booking_type: listing?.booking_type ?? '',
      guest_eligibility: listing?.guest_eligibility === true
        ? 'true'
        : listing?.guest_eligibility === false
        ? 'false'
        : '',
      check_in_time: listing?.check_in_time ?? '',
      check_out_time: listing?.check_out_time ?? '',
    },
  });

  // ---- Mutations ----
  const { mutate: createListingDetailsPayload, isPending: isCreating } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: createListingDetailsApi,
      onError: error => {
        Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
      },
    });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS],
      });
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
      goBack();
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  // ---- Payload builder ----
  const buildPayload = (
    data: BookingDetailsFormValues,
    overrideListingId?: string
  ): CreateListingDetailsPayload => ({
    channel_id,
    listing_id: overrideListingId || listing_id,
    user_id: Number(user?.id),
    listing: {
      booking_type: data.booking_type,
      guest_eligibility: data.guest_eligibility === 'true',
      check_in_time: data.check_in_time,
      check_out_time: data.check_out_time,
    },
  });

  // ---- Handlers ----
  const onNext = (data: BookingDetailsFormValues) => {
    createListingDetailsPayload(buildPayload(data), {
      onSuccess: () => {
        navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING);
      },
    });
  };

  const onSaveExit = (data: BookingDetailsFormValues) => {
    if (isEdit) {
      updateListingDetails(buildPayload(data, listing?.listing_id || listing_id));
    } else {
      createListingDetailsPayload(buildPayload(data), {
        onSuccess: () => {
          navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
        },
      });
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isEdit,
    isLoading: isCreating || isUpdating,
    bookingTypeOptions,
    guestEligibilityOptions,
  };
}