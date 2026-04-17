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
export const pricingSchema = yup.object().shape({
  currency: yup.string().required('Currency is required'),
  weekday_price: yup.string().required('Required'),
  weekend_price: yup.string().required('Required'),
  tax_vat: yup.string().required('Required'),
  airbnb_markup: yup.string().required('Required'),
  gathern_markup: yup.string().required('Required'),
  booking_com_markup: yup.string().required('Required'),
  extra_guest_fee: yup.string().required('Required'),
});

export type PricingFormValues = yup.InferType<typeof pricingSchema>;

export default function usePricingContainer() {
  const { params } = useRoute() as any;
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, formState: { errors } } = useForm<PricingFormValues>({
    resolver: yupResolver(pricingSchema) as any,
    defaultValues: {
      currency: listing?.currency ?? propertyDetail?.currency ?? 'SAR',
      weekday_price: String(listing?.weekday_price ?? propertyDetail?.weekday_price ?? ''),
      weekend_price: String(listing?.weekend_price ?? propertyDetail?.weekend_price ?? ''),
      tax_vat: String(listing?.tax_vat ?? propertyDetail?.tax_vat ?? ''),
      airbnb_markup: String(listing?.airbnb_markup ?? propertyDetail?.airbnb_markup ?? ''),
      gathern_markup: String(listing?.gathern_markup ?? propertyDetail?.gathern_markup ?? ''),
      booking_com_markup: String(listing?.booking_com_markup ?? propertyDetail?.booking_com_markup ?? ''),
      extra_guest_fee: String(listing?.extra_guest_fee ?? propertyDetail?.extra_guest_fee ?? ''),
    },
  });

  const { mutate: handleApi, isPending } = useMutation({
    mutationFn: isEdit ? editListingApi : createListingDetailsApi,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      Toast.show({ type: 'success', text1: res?.message || 'Saved successfully' });
      isEdit ? goBack() : navigate(NavigationRoutes.APP_STACK.ADD_DISCOUNTS); 
    },
    onError: error => Toast.show({ type: 'error', text1: error.message || 'Something went wrong' }),
  });

  const onSubmit = (data: PricingFormValues, isSaveAndExit: boolean = false) => {
    // Store Update
    updateListing({
      // @ts-ignore
      weekday_price: data.weekday_price,
      weekend_price: data.weekend_price,
      currency: data.currency,
    });

    const payload = {
      channel_id,
      listing_id: String(listing_id || listing?.id),
      user_id: String(user?.id),
      save_and_exit: isSaveAndExit ? 1 : 0,
      listing: {
        name: propertyDetail?.name || listing?.name,
        currency: data.currency,
        weekday_price: data.weekday_price,
        weekend_price: data.weekend_price,
        tax_vat: data.tax_vat,
        airbnb_markup: data.airbnb_markup,
        gathern_markup: data.gathern_markup,
        booking_com_markup: data.booking_com_markup,
        extra_guest_fee: data.extra_guest_fee,
      },
    };

    handleApi(payload as any);
  };

  return { control, errors, handleSubmit, onSubmit, isLoading: isPending };
}