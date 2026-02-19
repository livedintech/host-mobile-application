import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiDynamicPricingFormValues, aiDynamicPricingSchema } from '@/validation/auth/createListingSchemas';
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

export default function useCreateEditListingAiDynamicPricingContainer() {
  const { params } = useRoute();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<AiDynamicPricingFormValues>({
    resolver: yupResolver(aiDynamicPricingSchema) as any,
    defaultValues: {
      pricing_mode: listing?.pricing_mode ?? '',
      manual_price_override: listing?.manual_price_override ?? false,
    },
  });

  const selectedMode = watch('pricing_mode');
  const manualOverride = watch('manual_price_override');

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

  // ---- Handlers ----
  const handleModeSelect = (mode: string) => {
    setValue('pricing_mode', mode, { shouldValidate: true });
  };

  // ---- Payload builder ----
  const buildPayload = (data: AiDynamicPricingFormValues, isSaveAndExit: boolean = false): CreateListingDetailsPayload => ({
  channel_id,
  listing_id: String(listing_id),
  user_id: String(user?.id),
  save_and_exit: isSaveAndExit ? 1 : 0,
  listing: {
    name: propertyDetail?.name || 'New Listing',
    pricing_mode: data.pricing_mode, // 'conservative' or 'aggressive'
    manual_price_override: data.manual_price_override ? 1 : 0, // Sending as 1/0 or boolean based on Swagger preference
  },
});

 const onNext = (data: AiDynamicPricingFormValues) => {
  // 1. Store Update (taake UI selections persist rahein)
  updateListing({
    pricing_mode: data.pricing_mode,
    manual_price_override: data.manual_price_override,
  });

  // 2. API Hit
  createListingDetailsPayload(buildPayload(data, false), {
    onSuccess: () => {
      // Navigate to Property Disclosure (Next Step)
      navigate(NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE);
    },
  });
};

const onSaveExit = (data: AiDynamicPricingFormValues) => {
  // Persistence logic
  updateListing({ pricing_mode: data.pricing_mode });

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
    selectedMode,
    manualOverride,
    handleModeSelect,
    Controller,
  };
}