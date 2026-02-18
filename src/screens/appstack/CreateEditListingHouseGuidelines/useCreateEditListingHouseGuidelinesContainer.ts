import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HouseGuidelinesFormValues, houseGuidelinesSchema } from '@/validation/auth/createListingSchemas';
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

export default function useCreateEditListingHouseGuidelinesContainer() {
  const { params } = useRoute();
  const { listing_id, channel_id } = useCreateListingStore();
  const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<HouseGuidelinesFormValues>({
    resolver: yupResolver(houseGuidelinesSchema) as any,
    defaultValues: {
      arrival_guide: listing?.arrival_guide ?? '',
      house_rules: listing?.house_rules ?? '',
      checkout_instructions: listing?.checkout_instructions ?? '',
    },
  });

  // Watch for character counts
  const arrivalGuideLength = (watch('arrival_guide') || '').length;
  const houseRulesLength = (watch('house_rules') || '').length;
  const checkoutInstructionsLength = (watch('checkout_instructions') || '').length;

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
    data: HouseGuidelinesFormValues,
    overrideListingId?: string
  ): CreateListingDetailsPayload => ({
    channel_id,
    listing_id: overrideListingId || listing_id,
    user_id: Number(user?.id),
    listing: {
      arrival_guide: data.arrival_guide,
      house_rules: data.house_rules,
      checkout_instructions: data.checkout_instructions,
    },
  });

  // ---- Handlers ----
  const onNext = (data: HouseGuidelinesFormValues) => {
    navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_CANCEL_POLICIES)
    return false
    createListingDetailsPayload(buildPayload(data), {
      onSuccess: () => {
        navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING);
      },
    });
  };

  const onSaveExit = (data: HouseGuidelinesFormValues) => {
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
    isEdit,
    onNext,
    onSaveExit,
    isLoading: isCreating || isUpdating,
    arrivalGuideLength,
    houseRulesLength,
    checkoutInstructionsLength,
  };
}