import { RouteProp, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createMapListingbyUserIDApi,
  getChannexListingsById,
  getUserListingsByUserIDApi,
} from '@/services/bookingManagementApi';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import { createMapListingbyUserIDType } from '@/types/api/bookingManagementTypes';
import { CreateAccountResponse } from '@/types/api/authTypes';
import Toast from 'react-native-toast-message';

type FormValues = {
  [key: string]: string;
};

type RouteParams = {
  ch_channel_id: string;
};

export default function useAirbnbImportContainer() {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const channelId = route.params?.ch_channel_id;
  const { user } = useAuthStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_AIRBNB_IMPORT_LISTING, channelId],
    queryFn: () =>
      getChannexListingsById({
        channel_id: channelId!,
      }),
    enabled: Boolean(channelId),
  });

  const { data: apiResponse } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id],
    queryFn: () =>
      getUserListingsByUserIDApi({
        user: user?.id!,
      }),
    enabled: Boolean(user?.id),
  });

  const { mutate: createMapListingbyUserID, isPending } =
    useMutation<CreateAccountResponse, Error, { listing_id: number, channel_id:string }>({
      mutationFn: (payload) =>
        createMapListingbyUserIDApi({
          user: user!.id,
          listing_id: payload.listing_id,
          channel_id: payload.channel_id,

        }),

      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.GET_AIRBNB_IMPORT_LISTING],
        });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id],
        });

        Toast.show({ type: 'success', text1: message });
      },

      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message });
      },
    });


  const listingOptions =
    apiResponse?.data?.map((item: { name: string, id: number }) => ({
      label: item.name,
      value: item.id,
    })) ?? [];

    console.log('listingOptions',listingOptions);
    

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {},
  });

const handleIndividualImport = (fieldName: string) => {
  const selectedValue = watch(fieldName);
  const airbnbListingId = Number(fieldName);

  if (selectedValue) {
    const payload = {
      airbnb_listing_id: airbnbListingId,
      livedin_listing_id: selectedValue,
    };

    console.log('Mapping existing listing:', payload);

    // 👇 Yahan aap ko correct API call karni hogi
    createMapListingbyUserID({
      listing_id: airbnbListingId,
      channel_id:channelId,

    });

    return;
  }

  // Agar dropdown select nahi hua
  createMapListingbyUserID({
    listing_id: airbnbListingId,
   channel_id:channelId,
  });
};


  const onNext = (data: FormValues) => {
    console.log('Final form submit:', data);
    navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
  };

  return {
    control,
    errors,
    properties: data ?? [],
    listingOptions,
    isLoading,
    handleSubmit,
    onNext,
    handleIndividualImport,
    refetch,
    watch
  };
}
