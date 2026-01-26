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
  const { user } = useAuthStore()
  const listing = params?.paramData?.payload?.listing;
  const isEdit = Boolean(listing?.listing_id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DescribeHouseFormValues>({
    resolver: yupResolver(describeHouseSchema),
    defaultValues: {
      name: listing?.name || '',
      listing_descriptions: '',
    },
  });

  const descriptionValue = watch('listing_descriptions') || '';

  const {
    mutate: createListingDetailsPayload,
    isPending,
  } = useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
    mutationFn: createListingDetailsApi,
    onSuccess: ({ message }) => {
      Toast.show({
        type: 'success',
        text1: message || 'Something went wrong',
      });
      navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING)
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

  const {
    mutate: updateListingDetails,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS],
      });
      Toast.show({
        type: 'success',
        text1: message || 'Updated successfully',
      });
      goBack();
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

  const onSubmit = (data: DescribeHouseFormValues) => {
    updateListing({
      name: data?.name,
    })
    const payload = {
      channel_id,
      listing_id,
      user_id: Number(user?.id),
      listing: {
        listing_descriptions: data?.listing_descriptions,
        name: data?.name,
      }
    };
    createListingDetailsPayload(payload);
  };

  const onSaveExit = (data: DescribeHouseFormValues) => {
    const payload = {
      channel_id,
      listing_id,
      user_id: Number(user?.id),
      listing: {
        listing_descriptions: data?.listing_descriptions,
        name: data?.name,
      },
    };
    console.log('payload', payload);

    updateListingDetails(payload);
  };


  return {
    isEdit,
    isLoading: isPending || isUpdating,
    control,
    errors,
    handleSubmit,
    onSubmit,
    onSaveExit,
    descriptionLength: descriptionValue.length,
  };

}