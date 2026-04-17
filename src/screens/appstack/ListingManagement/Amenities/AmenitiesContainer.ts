import { useState, useEffect } from 'react';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getAmenitiesApi, CreateUpdateAmenitiesApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

export default function useAmenitiesContainer() {
  const { user } = useAuthStore();
  const { listing_id, channel_id, updateListing, listing: storeListing } = useCreateListingStore();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Amenities list fetch karna
  const { data: rawAmenities } = useQuery({
    queryKey: ['amenities-list'],
    queryFn: getAmenitiesApi,
  });

  // Store se selected items load karna
  useEffect(() => {
    if (storeListing?.amenities) {
      setSelectedAmenities(storeListing.amenities);
    }
  }, [storeListing?.amenities]);

  const toggleAmenity = (key: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  // API Call handling with onSuccess/onError logic inside mutation
  const { mutate: syncAmenities, isPending } = useMutation({
    mutationFn: CreateUpdateAmenitiesApi,
    onSuccess: (res) => {
      console.log('testing');
      
      // updateListing({ amenities: selectedAmenities });
      navigate(NavigationRoutes.APP_STACK.MAKE_PROPERTY_STAND_OUT); 
      // Alert.alert('TEST')
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err.message || "Failed to update amenities";
      Toast.show({ type: 'error', text1: errorMessage });
    },
  });

  const buildPayload = () => ({
    user_id: String(user?.id),
    channel_id: String(channel_id),
    listing_id: String(listing_id),
    save_and_exit: 0,
    // Root level par amenities (as per your API type)
    amenities: selectedAmenities, 
    listing: {
      // Professional placeholder name for validation
      name: storeListing?.name || "New Listing", 
      property_type_category: storeListing?.property_type_category || "",
      size_sqm: Number(storeListing?.size_sqm || 0),
      guest_limit: Number(storeListing?.guest_limit || 0),
      bedrooms: Number(storeListing?.bedrooms || 0),
      beds: Number(storeListing?.beds || 0),
      bathrooms: Number(storeListing?.bathrooms || 0),
    },
  });

  const onNext = () => {
    syncAmenities(buildPayload() as any); // Cast as any if TS is still strict
  };

  return {
    amenitiesList: rawAmenities || [],
    selectedAmenities,
    toggleAmenity,
    onNext,
    isLoading: isPending,
  };
}