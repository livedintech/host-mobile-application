import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { addressSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation } from '@tanstack/react-query';
import { createListingDetailsApi } from '@/services/ createListingService';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/useAuthStore';

export type AddressFormValues = {
  name: string;
  country_code: { cca2: string };
  state: string;
  city: string;
  street: string;
  apt: string;
};

export default function useConfirmAddressContainer() {
  const { updateListing, listing_id,channel_id } = useCreateListingStore();
  const { user } = useAuthStore()
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      name: 'New Listing',
      country_code: { cca2: '' },
      state: '',
      city: '',
      street: '',
      apt: '',
    },
  });

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
      navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE);
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });


  const onNext = (data: AddressFormValues) => {
    updateListing({
      country_code: data.country_code?.cca2 || '',
      state: data.state,
      city: data.city,
      street: data.street,
      apt: data.apt,
    });
    const payload = {
      channel_id,
      listing_id,
      user_id: Number(user?.id),
      listing: {
        country_code: data.country_code?.cca2 || '',
        state: data.state,
        city: data.city,
        street: data.street,
        apt: data.apt,
        name: 'New Listing',
      }
    }
    createListingDetailsPayload(payload)
  };

  const onSaveExit = () => {
    console.log('Progress Saved. Exiting...');
  };

  return {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    navigation,
    isLoading: isPending && !isIdle
  };
}
