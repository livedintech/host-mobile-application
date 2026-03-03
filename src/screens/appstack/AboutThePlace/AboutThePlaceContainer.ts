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
import { queryClient } from '@/services/api';

export default function useAboutThePlaceContainer() {
  const { user, } = useAuthStore();
  const { listing_id, channel_id, listing: propertyDetail, updateListing } = useCreateListingStore();
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
    size_sqm: listing?.property_area
      ? String(listing.property_area)
      : '',

    bedrooms: listing?.bedrooms
      ? String(listing.bedrooms)
      : '',

    beds: listing?.beds
      ? String(listing.beds)
      : '',

    kitchen:
      listing?.has_kitchen === 1 || listing?.has_kitchen === true
        ? 'true'
        : listing?.has_kitchen === 0 || listing?.has_kitchen === false
        ? 'false'
        : '',

    pool:
      listing?.has_pool === 1 || listing?.has_pool === true
        ? 'true'
        : listing?.has_pool === 0 || listing?.has_pool === false
        ? 'false'
        : '',

    long_term_stay:
  listing?.long_term_stay === 1 || listing?.long_term_stay === true
    ? 'true'
    : listing?.long_term_stay === 0 || listing?.long_term_stay === false
    ? 'false'
    : '',


    min_gap_night: listing?.min_gap_night
      ? String(listing.min_gap_night)
      : '',

    min_nights: listing?.min_nights
      ? String(listing.min_nights)
      : '',

    max_nights: listing?.max_nights
      ? String(listing.max_nights)
      : '',

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
      // Toast.show({ type: 'success', text1: 'Amenities updated successfully' });
       queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }) => {
       queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
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

  const buildPayload = (data: StepTwoFormValues, isSaveAndExit: boolean = false): CreateListingDetailsPayload => ({
    user_id: String(user?.id),
    channel_id,
    listing_id: String(listing_id),
    // save_and_exit: isSaveAndExit ? 1 : 0,
    save_and_exit: 0,

    listing: {
      name: propertyDetail?.name || 'New Listing',
      property_area: Number(data.size_sqm), // Swagger key: property_area
      bedrooms: Number(data.bedrooms),
      beds: Number(data.beds),
      kitchen: data.kitchen === 'true',
      has_kitchen: data.kitchen === 'true', // Swagger key
      has_pool: data.pool === 'true',       // Swagger key
      long_term_stay: data.long_term_stay === 'true',
      min_gap_night: Number(data.min_gap_night),
      min_nights: Number(data.min_nights),
      max_nights: Number(data.max_nights),
      maximum_days_stays: Number(data.max_nights), // Swagger key
      amenities: data.amenities,
      bathrooms: 1,
    },
  });

  // ── Handlers ──
  const onNext = (data: StepTwoFormValues) => {
    // 1. Update Store taake local state sync rahe
    updateListing({
      size_sqm: Number(data.size_sqm),
      bedrooms: Number(data.bedrooms),
      beds: Number(data.beds),
      kitchen: data.kitchen === 'true',
      pool: data.pool === 'true',
      amenities: data.amenities,
    });

    // 2. API Hit aur Navigation
    createListingDetailsPayload(buildPayload(data, false), {
      onSuccess: (res) => {
        // Agar amenities alag se update karni hain
        handleAmenitiesUpdate(data.amenities, res?.listing_id || listing_id);
        navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS);
      },
    });
  };

  const onSaveExit = (data: StepTwoFormValues) => {
    const payload = buildPayload(data, true);

    if (isEdit) {
      updateListingDetails(payload, {
        onSuccess: () => {
          handleAmenitiesUpdate(data.amenities, listing_id);
          goBack();
        },
      });
    } else {
      createListingDetailsPayload(payload, {
        onSuccess: (res) => {
          handleAmenitiesUpdate(data.amenities, res?.listing_id || listing_id);
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