// useDiscountsContainer.ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingPricingApi } from '@/services/ createListingService'; // ✅ pricing API
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

// ── Schema ────────────────────────────────────────────────────────────────────
export const discountsSchema = yup.object().shape({
  weekly_discount:         yup.string().optional(),
  monthly_discount:        yup.string().optional(),
  early_bird_price_change: yup.string().optional(),
  last_minute_discount:    yup.string().optional(),
});

export type DiscountFormValues = yup.InferType<typeof discountsSchema>;

// ── Container ─────────────────────────────────────────────────────────────────
export default function useDiscountsContainer() {
  const { params } = useRoute<any>();
  const [isModalVisible, setModalVisible] = useState(false);
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id); // ✅ consistent
  

  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<DiscountFormValues>({
    resolver: yupResolver(discountsSchema) as any,
    defaultValues: {
      // Yahan listing?.prices add karein 👇
      weekly_discount:        String(listing?.prices?.weekly_discount        ?? propertyDetail?.weekly_discount        ?? ''),
      monthly_discount:       String(listing?.prices?.monthly_discount       ?? propertyDetail?.monthly_discount       ?? ''),
      early_bird_price_change:String(listing?.prices?.early_bird_price_change ?? listing?.early_bird_price_change ?? propertyDetail?.early_bird_price_change ?? ''),
      last_minute_discount:   String(listing?.prices?.last_minute_discount   ?? propertyDetail?.last_minute_discount   ?? ''),
    },
  });

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: DiscountFormValues, isSaveAndExit: boolean = false) => ({
    user_id:          String(user?.id),
    listing_id:       String(listing_id),
    channel_id,
    listing_currency: propertyDetail?.listing_currency ?? 'SAR',
    save_and_exit:    isSaveAndExit ? 1 : 0,
    prices: {
  // ✅ store se lena — pricing screen par user ne fill kiya tha
  airbnb_discount:     Number(propertyDetail?.prices?.airbnb_discount    ?? 0),
  gathern_discount:    Number(propertyDetail?.prices?.gathern_discount   ?? 0),
  bookingCom_discount: Number(propertyDetail?.prices?.bookingCom_discount ?? 0),
  discount:            Number(propertyDetail?.prices?.discount           ?? 0),
  // 🆕 NEW
  weekly_discount:        Number(data.weekly_discount),
  monthly_discount:       Number(data.monthly_discount),
  early_bird_price_change:      Number(data.early_bird_price_change),
  last_minute_discount:   Number(data.last_minute_discount),
},
  });

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { mutate: handlePricingApi, isPending } = useMutation({
    mutationFn: createListingPricingApi, // ✅ pricing API
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  // ── Handler ───────────────────────────────────────────────────────────────
  const onSubmit = (data: DiscountFormValues, isSaveAndExit: boolean = false) => {
    updateListing({
      weekly_discount:        Number(data.weekly_discount),
      monthly_discount:       Number(data.monthly_discount),
      early_bird_price_change:      Number(data.early_bird_price_change),
      last_minute_discount:   Number(data.last_minute_discount),
    });

    handlePricingApi(buildPayload(data, isSaveAndExit) as any, {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        Toast.show({ type: 'success', text1: res?.message || 'Saved successfully' });

        if (isSaveAndExit) {
          isEdit
            ? goBack()
            : navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
        } else {
          navigate(NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD);
        }
      },
    });
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isLoading: isPending,
    isModalVisible,
    setModalVisible,
    isEdit
  };
}