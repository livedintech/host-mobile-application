import { useForm } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StepTwoFormValues, stepTwoSchema } from '@/validation/auth/createListingSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createEditAmenitiesPayloadType, CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import { useAuthStore } from '@/store/useAuthStore';
import STORAGE_CONST from '@/constants/storage';
import { createListingDetailsApi, CreateUpdateAmenitiesApi, editListingApi, getAmenitiesApi } from '@/services/ createListingService';

export default function useAboutThePlaceContainer() {
  const { user } = useAuthStore();
  const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const navigation = useNavigation();
  const { params } = useRoute();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id);

  const binaryOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  const numberOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  const { control, handleSubmit, formState: { errors } } = useForm<StepTwoFormValues>({
    resolver: yupResolver(stepTwoSchema),
    defaultValues: {
      size_sqm: listing?.size_sqm ? String(listing.size_sqm) : '',
      bedrooms: listing?.bedrooms ? String(listing.bedrooms) : '',
      beds: listing?.beds ? String(listing.beds) : '',
      kitchen: listing?.kitchen === true ? 'true' : listing?.kitchen === false ? 'false' : '',
      pool: listing?.pool === true ? 'true' : listing?.pool === false ? 'false' : '',
      long_term_stay: listing?.long_term_stay === true ? 'true' : listing?.long_term_stay === false ? 'false' : '',
      min_gap_night: listing?.min_gap_night ? String(listing.min_gap_night) : '',
      min_nights: listing?.min_nights ? String(listing.min_nights) : '',
      max_nights: listing?.max_nights ? String(listing.max_nights) : '',
      amenities: listing?.amenities || [],
    },
  });

  const { data: getAmunitiesResponse, isLoading: isLoadingGetAmunities } = useQuery({
    queryKey: [STORAGE_CONST.AMENITIES],
    queryFn: getAmenitiesApi,
  });

  const mappedAmenities = (getAmunitiesResponse || []).map((item: string) => ({
    label: item.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: item,
  }));

  // ---- Mutations ----
  const { mutate: createListingDetailsPayload, isPending: isCreating } = useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
    mutationFn: createListingDetailsApi,
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  const { mutate: updateAmenities, isPending: isUpdatingAmenities } = useMutation<CreateListingDetailsResponse, Error, createEditAmenitiesPayloadType>({
    mutationFn: CreateUpdateAmenitiesApi,
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Amenities updated successfully' });
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  // ---- Helpers ----
  const handleAmenitiesUpdate = (amenities: string[], currentListingId: string) => {
    if (!amenities?.length || !currentListingId) return;
    updateAmenities({ listing_id: currentListingId, amenities, channel_id });
  };

  const buildPayload = (data: StepTwoFormValues, overrideListingId?: string): CreateListingDetailsPayload => ({
    channel_id,
    listing_id: overrideListingId || listing_id,
    user_id: Number(user?.id),
    listing: {
      size_sqm: Number(data.size_sqm),
      bedrooms: Number(data.bedrooms),
      beds: Number(data.beds),
      kitchen: data.kitchen === 'true',
      pool: data.pool === 'true',
      long_term_stay: data.long_term_stay === 'true',
      min_gap_night: Number(data.min_gap_night),
      min_nights: Number(data.min_nights),
      max_nights: Number(data.max_nights),
      name: propertyDetail?.name || 'New Listing',
    },
  });

  // ---- Handlers ----
  const onNext = (data: StepTwoFormValues) => {
        navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS);
return false
    createListingDetailsPayload(buildPayload(data), {
      onSuccess: (res) => {
        const createdListingId = res?.listing_id || listing_id;
        handleAmenitiesUpdate(data.amenities, createdListingId);
        navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS);
      },
    });
  };

  const onSaveExit = (data: StepTwoFormValues) => {
    if (isEdit) {
      updateListingDetails(buildPayload(data, listing?.listing_id || listing_id), {
        onSuccess: () => {
          handleAmenitiesUpdate(data.amenities, listing?.listing_id || listing_id);
          goBack();
        },
      });
    } else {
      createListingDetailsPayload(buildPayload(data), {
        onSuccess: (res) => {
          const createdListingId = res?.listing_id || listing_id;
          handleAmenitiesUpdate(data.amenities, createdListingId);
          navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
        },
      });
    }
  };

  return {
    control,
    errors,
    binaryOptions,
    numberOptions,
    handleSubmit,
    onNext,
    onSaveExit,
    isEdit,
    navigation,
    isLoading: isCreating || isUpdating || isUpdatingAmenities,
    getAmunities: mappedAmenities || [],
    isLoadingGetAmunities,
  };
}