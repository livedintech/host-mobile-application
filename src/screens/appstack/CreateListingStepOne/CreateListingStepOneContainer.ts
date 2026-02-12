import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { StepOneFormValues, stepOneSchema } from '@/validation/auth/createListingSchemas';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation } from '@tanstack/react-query';
import { CreateListingPayload, CreateListingResponse } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';
import { createListingApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useCreateListingStepOneContainer() {
  const { user } = useAuthStore()
  const { updateListing, setListingId, setChannelId } = useCreateListingStore()

  const propertyOptions = [
    { label: 'Apartment', value: 'apartment' },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StepOneFormValues>({
    resolver: yupResolver(stepOneSchema),
    defaultValues: {
      propertyType: '',
    },
  });

  const {
    mutate: createListingPayload,
    isPending,
    isIdle,
  } = useMutation<CreateListingResponse, Error, CreateListingPayload>({
    mutationFn: createListingApi,
    retry: false,
    onSuccess: ({ message, data }) => {
      Toast.show({
        type: 'success',
        text1: message || 'Listing created successfully',
      });
      setListingId(data?.listing_id);
      navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE_SET_LOCATION);
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });


  const onNext = (data: StepOneFormValues) => {

    updateListing({
      property_type_category: data?.propertyType,
      name:''
    });
    setChannelId("9bd50e4a-9336-44a2-93b9-dac6f9f8b57b")
    const payload = {
      channel_id: "9bd50e4a-9336-44a2-93b9-dac6f9f8b57b",
      user_id: Number(user?.id),
      payload: {
        listing: {
          property_type_category: data?.propertyType,
          name: 'New Listing',
        },
      },
    };

    createListingPayload(payload);
  };


const onSaveExit = handleSubmit((data: StepOneFormValues) => {
  updateListing({
    property_type_category: data?.propertyType,
    name: '',
  });

  setChannelId('9bd50e4a-9336-44a2-93b9-dac6f9f8b57b');

  const payload = {
    channel_id: '9bd50e4a-9336-44a2-93b9-dac6f9f8b57b',
    user_id: Number(user?.id),
    payload: {
      listing: {
        property_type_category: data?.propertyType,
        name: 'New Listing',
      },
    },
  };

  createListingPayload(payload, {
    onSuccess: ({ message, data }) => {
      Toast.show({
        type: 'success',
        text1: message || 'Listing saved successfully',
      });

      setListingId(data?.listing_id);

      navigate(
        NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS
      );
    },
  });
});


  return {
    control, errors, propertyOptions, handleSubmit, onNext, onSaveExit, isLoading: isPending && !isIdle,
  };
}