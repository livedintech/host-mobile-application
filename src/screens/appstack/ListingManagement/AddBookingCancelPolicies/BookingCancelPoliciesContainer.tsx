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
export const cancelPoliciesSchema = yup.object().shape({
  airbnb_policy: yup.string().required('Airbnb policy is required'),
  airbnb_longterm_policy: yup.string().required('Airbnb long-term policy is required'),
  gathern_policy: yup.string().required('Gathern policy is required'),
  booking_com_policy: yup.string().required('Booking.com policy is required'),
});

export type CancelPoliciesValues = yup.InferType<typeof cancelPoliciesSchema>;

export default function useBookingCancelPoliciesContainer() {
  const { params } = useRoute() as any;
  
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const { control, handleSubmit, formState: { errors } } = useForm<CancelPoliciesValues>({
    resolver: yupResolver(cancelPoliciesSchema) as any,
    defaultValues: {
      airbnb_policy: listing?.airbnb_policy ?? propertyDetail?.airbnb_policy ?? '',
      airbnb_longterm_policy: listing?.airbnb_longterm_policy ?? propertyDetail?.airbnb_longterm_policy ?? '',
      gathern_policy: listing?.gathern_policy ?? propertyDetail?.gathern_policy ?? '',
      booking_com_policy: listing?.booking_com_policy ?? propertyDetail?.booking_com_policy ?? '',
    },
  });

  // ---- Mutations ----
  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: error => Toast.show({ type: 'error', text1: error.message || 'Something went wrong' }),
  });

  const { mutate: updateDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
      goBack();
    },
    onError: error => Toast.show({ type: 'error', text1: error.message || 'Something went wrong' }),
  });

  // ---- Payload builder ----
  const buildPayload = (data: CancelPoliciesValues, isSaveAndExit: boolean = false) => ({
    channel_id,
    listing_id: String(listing_id || listing?.id),
    user_id: String(user?.id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || listing?.name || 'New Listing',
      airbnb_cancel_policy: data.airbnb_policy,
      airbnb_longterm_cancel_policy: data.airbnb_longterm_policy,
      gathern_cancel_policy: data.gathern_policy,
      booking_com_cancel_policy: data.booking_com_policy,
    },
  });

  // ---- Handlers ----
  const onNext = (data: CancelPoliciesValues) => {
    updateListing({
      // @ts-ignore
      airbnb_cancel_policy: data.airbnb_policy,
      gathern_cancel_policy: data.gathern_policy,
    });

    const payload = buildPayload(data, false);
    if (isEdit) {
      updateDetails(payload as any);
    } else {
      createDetails(payload as any, {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING),
      });
    }
  };

  const onSaveExit = (data: CancelPoliciesValues) => {
    const payload = buildPayload(data, true);
    if (isEdit) {
      updateDetails(payload as any);
    } else {
      createDetails(payload as any, {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
      });
    }
  };

  return { control, errors, handleSubmit, onNext, onSaveExit, isLoading: isCreating || isUpdating };
}