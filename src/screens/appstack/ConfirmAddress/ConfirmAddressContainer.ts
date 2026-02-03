import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addressSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation } from '@tanstack/react-query';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';

export type AddressFormValues = {
  name: string;
  country_code: { cca2?: string, name?: string, callingCode?:number };
  state: string;
  city: string;
  street: string;
  apt: string;
};

export default function useConfirmAddressContainer() {
  const { params } = useRoute();
  const { updateListing, listing_id, channel_id,listing:propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore()
  const navigation = useNavigation();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      name: listing?.name || 'New Listing',
      country_code: { cca2: listing?.country_code || '',name: listing?.country_name },
      state: listing?.state || '',
      city: listing?.city || '',
      street: listing?.street || '',
      apt: listing?.apt || '',
    },
  });


  console.log('errors',propertyDetail?.name);
  

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
  // editListingApi
  const {
    mutate: editListingDetailsPayload,
    isPending:isPendingEdit,
    isIdle:isIdleEdit,
  } = useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
    mutationFn: editListingApi,
    onSuccess: ({ message }) => {
       queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS, listing_id],
      });
      Toast.show({
        type: 'success',
        text1: message || 'Something went wrong',
      });

      goBack()
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
        lat: propertyDetail.lat,
        lng: propertyDetail.lng,
        name: 'New Listing', 
      }
    }
    createListingDetailsPayload(payload)
  };

  const onSaveExit = (data: AddressFormValues) => {
    const payload = {
      channel_id,
      listing_id,
      user_id: Number(user?.id),
      listing: {
        country_code: data.country_code?.cca2,
        state: data.state,
        city: data.city,
        street: data.street,
        apt: data.apt,
        name: propertyDetail?.name,
      }
    }
    editListingDetailsPayload(payload)
  };

  return {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    navigation,
    isLoading: isPending && !isIdle || isPendingEdit && !isIdleEdit,
    isEdit
  };
}
