// AirbnbImportContainer.ts
import i18n from '@/locales/i18n/i18n';
import { useEffect, useCallback } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createListingImportApi,
  getChannexListingsById,
  getUserListingsByUserIDApi,
} from '@/services/bookingManagementApi';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import Toast from 'react-native-toast-message';
import { createListingImportType, creatGathernChannelResponse } from '@/types/api/bookingManagementTypes';

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

  const {
    data: airbnbData,
    isLoading: isLoadingListing,
    isFetching: isFetchingListing,
    refetch: refetchAirbnb,
  } = useQuery({
    queryKey: [STORAGE_CONST.GET_AIRBNB_IMPORT_LISTING, channelId],
    queryFn: () => getChannexListingsById({ channel_id: channelId! }),
    enabled: Boolean(channelId),
  });

  const {
    data: apiResponse,
    isLoading: isLoadingDropdown,
    isFetching: isFetchingDropdown,
    refetch: refetchListings,
  } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id],
    queryFn: () => getUserListingsByUserIDApi({ user: user?.id! }),
    enabled: Boolean(user?.id),
  });

  const listingOptions =
    apiResponse?.data?.map((item: any) => ({
      label: item.name ?? item.title,
      value: String(item.id),
    })) ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({ defaultValues: {} });

  useEffect(() => {
    if (airbnbData && apiResponse) {
      const defaultFormValues: FormValues = {};

      airbnbData.forEach((property: any) => {
        let match: any = null;

        if (property.listing_relations?.[0]?.airbnb_external_listing_id) {
          match = apiResponse.data?.find(
            (item: any) => String(item.id) === String(property.listing_relations[0].airbnb_external_listing_id)
          );
        }

        if (!match && property.listing_relations?.[0]?.other_ota_external_listing_id) {
          match = apiResponse.data?.find(
            (item: any) => String(item.id) === String(property.listing_relations[0].other_ota_external_listing_id)
          );
        }

        if (!match) {
          match = apiResponse.data?.find(
            (item: any) => String(item.id) === String(property.id)
          );
        }

        if (match) {
          defaultFormValues[String(property.id)] = String(match.id);
        }
      });

      reset(defaultFormValues);
    }
  }, [airbnbData, apiResponse, reset]);

  const refetch = useCallback(async () => {
    const [airbnb, listings] = await Promise.all([refetchAirbnb(), refetchListings()]);

    const newAirbnbData = airbnb.data;
    const newApiResponse = listings.data;

    if (newAirbnbData && newApiResponse) {
      const defaultFormValues: FormValues = {};

      newAirbnbData.forEach((property: any) => {
        let match: any = null;

        if (property.listing_relations?.[0]?.airbnb_external_listing_id) {
          match = newApiResponse.data?.find(
            (item: any) => String(item.id) === String(property.listing_relations[0].airbnb_external_listing_id)
          );
        }

        if (!match && property.listing_relations?.[0]?.other_ota_external_listing_id) {
          match = newApiResponse.data?.find(
            (item: any) => String(item.id) === String(property.listing_relations[0].other_ota_external_listing_id)
          );
        }

        if (!match) {
          match = newApiResponse.data?.find(
            (item: any) => String(item.id) === String(property.id)
          );
        }

        if (match) {
          defaultFormValues[String(property.id)] = String(match.id);
        }
      });

      reset(defaultFormValues);
    }
  }, [refetchAirbnb, refetchListings, reset]);

  const { mutate: createListingImportPayload, isPending } = useMutation<
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
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
      });
      Toast.show({ type: 'success', text1: message });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: error.message || i18n.t('common.toast.something_went_wrong'),
      });
    },
  });

  const handleIndividualImport = (fieldName: string, id: any, isImport: boolean) => {
    const selectedValue = watch(fieldName);
    createListingImportPayload({
      channel_id: channelId,
      listing_id: id,
      reimport: isImport,
      local_listin_id: selectedValue,
    });
  };

  const onNext = (_data: FormValues) => {
    resetToRoutes([
      { name: NavigationRoutes.APP_STACK.ROOT_STACK },
      { name: NavigationRoutes.APP_STACK.MANAGE_BOOKING },
    ] as any);
  };

  const isLoading =
    isLoadingListing ||
    isLoadingDropdown ||
    isFetchingListing ||
    isFetchingDropdown ||
    isPending;

  return {
    control,
    errors,
    properties: airbnbData ?? [],
    listingOptions,
    isLoading,
    handleSubmit,
    onNext,
    handleIndividualImport,
    refetch,
    watch,
  };
}