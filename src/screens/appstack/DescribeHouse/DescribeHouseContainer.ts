import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DescribeHouseFormValues, describeHouseSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import { createListingDetailsApi } from '@/services/ createListingService';
import Toast from 'react-native-toast-message';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function useDescribeHouseContainer() {
  const { user } = useAuthStore();
  const { listing_id, channel_id,updateListing } = useCreateListingStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DescribeHouseFormValues>({
    resolver: yupResolver(describeHouseSchema),
    defaultValues: {
      name: '',
      listing_descriptions: '',
    },
  });

  const descriptionValue = watch('listing_descriptions') || '';

  const {
    mutate: createListingDetailsPayload,
    isPending,
    isIdle,
  } = useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
    mutationFn: createListingDetailsApi,
    onSuccess: ({ message }) => {
      Toast.show({
        type: 'success',
        text1: message || 'Something went wrong',
      });
      navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING)
      // navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS);
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
      name:data?.name,
    })
    const payload = {
      channel_id,
      listing_id,
      user_id: Number(user?.id),
      listing: {
        listing_descriptions: data?.listing_descriptions?.[0],
        name: data?.name,
      }
    };
    createListingDetailsPayload(payload);
  };

  return {
    isLoading: isPending && !isIdle,
    control,
    errors,
    handleSubmit,
    onSubmit,
    descriptionLength: descriptionValue.length,
  };
}