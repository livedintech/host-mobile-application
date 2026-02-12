import { useForm } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StepTwoFormValues, stepTwoSchema } from '@/validation/auth/createListingSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import { useAuthStore } from '@/store/useAuthStore';

export default function useAboutThePlaceContainer() {
  const { user } = useAuthStore()
  const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const navigation = useNavigation();
  const { params } = useRoute();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id);

  const binaryOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' }
  ];

  const numberOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`
  }));

  const { control, handleSubmit, formState: { errors } } = useForm<StepTwoFormValues>({
    resolver: yupResolver(stepTwoSchema),
    defaultValues: {
      bedrooms: listing?.bedrooms ? String(listing.bedrooms) : '',
      beds: listing?.beds ? String(listing.beds) : '',
      bathrooms: listing?.bathrooms ? String(listing.bathrooms) : '',
      min_nights: listing?.min_nights ? String(listing.min_nights) : '',
      check_in_time: listing?.check_in_time || '',
      check_out_time: listing?.check_out_time || '',
      instant_booking:
        listing?.instant_booking === true
          ? 'true'
          : listing?.instant_booking === false
            ? 'false'
            : '',
    },

  });

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
      navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS);
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


  const onNext = (data: StepTwoFormValues) => {
    const payload = {
      channel_id,
      listing_id,
      user_id: Number(user?.id),
      listing: {
        bedrooms: Number(data.bedrooms),
        beds: Number(data.beds),
        bathrooms: Number(data.bathrooms),
        min_nights: Number(data.min_nights),
        check_in_time: data.check_in_time,
        check_out_time: data.check_out_time,
        instant_booking: data.instant_booking === 'true',
        name: 'New Listing',
      }
    };
    createListingDetailsPayload(payload);
  }
  const onSaveExit = (data: StepTwoFormValues) => {
    const payload = {
      channel_id,
      listing_id: listing?.listing_id || listing_id,
      user_id: Number(user?.id),
      listing: {
        bedrooms: Number(data.bedrooms),
        beds: Number(data.beds),
        bathrooms: Number(data.bathrooms),
        min_nights: Number(data.min_nights),
        check_in_time: data.check_in_time,
        check_out_time: data.check_out_time,
        instant_booking: data.instant_booking === 'true',
        name: propertyDetail?.name || 'New Listing',
      },
    };

    // 👉 EDIT MODE
    if (isEdit) {
      updateListingDetails(payload);
    } else {
      // 👉 CREATE MODE
      createListingDetailsPayload(payload, {
        onSuccess: () => {
          navigate(
            NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS
          );
        },
      });
    }
  };


  return {
    control,
    errors,
    binaryOptions,
    numberOptions,
    handleSubmit,
    onNext,
    onSaveExit,
    isEdit,
    navigation,
    isLoading: isPending || isUpdating,
  };

}
