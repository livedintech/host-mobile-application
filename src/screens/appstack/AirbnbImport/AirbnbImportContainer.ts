import { useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createListingImportApi,
  createMapListingbyUserIDApi,
  getChannexListingsById,
  getUserListingsByUserIDApi,
} from '@/services/bookingManagementApi';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import { CreateAccountResponse } from '@/types/api/authTypes';
import Toast from 'react-native-toast-message';
import { createListingImportType, creatGathernChannelResponse } from '@/types/api/bookingManagementTypes';

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
  const { data: airbnbData, isLoading: isLoadingListing, isFetching: isFetchingListing, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_AIRBNB_IMPORT_LISTING, channelId],
    queryFn: () =>
      getChannexListingsById({
        channel_id: channelId!,
      }),
    enabled: Boolean(channelId),
  });

  // Fetch user listings (for dropdown options)
  const { data: apiResponse, isLoading: isLoadingDropdown, isFetching: isFetchingDropdown } = useQuery({
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
    value: String(item.id), // ✅ listing_id nahi, id use karo
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
        // ✅ id se id match karo
        const match = apiResponse.data?.find(
          (item: any) => String(item.id) === String(property.id)
        );

        if (match) {
          // ✅ value mein item.id set karo (kyunke listingOptions ka value = item.id hai)
          defaultFormValues[String(property.id)] = String(match.id);
        }
      });

      reset(defaultFormValues); // ✅ dropdown pre-select ho jayega
    }
  }, [airbnbData, apiResponse, reset]);


  // Mutation to map Airbnb listing to Livedin listing
  const { mutate: createMapListingbyUserID, isPending: isMappingLoading, isIdle: isIdleMapping } =
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

  const { mutate: createListingImportPayload, isPending, isIdle } = useMutation<
    creatGathernChannelResponse,
    Error,
    createListingImportType
  >({
    mutationFn: createListingImportApi,
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
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
      console.log('error', error);

    },
  });

  // Handle individual import (dropdown selection)
  // const handleIndividualImport = (fieldName: string) => {


  //   const selectedValue = watch(fieldName);
  //   const airbnbListingId = Number(fieldName);

  //   if(selectedValue){
  //     createMapListingbyUserID({
  //     listing_id: airbnbListingId,
  //     // channel_id: channelId!,
  //   });
  //   }else{
  //     createListingImportPayload({
  //       channel_id: channelId,
  //       listing_id: airbnbListingId
  //     })

  //   }

  //   // createMapListingbyUserID({
  //   //   listing_id: airbnbListingId,
  //   //   // channel_id: channelId!,
  //   // });

  //   console.log('Mapping Airbnb listing:', {
  //     airbnb_listing_id: airbnbListingId,
  //     livedin_listing_id: selectedValue,
  //   });
  // };
  const handleIndividualImport = (fieldName: string, id: any, isImport: boolean) => {
    const selectedValue = watch(fieldName);
    createListingImportPayload({ channel_id: channelId, listing_id: id, reimport: isImport, local_listin_id: selectedValue });
  };

  // const handleIndividualImport = (fieldName: string, id: any, isMap: boolean) => {
  //   const selectedValue = watch(fieldName);
  //   const isMatch = String(selectedValue) === String(id);

  //   console.log('=== DEBUG ===');
  //   console.log('fieldName:', fieldName);
  //   console.log('id:', id, typeof id);
  //   console.log('selectedValue:', selectedValue, typeof selectedValue);
  //   console.log('isMatch:', isMatch);
  //   console.log('isMap:', isMap);
  //   console.log('=============');

  //   if (selectedValue && isMatch) {
  //     createMapListingbyUserID({ listing_id: Number(id) });
  //   } else {
  //     createListingImportPayload({ channel_id: channelId, listing_id: id });
  //   }
  // };

  // Final submit
  const onNext = (data: FormValues) => {
    console.log('Final form submit:', data);
    navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
  };

  const isLoadingScreen =
    isLoadingListing || // initial fetch Airbnb listings
    isLoadingDropdown || // initial fetch user listings
    isFetchingListing || // refetch Airbnb listings
    isFetchingDropdown || // refetch user listings
    isMappingLoading ||
    isPending; // mutation running


  return {
    control,
    errors,
    properties: airbnbData ?? [],
    listingOptions,
    isLoading: isLoadingScreen,
    handleSubmit,
    onNext,
    handleIndividualImport,
    refetch,
    watch,
  };
}
