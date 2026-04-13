import { useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createListingImportApi,
  createListingImportGathernApi,
  createMapListingbyUserIDApi,
  getChannexListingsById,
  getChannexListingsGathernById,
  getUserListingsByUserIDApi,
} from '@/services/bookingManagementApi';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import { CreateAccountResponse } from '@/types/api/authTypes';
import Toast from 'react-native-toast-message';
import { createListingImportGathernType, createListingImportType, creatGathernChannelResponse } from '@/types/api/bookingManagementTypes';

type FormValues = {
  [key: string]: string; // key = Airbnb property id, value = Livedin listing id
};

type RouteParams = {
  ch_channel_id: string;
};

export default function useGathernImportContainer() {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const channelId = route.params?.ch_channel_id;
  const { user } = useAuthStore();

  // Fetch Airbnb listings for this channel
  const { data: airbnbData, isLoading: isLoadingListing, isFetching: isFetchingListing, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_GATHERN_IMPORT_LISTING, channelId],
    queryFn: () =>
      getChannexListingsGathernById({
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
  value: String(item.id), // ✅ FIX HERE (was listing_id)
})) ?? [];


  // Initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
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
    createListingImportGathernType
  >({
    mutationFn: createListingImportGathernApi,
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
  const userListings = apiResponse?.data ?? [];

  // Handle individual import (dropdown selection)
 const handleIndividualImport = (
  fieldName: string,
  propertyTitle: string,
  rate?: number,
  availability?: number,
) => {
  const selectedValue = watch(fieldName);


const parentListingId = Number(selectedValue);
  const airbnbListingId = Number(fieldName);

  const basePayload = {
    mapping_type: 'gathern',
    pms_uuid: channelId,
    property_id: airbnbListingId.toString(),
    property_title: propertyTitle,
  };

  const hasMapping = !!selectedValue;

  const payload = hasMapping
    ? {
        ...basePayload,
        parent_listing_id: parentListingId, // ✅ FIXED
      }
    : {
        ...basePayload,
        rate,
        availability: 1,
      };

  createListingImportPayload(payload);
};

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
    isMappingLoading; // mutation running


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
    setValue
  };
}
