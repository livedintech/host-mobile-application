// useAboutThePlaceContainer.ts
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import * as yup from 'yup';

// ── Schema ────────────────────────────────────────────────────────────────────
export const aboutThePlaceSchema = yup.object().shape({
  size_sqm:    yup.number().typeError('Must be a number').required('Required'),
  guest_limit: yup.string().required('Required'),
  bedrooms:    yup.string().required('Required'),
  beds:        yup.string().required('Required'),
  bathrooms:   yup.string().required('Required'),
});

export type AboutThePlaceFormValues = yup.InferType<typeof aboutThePlaceSchema>;

export default function useAboutThePlaceContainer() {
  const { user } = useAuthStore();
  const { listing_id, channel_id, listing: propertyDetail, updateListing } = useCreateListingStore();
  const { params } = useRoute<any>();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id);

  // ── Dropdown options ──────────────────────────────────────────────────────
  const numberOptions = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })),
    [],
  );

  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<AboutThePlaceFormValues>({
    resolver: yupResolver(aboutThePlaceSchema),
    defaultValues: {
  // ✅ Edit mode mein listing se, Create mode mein empty
  size_sqm:    isEdit ? (listing?.property_area    ?? '') : '',
  guest_limit: isEdit ? (listing?.guest_limit ? String(listing.guest_limit) : '') : '',
  bedrooms:    isEdit ? (listing?.bedrooms    ? String(listing.bedrooms)    : '') : '',
  beds:        isEdit ? (listing?.beds        ? String(listing.beds)        : '') : '',
  bathrooms:   isEdit ? (listing?.bathrooms   ? String(listing.bathrooms)   : '') : '',
},
  });

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: AboutThePlaceFormValues, isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:          propertyDetail?.name || 'New Listing',
      property_area: Number(data.size_sqm),
      guest_limit:   Number(data.guest_limit),
      bedrooms:      Number(data.bedrooms),
      beds:          Number(data.beds),
      bathrooms:     Number(data.bathrooms),
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createListingDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
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
  const onNext = (data: AboutThePlaceFormValues) => {
    updateListing({
      property_area: Number(data.size_sqm),
      guest_limit:   Number(data.guest_limit),
      bedrooms:      Number(data.bedrooms),
      beds:          Number(data.beds),
      bathrooms:     Number(data.bathrooms),
    });

    createListingDetails(buildPayload(data, false), {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.AMENITIES),
    });
  };

  const onSaveExit = (data: AboutThePlaceFormValues) => {
    updateListing({
      property_area: Number(data.size_sqm),
      guest_limit:   Number(data.guest_limit),
      bedrooms:      Number(data.bedrooms),
      beds:          Number(data.beds),
      bathrooms:     Number(data.bathrooms),
    });

    if (isEdit) {
      updateListingDetails(buildPayload(data, true));
    } else {
      createListingDetails(buildPayload(data, true), {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
      });
    }
  };

  return {
    control,
    errors,
    numberOptions,
    handleSubmit,
    onNext,
    onSaveExit,  // ✅ added
    isLoading: isCreating || isUpdating,
    isEdit,
  };
}