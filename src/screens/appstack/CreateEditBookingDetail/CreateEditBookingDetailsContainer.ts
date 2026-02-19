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
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export default function useBookingDetailsContainer() {
  const { params } = useRoute();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
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
      booking_type: listing?.instant_booking === true ? 'instant' : 'request',
      guest_eligibility: listing?.guest_eligibility === true ? 'true' : 'false',
      check_in_time: listing?.check_in_time 
      ? dayjs(listing.check_in_time, "HH:mm").format("hh:mm a") 
      : '04:00 pm',
    check_out_time: listing?.check_out_time 
      ? dayjs(listing.check_out_time, "HH:mm").format("hh:mm a") 
      : '12:00 pm',
    }
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
  const buildPayload = (data: BookingDetailsFormValues, isSaveAndExit: boolean = false): CreateListingDetailsPayload => ({
    channel_id,
    listing_id: String(listing_id),
    user_id: String(user?.id),
    // save_and_exit: isSaveAndExit ? 1 : 0,
    save_and_exit: 0,
    listing: {
      name: propertyDetail?.name || 'New Listing',
      instant_booking: data.booking_type === 'instant',
      guest_eligibility: data.guest_eligibility === 'true',
      check_in_time: data.check_in_time, // Format: "14:00"
      check_out_time: data.check_out_time, // Format: "11:00"
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onNext = (data: BookingDetailsFormValues) => {
    // 1. Store Update (taake state localy save rahe)
    updateListing({
      booking_type: data.booking_type,
      guest_eligibility: data.guest_eligibility === 'true',
      check_in_time: data.check_in_time,
      check_out_time: data.check_out_time,
    });

    // 2. API Hit
    createListingDetailsPayload(buildPayload(data, false), {
      onSuccess: () => {
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_HOUSE_GUIDELINES);
      },
    });
  };

  const onSaveExit = (data: BookingDetailsFormValues) => {
    updateListing({
      booking_type: data.booking_type,
      guest_eligibility: data.guest_eligibility === 'true',
    });

    const payload = buildPayload(data, true); // save_and_exit: 1

    if (isEdit) {
      updateListingDetails(payload);
    } else {
      createListingDetailsPayload(payload, {
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