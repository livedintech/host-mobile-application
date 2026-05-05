// useAIPricingContainer.ts
import { useForm } from 'react-hook-form';
import i18n from '@/locales/i18n/i18n';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

// ── Schema ────────────────────────────────────────────────────────────────────
export const aiPricingSchema = yup.object().shape({
  maximum_price: yup.string().required(i18n.t('app.validation.max_price_required')),
  minimum_price: yup.string().required(i18n.t('app.validation.min_price_required')),
});

export type AIPricingFormValues = yup.InferType<typeof aiPricingSchema>;

// ── Container ─────────────────────────────────────────────────────────────────
export default function useAIPricingContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id); // ✅ consistent

  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<AIPricingFormValues>({
    resolver: yupResolver(aiPricingSchema) as any,
    defaultValues: {
      maximum_price: String(listing?.maximum_price ?? propertyDetail?.maximum_price ?? ''),
      minimum_price: String(listing?.minimum_price ?? propertyDetail?.minimum_price ?? ''),
    },
  });

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: AIPricingFormValues, isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:          propertyDetail?.name || i18n.t('common.new_listing'),
      maximum_price: Number(data.maximum_price), // 🆕 NEW
      minimum_price: Number(data.minimum_price), // 🆕 NEW
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  const { mutate: updateDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      Toast.show({ type: 'success', text1: res?.message || i18n.t('common.toast.updated') });
      goBack();
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  // ── Handler ───────────────────────────────────────────────────────────────
  const onSave = (data: AIPricingFormValues, isSaveAndExit: boolean = false) => {
    updateListing({
      maximum_price: Number(data.maximum_price),
      minimum_price: Number(data.minimum_price),
    });

    if (isEdit) {
      updateDetails(buildPayload(data, isSaveAndExit) as any);
    } else {
      createDetails(buildPayload(data, isSaveAndExit) as any, {
        onSuccess: (res: any) => {
          queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
          Toast.show({ type: 'success', text1: res?.message || i18n.t('common.toast.saved') });

          if (isSaveAndExit) {
            resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any);
          } else {
            navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AI_DYNAMIC_PRICING);
          }
        },
      });
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    onSave,
    isLoading: isCreating || isUpdating,
  };
}