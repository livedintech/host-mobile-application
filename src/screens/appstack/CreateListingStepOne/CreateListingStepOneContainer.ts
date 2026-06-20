import { useForm } from 'react-hook-form';
import i18n from '@/locales/i18n/i18n';
import { yupResolver } from '@hookform/resolvers/yup';
import { StepOneFormValues, stepOneSchema } from '@/validation/auth/createListingSchemas';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateListingPayload, CreateListingResponse, getChannelIDResponse } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';
import { createListingApi, createNewListingApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import { navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';

export default function useCreateListingStepOneContainer() {
  const { user } = useAuthStore();
  const { updateListing, setListingId, setChannelId } = useCreateListingStore();

 const propertyOptions = [
  { label: i18n.t('app.create_listing_step1.property_flat_apartment'), value: 'apartment', icon: 'property' },
];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StepOneFormValues>({
    resolver: yupResolver(stepOneSchema),
    defaultValues: {
      propertyType: '',
    },
  });

  const selectedPropertyType = watch('propertyType');
  const isPropertySelected = !!selectedPropertyType && selectedPropertyType !== '';

  const { data, isLoading } = useQuery<getChannelIDResponse>({
    queryKey: [STORAGE_CONST.CREATE_LISTING],
    queryFn: () =>
      createNewListingApi({
        user: user?.id!,
      }),
  });

  const {
    mutate: createListingPayload,
    isPending,
  } = useMutation<CreateListingResponse, Error, CreateListingPayload>({
    mutationFn: createListingApi,
    retry: false,
    onSuccess: ({ message, data }) => {
      Toast.show({
        type: 'success',
        text1: message || i18n.t('common.toast.listing_created'),
      });
      setListingId(data?.listing_id);
      navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE_SET_LOCATION);
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || i18n.t('common.toast.something_went_wrong'),
      });
    },
  });

  const channelID = data?.data?.[0]?.ch_channel_id;
  const isChannelMissing = !channelID;

  const onNext = (data: StepOneFormValues) => {
    updateListing({
      property_type_category: data?.propertyType,
      name: '',
    });
    
    // channelID && setChannelId(channelID);
    
    const payload = {
      // channel_id: channelID,
      user_id: Number(user?.id),
      payload: {
        listing: {
          property_type_category: data?.propertyType,
          name: i18n.t('common.new_listing'),
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

    channelID && setChannelId(channelID);
    
    const payload = {
      channel_id: channelID,
      user_id: Number(user?.id),
      payload: {
        listing: {
          property_type_category: data?.propertyType,
          name: i18n.t('common.new_listing'),
        },
      },
    };

    createListingPayload(payload, {
      onSuccess: ({ message, data }) => {
        Toast.show({
          type: 'success',
          text1: message || i18n.t('common.toast.listing_saved'),
        });

        setListingId(data?.listing_id);

        resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any);
      },
    });
  });

  return {
    control,
    errors,
    propertyOptions,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading: isPending || isLoading,
    isChannelMissing,
    isPropertySelected,
  };
}