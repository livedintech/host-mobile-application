import { useEffect } from 'react';
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
import { CreateAccountResponse } from '@/types/api/authTypes';
import Toast from 'react-native-toast-message';

type FormValues = {
  [key: string]: string; // key = Airbnb property id, value = Livedin listing id
};

type RouteParams = {
  ch_channel_id: string;
};

export default function useAirbnbImportContainer() {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const channelId = route.params?.ch_channel_id;
  const { user } = useAuthStore();

  // Fetch Airbnb listings for this channel
  const { data: airbnbData, isLoading:isLoadingListing, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_AIRBNB_IMPORT_LISTING, channelId],
    queryFn: () =>
      getChannexListingsById({
        channel_id: channelId!,
      }),
    enabled: Boolean(channelId),
  });

  // Fetch user listings (for dropdown options)
  const { data: apiResponse,isLoading:isLoadingDropdown } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id],
    queryFn: () =>
      getUserListingsByUserIDApi({
        user: user?.id!,
      }),
    enabled: Boolean(user?.id),
  });

  // Prepare dropdown options (values must be strings)
  const listingOptions = apiResponse?.data?.map((item: any) => ({
  label: item.name,
  value: String(item.listing_id), // internal Livedin ID for dropdown
})) ?? [];


  // Initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {}, // initially empty
  });

  // When data loads, set default values for pre-selected dropdowns
useEffect(() => {
  if (airbnbData && apiResponse) {
    const defaultFormValues: FormValues = {};

    airbnbData.forEach((property: any) => {
      // Match Airbnb property with user listing by ID
      const match = apiResponse.data?.find((item: any) => item.id === property.id);

      if (match) {
        // value = internal Livedin listing_id (for dropdown)
        defaultFormValues[String(property.id)] = String(match.listing_id);
      }
    });

    reset(defaultFormValues); // prefill dropdowns
  }
}, [airbnbData, apiResponse, reset]);


  // Mutation to map Airbnb listing to Livedin listing
  const { mutate: createMapListingbyUserID } =
    useMutation<CreateAccountResponse, Error, { listing_id: number; }>({
      mutationFn: (payload) =>
        createMapListingbyUserIDApi({
          user: user!.id,
          listing_id: payload.listing_id,
          // channel_id: payload.channel_id,
        }),
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.GET_AIRBNB_IMPORT_LISTING, channelId],
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

  // Handle individual import (dropdown selection)
  const handleIndividualImport = (fieldName: string) => {
    const selectedValue = watch(fieldName);
    const airbnbListingId = Number(fieldName);

    createMapListingbyUserID({
      listing_id: airbnbListingId,
      // channel_id: channelId!,
    });

    console.log('Mapping Airbnb listing:', {
      airbnb_listing_id: airbnbListingId,
      livedin_listing_id: selectedValue,
    });
  };

  // Final submit
  const onNext = (data: FormValues) => {
    console.log('Final form submit:', data);
    navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
  };

  return {
    control,
    errors,
    properties: airbnbData ?? [],
    listingOptions,
    isLoading : isLoadingDropdown || isLoadingListing,
    handleSubmit,
    onNext,
    handleIndividualImport,
    refetch,
    watch,
  };
}
