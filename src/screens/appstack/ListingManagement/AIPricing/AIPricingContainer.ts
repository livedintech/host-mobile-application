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
export const aiPricingSchema = yup.object().shape({
  maximum_price: yup.string().required('Maximum price is required'),
  minimum_price: yup.string().required('Minimum price is required'),
});

export type AIPricingFormValues = yup.InferType<typeof aiPricingSchema>;

export default function useAIPricingContainer() {
  const { params } = useRoute() as any;
  
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, formState: { errors } } = useForm<AIPricingFormValues>({
    resolver: yupResolver(aiPricingSchema) as any,
    defaultValues: {
      maximum_price: listing?.maximum_price ?? propertyDetail?.maximum_price ?? '',
      minimum_price: listing?.minimum_price ?? propertyDetail?.minimum_price ?? '',
    },
  });

  // ---- Mutations ----
  const { mutate: handleApi, isPending } = useMutation({
    mutationFn: isEdit ? editListingApi : createListingDetailsApi,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      Toast.show({ type: 'success', text1: res?.message || 'Pricing saved successfully' });
      isEdit ? goBack() : navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AI_DYNAMIC_PRICING); // Replace with your final step route
    },
    onError: (error: any) => Toast.show({ type: 'error', text1: error.message || 'Something went wrong' }),
  });

  // ---- Handlers ----
  const onSave = (data: AIPricingFormValues, isSaveAndExit: boolean = false) => {
    const payload = {
      channel_id,
      listing_id: String(listing_id || listing?.id),
      user_id: String(user?.id),
      save_and_exit: isSaveAndExit ? 1 : 0,
      listing: {
        name: propertyDetail?.name || listing?.name || 'New Listing',
        maximum_price: data.maximum_price,
        minimum_price: data.minimum_price,
      },
    };

    handleApi(payload as any);
  };

  return { 
    control, 
    errors, 
    handleSubmit, 
    onSave, 
    isLoading: isPending 
  };
}