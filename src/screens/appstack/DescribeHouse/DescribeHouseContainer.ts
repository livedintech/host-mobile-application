import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DescribeHouseFormValues, describeHouseSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
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

export default function useDescribeHouseContainer() {
  const { params } = useRoute();
  const { updateListing, listing_id, channel_id } = useCreateListingStore();
  const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  let listingDescription = '';
  try {
    const raw = listing?.listing_descriptions?.[0] ?? '';
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw);
      listingDescription = parsed?.description || raw;
    } else {
      listingDescription = raw?.description || '';
    }
  } catch {
    listingDescription = listing?.listing_descriptions?.[0] ?? '';
  }


  // Safe access for edit mode only
  const listingDescriptionRaw = listing?.listing_descriptions?.[0] ?? null;

  let listingDescriptionParsed: any = null;
  try {
    listingDescriptionParsed =
      typeof listingDescriptionRaw === 'string'
        ? JSON.parse(listingDescriptionRaw)
        : listingDescriptionRaw;
  } catch (e) {
    listingDescriptionParsed = null;
  }

  const { control, handleSubmit, formState: { errors }, watch } = useForm<DescribeHouseFormValues>({
    resolver: yupResolver(describeHouseSchema) as any,
     defaultValues: {
      name: listing?.name ?? '',
      listing_descriptions: listingDescription,
      wifi_username: listing?.wifi_network ?? '',
      wifi_password: listing?.wifi_password ?? '',
      door_lock_code: listing?.door_lock_code ?? '',
    },
  });

  const descriptionValue = watch('listing_descriptions') || '';

  const { mutate: createListingDetailsPayload, isPending } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: createListingDetailsApi,
      onSuccess: ({ message }) => {
        Toast.show({ type: 'success', text1: message || 'Saved successfully' });
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_BOOKING_DETAIL);
      },
      onError: error => {
        Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
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
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
      goBack();
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  const buildPayload = (data: DescribeHouseFormValues, isSaveAndExit: boolean = false): CreateListingDetailsPayload => ({
    user_id: String(user?.id),
    channel_id,
    listing_id: String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: data.name,
      listing_desc: data.listing_descriptions, // Swagger key: listing_desc
      wifi_network: data.wifi_username,         // Swagger key: wifi_network
      wifi_password: data.wifi_password,
      door_lock_code: data.door_lock_code,
      listing_descriptions: [
        {
          description: data.listing_descriptions
        }
      ]
    },
  });

  const onNext = (data: DescribeHouseFormValues) => {
    updateListing({ name: data.name });
    createListingDetailsPayload(buildPayload(data));
    // navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_BOOKING_DETAIL);
  };

  const onSaveExit = (data: DescribeHouseFormValues) => {
    if (isEdit) {
      updateListingDetails(buildPayload(data));
    } else {
      createListingDetailsPayload(buildPayload(data), {
        onSuccess: () => {
          navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
        },
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
    descriptionLength: descriptionValue.length,
  };
}