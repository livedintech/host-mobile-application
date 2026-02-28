import { RouteProp, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createMapListingbyUserIDApi,
  getChannexListingsById,
  getGathernListingApi,
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

export default function useGathernImportContainer() {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const channelId = route.params?.ch_channel_id;
  const { user } = useAuthStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_GATHERN_LISTINGS_USER_ID, channelId],
    queryFn: () =>
      getGathernListingApi({
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
  useMutation<CreateAccountResponse, Error, { listing_id: number }>({
    mutationFn: (payload) =>
      createMapListingbyUserIDApi({
        user: user!.id,
        listing_id: payload.listing_id,
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
    apiResponse?.data?.map((item: { title: string, id: number }) => ({
      label: item.title,
      value: item.id,
    })) ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {},
  });

  const handleIndividualImport = (fieldName: number) => {
  const selectedValue = watch(fieldName);
  const airbnbListingId = Number(fieldName);

  if (selectedValue) {
    const payload = {
      airbnb_listing_id: airbnbListingId,
      livedin_listing_id: selectedValue,
    };

    console.log('Mapping existing listing:', payload);
    return;
  }

  createMapListingbyUserID({
    listing_id: airbnbListingId,
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
