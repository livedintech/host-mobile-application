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
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useCreateListingStepOneContainer() {
  const { user } = useAuthStore()
  const { updateListing } = useCreateListingStore()
  const navigation = useNavigation();

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
    onSuccess: ({ message, data }) => {
      updateListing({
        property_type_category: data?.listing_id
      })
      Toast.show({
        type: 'success',
        text1: message || 'Something went wrong',
      });
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

    const payload = {
      user_id: Number(user?.id),
      payload: {
        listing: {
          property_type_category: data?.propertyType,
          name: 'New Listing'
        }
      }
      // property_type_category: data?.propertyType
    }
    createListingPayload(payload)
  };

  const onSaveExit = () => {
    console.log('Saving and Exiting...');
    navigation.goBack();
  };

  return {
    control, errors, propertyOptions, handleSubmit, onNext, onSaveExit, navigation, isLoading: isPending && !isIdle,
  };
}