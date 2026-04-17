// useDescribeHouseContainer.ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';

import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { CreateListingDetailsPayload } from '@/types/api/createListingTypes';

// ── Schema ────────────────────────────────────────────────────────────────────
export const describeHouseSchema = yup.object().shape({
  name:                 yup.string().required('Property title is required'),
  listing_descriptions: yup.string().required('Description is required'),
});

export type DescribeHouseFormValues = yup.InferType<typeof describeHouseSchema>;

// ── Helper — description parse karna (API se alag formats aa sakte hain) ─────
const parseDescription = (raw: any): string => {
  if (!raw) return '';
  // Array form: [{ description: '...' }] ya ['...'] ya ['{"description":"..."}']
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (typeof first === 'object' && first !== null) return first.description || '';
  if (typeof first === 'string') {
    try {
      const parsed = JSON.parse(first);
      return parsed?.description || first;
    } catch {
      return first;
    }
  }
  return '';
};

// ── Container ─────────────────────────────────────────────────────────────────
export default function useDescribeHouseContainer() {
  const { params }                                               = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user }                                                 = useAuthStore();

  const listing = params?.paramData?.listing;
  const editType  = params?.editType;
  const isEdit  = Boolean(listing?.listing_id); // ✅ consistent — baaki screens jaise

  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors }, watch } =
    useForm<DescribeHouseFormValues>({
      resolver: yupResolver(describeHouseSchema) as any,
      defaultValues: {
  name:                 isEdit ? (listing?.name ?? '') : '',
  listing_descriptions: isEdit
    ? (parseDescription(listing?.listing_descriptions) || '')
    : '',
},
    });

  const titleLength       = (watch('name') || '').length;
  const descriptionLength = (watch('listing_descriptions') || '').length;

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (
    data: DescribeHouseFormValues,
    isSaveAndExit: boolean = false,
  ): CreateListingDetailsPayload => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:                 data.name,
      listing_desc:         data.listing_descriptions,          // ✅ swagger key
      listing_descriptions: [{ description: data.listing_descriptions }], // ✅ swagger key
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createListingDetailsPayload, isPending } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }) => {
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
  const onNext = (data: DescribeHouseFormValues) => {
    updateListing({ name: data.name, listing_desc: data.listing_descriptions });

    createListingDetailsPayload(buildPayload(data, false), {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.ADD_PROPERTY_GUIDELINES),
    });
  };

  const onSaveExit = (data: DescribeHouseFormValues) => {
    updateListing({ name: data.name, listing_desc: data.listing_descriptions });

    if (isEdit) {
      updateListingDetails(buildPayload(data, true));
    } else {
      createListingDetailsPayload(buildPayload(data, true), {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
      });
    }
  };

  return {
    isEdit,
    isLoading:isPending || isUpdating,
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    titleLength,
    descriptionLength,
    editType
  };
}