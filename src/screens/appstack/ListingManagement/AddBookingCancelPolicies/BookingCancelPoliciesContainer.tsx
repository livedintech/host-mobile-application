// useBookingCancelPoliciesContainer.ts
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

// ── Schema ────────────────────────────────────────────────────────────────────
export const cancelPoliciesSchema = yup.object().shape({
  airbnb_policy: yup.string().required('Airbnb policy is required'),
  airbnb_longterm_policy: yup.string().required('Airbnb long-term policy is required'),
  gathern_policy: yup.string().required('Gathern policy is required'),
  booking_com_policy: yup.string().required('Booking.com policy is required'),
});

export type CancelPoliciesValues = yup.InferType<typeof cancelPoliciesSchema>;

// ── Container ─────────────────────────────────────────────────────────────────
export default function useBookingCancelPoliciesContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id); // ✅ consistent


  const getPolicyValue = (raw: any, fallback: any): string => {
    // null / undefined — skip
    if (raw === null || raw === undefined) {
      // fallback check
      if (fallback === null || fallback === undefined) return '';
      if (typeof fallback === 'string' && fallback !== '') return fallback;
      if (fallback?.id !== undefined) return String(fallback.id);
      return '';
    }
    // Object form: { id, title } — id se map karo
    if (typeof raw === 'object' && raw?.id !== undefined) {
      // id → slug mapping
      const idToSlug: Record<number, string> = {
        1: 'flexible',
        2: 'moderate',
        3: 'strict',
      };
      return idToSlug[raw.id] || String(raw.id);
    }
    // String slug — directly use karo
    if (typeof raw === 'string' && raw !== '') return raw;
    // Number id
    if (typeof raw === 'number') {
      const idToSlug: Record<number, string> = {
        1: 'flexible',
        2: 'moderate',
        3: 'strict',
      };
      return idToSlug[raw] || String(raw);
    }
    return '';
  };


  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<CancelPoliciesValues>({
    resolver: yupResolver(cancelPoliciesSchema) as any,
    defaultValues: {
      airbnb_policy: isEdit
        ? getPolicyValue(listing?.airbnb_cancellation_policy, null)
        : '',
      airbnb_longterm_policy: isEdit
        ? (listing?.airbnb_longterm_policy ?? '')
        : '',
      gathern_policy: isEdit
        ? getPolicyValue(listing?.gathern_cancellation_policy, null)
        : '',
      booking_com_policy: isEdit
        ? getPolicyValue(listing?.bookingCom_cancellation_policy, null)
        : '',
    },
  });

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: CancelPoliciesValues, isSaveAndExit: boolean = false) => ({
    user_id: String(user?.id),
    channel_id,
    listing_id: String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || 'New Listing',
      airbnb_cancellation_policy: data.airbnb_policy,
      airbnb_longterm_policy: data.airbnb_longterm_policy,
      gathern_cancellation_policy: data.gathern_policy,
      bookingCom_cancellation_policy: data.booking_com_policy,
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  const { mutate: updateDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
      goBack();
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onNext = (data: CancelPoliciesValues) => {
    updateListing({
      airbnb_cancellation_policy: data.airbnb_policy,
      airbnb_longterm_policy: data.airbnb_longterm_policy,
      gathern_cancellation_policy: data.gathern_policy,
      bookingCom_cancellation_policy: data.booking_com_policy,
    });

    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING),
    });
  };

  const onSaveExit = (data: CancelPoliciesValues) => {
    updateListing({
      airbnb_cancellation_policy: data.airbnb_policy,
      airbnb_longterm_policy: data.airbnb_longterm_policy,
      gathern_cancellation_policy: data.gathern_policy,
      bookingCom_cancellation_policy: data.booking_com_policy,
    });

    if (isEdit) {
      updateDetails(buildPayload(data, true) as any);
    } else {
      createDetails(buildPayload(data, true) as any, {
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
    isEdit,
  };
}