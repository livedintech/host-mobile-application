import i18n from '@/locales/i18n/i18n';
// useDiscountsContainer.ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingPricingApi } from '@/services/ createListingService'; // ✅ pricing API
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

// ── Schema ────────────────────────────────────────────────────────────────────
export const discountsSchema = yup.object().shape({
  weekly_discount: yup.string().optional(),
  monthly_discount: yup.string().optional(),
  early_bird_discount: yup.string().optional(),
  last_minute_discount: yup.string().optional(),
});

export type DiscountFormValues = yup.InferType<typeof discountsSchema>;

// ── Container ─────────────────────────────────────────────────────────────────
export default function useDiscountsContainer() {
  const { params } = useRoute<any>();
  const [isModalVisible, setModalVisible] = useState(false);
  const { updateListing, listing_id, channel_id } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id); // ✅ consistent

  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<DiscountFormValues>({
    resolver: yupResolver(discountsSchema) as any,
    defaultValues: {
      weekly_discount: String(listing?.prices?.weekly_discount ?? ''),
      monthly_discount: String(listing?.prices?.monthly_discount ?? ''),
      early_bird_discount: String(listing?.prices?.early_bird_discount ?? ''),
      last_minute_discount: String(listing?.prices?.last_minute_discount ?? ''),
    },
  });

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: DiscountFormValues, isSaveAndExit: boolean = false) => ({
    user_id: String(user?.id),
    listing_id: String(listing_id),
    channel_id,
    listing_currency: listing?.listing_currency ?? 'SAR',
    save_and_exit: isSaveAndExit ? 1 : 0,
    prices: {
      airbnb_discount: Number(listing?.prices?.airbnb_discount ?? 0),
      gathern_discount: Number(listing?.prices?.gathern_discount ?? 0),
      bookingCom_discount: Number(listing?.prices?.bookingCom_discount ?? 0),
      discount: Number(listing?.prices?.discount ?? 0),
      weekly_discount: Number(data.weekly_discount) || 0,
      monthly_discount: Number(data.monthly_discount) || 0,
      early_bird_discount: Number(data.early_bird_discount) || 0,
      last_minute_discount: Number(data.last_minute_discount) || 0,
    },
  });

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { mutate: handlePricingApi, isPending } = useMutation({
    mutationFn: createListingPricingApi, // ✅ pricing API
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  // ── Handler ───────────────────────────────────────────────────────────────
  const onSubmit = (data: DiscountFormValues, isSaveAndExit: boolean = false) => {
    updateListing({
      weekly_discount: data.weekly_discount ?? '',
      monthly_discount: data.monthly_discount ?? '',
      early_bird_discount: data.early_bird_discount ?? '',
      last_minute_discount: data.last_minute_discount ?? '',
    });

    handlePricingApi(buildPayload(data, isSaveAndExit) as any, {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        Toast.show({ type: 'success', text1: res?.message || i18n.t('common.toast.saved') });

        if (isSaveAndExit) {
          isEdit
            ? goBack()
            : resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any);
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