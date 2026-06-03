import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HouseGuidelinesFormValues, houseGuidelinesSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
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
const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();  const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<HouseGuidelinesFormValues>({
    resolver: yupResolver(houseGuidelinesSchema) as any,
    defaultValues: {
      arrival_guide: listing?.arrival_guide ?? listing?.listing_descriptions?.[0] ?? '',
      house_rules: listing?.house_rule ?? '',
      checkout_instructions: listing?.cleaning_instructions ?? '',
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
        Toast.show({ type: 'error', text1: error.message || i18n.t('common.toast.something_went_wrong') });
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
      Toast.show({ type: 'success', text1: message || i18n.t('common.toast.updated') });
      goBack();
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || i18n.t('common.toast.something_went_wrong') });
    },
  });

  // ---- Payload builder ----
  const buildPayload = (data: HouseGuidelinesFormValues, isSaveAndExit: boolean = false): CreateListingDetailsPayload => ({
  channel_id,
  listing_id: String(listing_id),
  user_id: String(user?.id),
  // save_and_exit: isSaveAndExit ? 1 : 0,
  save_and_exit:  0,
  listing: {
    name: propertyDetail?.name || 'New Property',
    arrival_guide: data.arrival_guide,
    house_rule: data.house_rules,
    cleaning_instructions: data.checkout_instructions
  },
});

  // ---- Handlers ----
  const onNext = (data: HouseGuidelinesFormValues) => {
  // 1. Store Update (taake character counts aur data persist rahe)
  updateListing({
    arrival_guide: data.arrival_guide,
    house_rules: data.house_rules,
    checkout_instructions: data.checkout_instructions,
  });

  // 2. API Hit
  createListingDetailsPayload(buildPayload(data, false), {
    onSuccess: () => {
      navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_CANCEL_POLICIES);
    },
  });
};

  const onSaveExit = (data: HouseGuidelinesFormValues) => {
  // Local store update
  updateListing({
    arrival_guide: data.arrival_guide,
    house_rules: data.house_rules,
  });

  const payload = buildPayload(data, true); // save_and_exit: 1

  if (isEdit) {
    updateListingDetails(payload);
  } else {
    createListingDetailsPayload(payload, {
      onSuccess: () => {
        resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any);
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