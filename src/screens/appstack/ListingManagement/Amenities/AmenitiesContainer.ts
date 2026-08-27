import { useState, useEffect } from 'react';
import i18n from '@/locales/i18n/i18n';
import { useRoute } from '@react-navigation/native';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { navigate, goBack, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getAmenitiesApi, CreateUpdateAmenitiesApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import useListingExport from '@/hooks/useListingExport';

export default function useAmenitiesContainer() {
  const { user } = useAuthStore();
  const { listing_id, channel_id, updateListing, listing: propertyDetail } = useCreateListingStore();
  const { params } = useRoute<any>();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    const initial = isEdit ? (listing?.amenities ?? []) : [];
    setSelectedAmenities(initial);
  }, []);

  // ── Export ────────────────────────────────────────────────────────────────
  const {
    bottomSheetVisible,
    setBottomSheetVisible,
    handleExport,
    handleExportSubmit,
    handleOtaSubmit,
    otaControl,
    otaErrors,
    listingOptions,
    isPendingExporting,
  } = useListingExport();

  // ── Fetch amenities list ──────────────────────────────────────────────────
  const { data: rawAmenities = [], isLoading: isLoadingAmenities,refetch } = useQuery({
    queryKey: [STORAGE_CONST.AMENITIES],
    queryFn:  getAmenitiesApi,
  });

  const toggleAmenity = (key: string) => {
    setSelectedAmenities(prev =>
      prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key],
    );
  };

  const buildPayload = () => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: 0,
    amenities:     selectedAmenities,
  });

  const { mutate: syncAmenities, isPending } = useMutation({
    mutationFn: CreateUpdateAmenitiesApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err?.response?.data?.message || err.message || i18n.t('common.toast.something_went_wrong') }),
  });

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
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        if (isEdit) {
          goBack();
        } else {
          resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any);
        }
      },
    });
  };

  const amenitiesList = [...rawAmenities].sort((a: any, b: any) =>
    a.label.localeCompare(b.label),
  );

  return {
    amenitiesList,
    selectedAmenities,
    toggleAmenity,
    onNext,
    onSaveExit,
    isLoading:         isPending,
    isLoadingAmenities,
    isEdit,
    // ✅ Export
    handleExport,
    handleExportSubmit,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting,
    refetch
  };
}