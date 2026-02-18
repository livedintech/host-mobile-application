import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CancelPoliciesFormValues, cancelPoliciesSchema } from '@/validation/auth/createListingSchemas';
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

export default function useCreateEditListingCancelPoliciesContainer() {
  const { params } = useRoute();
  const { listing_id, channel_id } = useCreateListingStore();
  const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  // Cancel policy options (can be fetched from API if needed)
  const cancelPolicyOptions = [
    { label: 'Flexible - Guests can cancel at least 24 hours before check-in', value: 'flexible' },
    { label: 'Moderate - Guests can cancel up to 5 days before check-in', value: 'moderate' },
    { label: 'Firm - Guests can cancel up to 30 days before check-in', value: 'firm' },
    { label: 'Strict - Guests can cancel up to 60 days before check-in', value: 'strict' },
  ];

  const { control, handleSubmit, formState: { errors } } = useForm<CancelPoliciesFormValues>({
    resolver: yupResolver(cancelPoliciesSchema) as any,
    defaultValues: {
      cancel_policy_airbnb: listing?.cancel_policy_airbnb ?? '',
      cancel_policy_gathern: listing?.cancel_policy_gathern ?? '',
      cancel_policy_booking: listing?.cancel_policy_booking ?? '',
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
    data: CancelPoliciesFormValues,
    overrideListingId?: string
  ): CreateListingDetailsPayload => ({
    channel_id,
    listing_id: overrideListingId || listing_id,
    user_id: Number(user?.id),
    listing: {
      cancel_policy_airbnb: data.cancel_policy_airbnb,
      cancel_policy_gathern: data.cancel_policy_gathern,
      cancel_policy_booking: data.cancel_policy_booking,
    },
  });

  // ---- Handlers ----
  const onNext = (data: CancelPoliciesFormValues) => {
    navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING)
    return false
    createListingDetailsPayload(buildPayload(data), {
      onSuccess: () => {
        navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING);
      },
    });
  };

  const onSaveExit = (data: CancelPoliciesFormValues) => {
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
    cancelPolicyOptions,
  };
}