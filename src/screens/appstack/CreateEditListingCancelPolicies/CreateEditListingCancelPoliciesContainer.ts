import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CancelPoliciesFormValues, cancelPoliciesSchema } from '@/validation/auth/createListingSchemas';
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

export default function useCreateEditListingCancelPoliciesContainer() {
  const { params } = useRoute();
const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();  const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  // Cancel policy options (can be fetched from API if needed)
  const cancelPolicyOptions = [
    { label: 'Flexible - Guests can cancel at least 24 hours before check-in', value: '1' },
    { label: 'Moderate - Guests can cancel up to 5 days before check-in', value: '2' },
    { label: 'Firm - Guests can cancel up to 30 days before check-in', value: '3' },
    { label: 'Strict - Guests can cancel up to 60 days before check-in', value: '4' },
  ];

  const { control, handleSubmit, formState: { errors } } = useForm<CancelPoliciesFormValues>({
    resolver: yupResolver(cancelPoliciesSchema) as any,
    defaultValues: {
    cancel_policy_airbnb: listing?.airbnb_cancellation_policy?.id?.toString() ?? '',
    cancel_policy_gathern: listing?.gathern_cancellation_policy?.id?.toString() ?? '',
    cancel_policy_booking: listing?.bookingCom_cancellation_policy?.id?.toString() ?? '',
  },
  });

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
 const buildPayload = (
  data: CancelPoliciesFormValues,
  isSaveAndExit: boolean = false
): CreateListingDetailsPayload => ({
  channel_id,
  listing_id: String(listing_id),
  user_id: String(user?.id),
  // save_and_exit: isSaveAndExit ? 1 : 0,
  save_and_exit: 0,
  listing: {
    name: propertyDetail?.name || 'New Listing',
    airbnb_cancellation_policy: data.cancel_policy_airbnb, 
    gathern_cancellation_policy: data.cancel_policy_gathern,
    bookingCom_cancellation_policy: data.cancel_policy_booking, // Note the "Com" in Swagger
  },
});

  // ---- Handlers ----
 const onNext = (data: CancelPoliciesFormValues) => {
  // 1. Update Store for persistence
  updateListing({
    cancel_policy_airbnb: data.cancel_policy_airbnb,
    cancel_policy_gathern: data.cancel_policy_gathern,
    cancel_policy_booking: data.cancel_policy_booking,
  });

  // 2. API Hit
  createListingDetailsPayload(buildPayload(data, false), {
    onSuccess: () => {
      // Navigate to Set Your Pricing
      navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING);
    },
  });
};

 const onSaveExit = (data: CancelPoliciesFormValues) => {
  updateListing({
    cancel_policy_airbnb: data.cancel_policy_airbnb,
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
    onNext,
    onSaveExit,
    isEdit,
    isLoading: isCreating || isUpdating,
    cancelPolicyOptions,
  };
}