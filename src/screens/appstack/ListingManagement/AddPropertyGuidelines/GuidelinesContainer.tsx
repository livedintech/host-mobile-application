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
export const guidelinesSchema = yup.object().shape({
  arrival_guide: yup.string().required('Arrival guide is required'),
  property_rules: yup.string().required('Property rules are required'),
  checkout_instructions: yup.string().required('Check-out instructions are required'),
  wifi_username: yup.string().required('Wifi Username is required'),
  wifi_password: yup.string().required('Wifi Password is required'),
  door_lock_code: yup.string().required('Please select a door lock'),
});

export type GuidelinesFormValues = yup.InferType<typeof guidelinesSchema>;

export default function useGuidelinesContainer() {
  const { params } = useRoute() as any;
  
  // As per your requirement: store variables
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<GuidelinesFormValues>({
    resolver: yupResolver(guidelinesSchema) as any,
    defaultValues: {
      arrival_guide: listing?.arrival_guide ?? propertyDetail?.arrival_guide ?? '',
      property_rules: listing?.property_rules ?? propertyDetail?.house_rules ?? '',
      checkout_instructions: listing?.checkout_instructions ?? propertyDetail?.checkout_instructions ?? '',
      wifi_username: listing?.wifi_network ?? propertyDetail?.wifi_username ?? '',
      wifi_password: listing?.wifi_password ?? propertyDetail?.wifi_password ?? '',
      door_lock_code: listing?.door_lock_code ?? propertyDetail?.door_lock_code ?? '',
    },
  });

  // Watch for character counts (UI progress/labels ke liye)
  const arrivalGuideLength = (watch('arrival_guide') || '').length;
  const houseRulesLength = (watch('property_rules') || '').length;
  const checkoutInstructionsLength = (watch('checkout_instructions') || '').length;

  // ---- Mutations ----
  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  const { mutate: updateDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
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

  // ---- Payload builder (Strict variables) ----
  const buildPayload = (data: GuidelinesFormValues, isSaveAndExit: boolean = false) => ({
    channel_id,
    listing_id: String(listing_id || listing?.id),
    user_id: String(user?.id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || listing?.name || 'New Listing',
      arrival_guide: data.arrival_guide,
      property_rules: data.property_rules,
      checkout_instructions: data.checkout_instructions,
      wifi_network: data.wifi_username,
      wifi_password: data.wifi_password,
      door_lock_code: data.door_lock_code,
    },
  });

  // ---- Handlers ----
  const onNext = (data: GuidelinesFormValues) => {
    // 1. Store Update
    updateListing({
      arrival_guide: data.arrival_guide,
      house_rules: data.property_rules,
      checkout_instructions: data.checkout_instructions,
      wifi_username: data.wifi_username,
      wifi_password: data.wifi_password,
      door_lock_code: data.door_lock_code,
    });

    // 2. API Hit
    const payload = buildPayload(data, false);
    if (isEdit) {
      updateDetails(payload as any);
    } else {
      createDetails(payload as any, {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES),
      });
    }
  };

  const onSaveExit = (data: GuidelinesFormValues) => {
    updateListing({
      arrival_guide: data.arrival_guide,
      house_rules: data.property_rules,
    });

    const payload = buildPayload(data, true);
    if (isEdit) {
      updateDetails(payload as any);
    } else {
      createDetails(payload as any, {
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
    arrivalGuideLength,
    houseRulesLength,
    checkoutInstructionsLength
  };
}