import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DescribeHouseFormValues, describeHouseSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDetailsPayload } from '@/types/api/createListingTypes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import Toast from 'react-native-toast-message';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoute } from '@react-navigation/native';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

export default function useDescribeHouseContainer() {
  const { params } = useRoute();
  const { updateListing, listing_id, channel_id } = useCreateListingStore();
  const { user } = useAuthStore();
  
  const listing = (params as any)?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  // Safe description parsing
  let listingDescription = '';
  try {
    const raw = listing?.listing_descriptions?.[0] ?? '';
    if (typeof raw === 'string' && raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      listingDescription = parsed?.description || raw;
    } else {
      listingDescription = typeof raw === 'object' ? raw.description : raw;
    }
  } catch {
    listingDescription = listing?.listing_descriptions?.[0] || '';
  }

  const { control, handleSubmit, formState: { errors }, watch } = useForm<DescribeHouseFormValues>({
    resolver: yupResolver(describeHouseSchema) as any,
    defaultValues: {
      name: listing?.name ?? '',
      listing_descriptions: listingDescription,
    },
  });

  // Counters for UI
  const titleValue = watch('name') || '';
  const descriptionValue = watch('listing_descriptions') || '';

  const { mutate: createListingDetailsPayload, isPending } = useMutation({
    mutationFn: createListingDetailsApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message || 'Saved successfully' });
      navigate(NavigationRoutes.APP_STACK.ADD_PROPERTY_GUIDELINES);
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message });
    },
  });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
      goBack();
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message });
    },
  });

  const buildPayload = (data: DescribeHouseFormValues, isSaveAndExit: boolean = false): CreateListingDetailsPayload => ({
    user_id: String(user?.id),
    channel_id,
    listing_id: String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: data.name,
      listing_desc: data.listing_descriptions,
      listing_descriptions: [{ description: data.listing_descriptions }]
    },
  });

  const onNext = (data: DescribeHouseFormValues) => {
    updateListing({ name: data.name });
    createListingDetailsPayload(buildPayload(data, false));
  };

  const onSaveExit = (data: DescribeHouseFormValues) => {
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
    isLoading: isPending || isUpdating,
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    titleLength: titleValue.length,
    descriptionLength: descriptionValue.length,
  };
}