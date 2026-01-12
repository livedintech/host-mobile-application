import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { StepTwoFormValues, stepTwoSchema } from '@/validation/auth/createListingSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi } from '@/services/ createListingService';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import { useAuthStore } from '@/store/useAuthStore';

export default function useAboutThePlaceContainer() {
  const {user} = useAuthStore()
  const { updateListing,listing } = useCreateListingStore();
  const navigation = useNavigation();

  const binaryOptions = [
    { label: 'Yes', value: 'true' }, // string
    { label: 'No', value: 'false' }  // string
  ];

  const numberOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}` // string to match form values
  }));

  const { control, handleSubmit, formState: { errors } } = useForm<StepTwoFormValues>({
    resolver: yupResolver(stepTwoSchema),
    defaultValues: {
      bedrooms: '',
      beds: '',
      bathrooms: '',
      min_nights: '',
      check_in_time: '',
      check_out_time: '',
      instant_booking: '',
    },
  });

    const {
    mutate: createListingDetailsPayload,
    isPending,
    isIdle,
  } = useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
    mutationFn: createListingDetailsApi,
    onSuccess: data => {
      // navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS);
      // navigate(NavigationRoutes.AUTH_STACK.ENTER_PASSWORD, phoneNumber);
    },
    onError: error => {

      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

  const onNext = (data: StepTwoFormValues) => {
  const currentStepData = {
    bedrooms: Number(data.bedrooms),
    beds: Number(data.beds),
    bathrooms: Number(data.bathrooms),
    min_nights: Number(data.min_nights),
    check_in_time: data.check_in_time,
    check_out_time: data.check_out_time,
    instant_booking: data.instant_booking === 'true',
  };

  const updatedListing = {
    ...listing,
    ...currentStepData,
  };

  updateListing(currentStepData);

  const payload: CreateListingDetailsPayload = {
    user_id: user?.id,
    listing_id: 123,
    listing: updatedListing,
  };
navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS);
  // createListingDetailsPayload(payload);

  console.log('Final API Payload:', payload);
};



  return {
    control,
    errors,
    binaryOptions,
    numberOptions,
    handleSubmit,
    onNext,
    navigation
  };
}
