// useAmenitiesContainer.ts
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getAmenitiesApi, CreateUpdateAmenitiesApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

export default function useAmenitiesContainer() {
  const { user } = useAuthStore();
  const { listing_id, channel_id, updateListing, listing: propertyDetail } = useCreateListingStore();
  const { params } = useRoute<any>();

  const listing  = params?.paramData?.listing;
  const isEdit   = Boolean(listing?.listing_id);

  // ── Local selection state ─────────────────────────────────────────────────
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // ── Seed from edit params OR store ───────────────────────────────────────
  useEffect(() => {
  const initial = isEdit
    ? (listing?.amenities ?? [])        // ✅ Edit mode — params se
    : [];                               // ✅ Create mode — empty
  setSelectedAmenities(initial);
}, []);

  // ── Fetch amenities list ──────────────────────────────────────────────────
  const { data: rawAmenities = [], isLoading: isLoadingAmenities } = useQuery({
    queryKey: [STORAGE_CONST.AMENITIES],
    queryFn:  getAmenitiesApi,
  });

  // ── Toggle ────────────────────────────────────────────────────────────────
  const toggleAmenity = (key: string) => {
    setSelectedAmenities(prev =>
      prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key],
    );
  };

  // ── Payload builder ───────────────────────────────────────────────────────
  // Note: CreateUpdateAmenitiesApi has its own endpoint — amenities at root level
  const buildPayload = () => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: 0,
    amenities:     selectedAmenities, // root level — as per CreateUpdateAmenitiesApi
  });

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { mutate: syncAmenities, isPending } = useMutation({
    mutationFn: CreateUpdateAmenitiesApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err?.response?.data?.message || err.message || 'Something went wrong' }),
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const onNext = () => {
    updateListing({ amenities: selectedAmenities });

    syncAmenities(buildPayload() as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.MAKE_PROPERTY_STAND_OUT),
    });
  };

  const onSaveExit = () => {
    updateListing({ amenities: selectedAmenities });

    syncAmenities(buildPayload() as any, {
      onSuccess: () => {
        if (isEdit) {
          queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
          queryClient.invalidateQueries({
            queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
          });
        }
        navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
      },
    });
  };

  return {
    amenitiesList:     rawAmenities,
    selectedAmenities,
    toggleAmenity,
    onNext,
    onSaveExit,        // ← screen mein "Save & Exit" button ko yeh pass karo
    isLoading:         isPending,
    isLoadingAmenities,
    isEdit,
  };
}