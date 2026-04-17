import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';

// --- SCHEMA ---
export const discountsSchema = yup.object().shape({
  weekly_discount: yup.string().required('Required'),
  monthly_discount: yup.string().required('Required'),
  other_special_discount: yup.string().required('Required'),
  employee_discount: yup.string().required('Required'),
  last_minute_discount: yup.string().required('Required'),
});

export type DiscountFormValues = yup.InferType<typeof discountsSchema>;

export default function useDiscountsContainer() {
  const { params } = useRoute() as any;
  const [isModalVisible, setModalVisible] = useState(false);
  
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<DiscountFormValues>({
    resolver: yupResolver(discountsSchema) as any,
    defaultValues: {
      weekly_discount: listing?.weekly_discount ?? '',
      monthly_discount: listing?.monthly_discount ?? '',
      other_special_discount: listing?.other_special_discount ?? '',
      employee_discount: listing?.employee_discount ?? '',
      last_minute_discount: listing?.last_minute_discount ?? '',
    },
  });

  // ---- Mutations ----
  const { mutate: handleApi, isPending } = useMutation({
    mutationFn: isEdit ? editListingApi : createListingDetailsApi,
    onSuccess: (res: any) => {
      Toast.show({ type: 'success', text1: res?.message || 'Saved successfully' });
      isEdit ? goBack() : navigate(NavigationRoutes.APP_STACK.ADD_AI_PRICING); 
    },
    onError: (error: any) => Toast.show({ type: 'error', text1: error.message }),
  });

  const onSubmit = (data: DiscountFormValues, isSaveAndExit: boolean = false) => {
    const payload = {
      channel_id,
      listing_id: String(listing_id || listing?.id),
      user_id: String(user?.id),
      save_and_exit: isSaveAndExit ? 1 : 0,
      listing: {
        ...data,
        name: propertyDetail?.name || listing?.name,
      },
    };
    handleApi(payload as any);
  };

  return { 
    control, errors, handleSubmit, onSubmit, 
    isLoading: isPending, isModalVisible, setModalVisible 
  };
}