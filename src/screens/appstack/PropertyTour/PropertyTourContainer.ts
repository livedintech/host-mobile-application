import { useRoute } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useQuery } from '@tanstack/react-query';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { getListingPhotosApi } from '@/services/ createListingService';
import STORAGE_CONST from '@/constants/storage';
import useListingExport from '@/hooks/useListingExport';

// ── Fixed categories with their nav routes ────────────────────────────────
const FIXED_CATEGORIES: { name: string; route: string }[] = [
  { name: 'Bathroom', route: NavigationRoutes.APP_STACK.OTHER_VIDEOS },
  { name: 'Exterior', route: NavigationRoutes.APP_STACK.OTHER_VIDEOS },
  { name: 'Interior', route: NavigationRoutes.APP_STACK.OTHER_VIDEOS },
];

export default function usePropertyTourContainer() {
  const route = useRoute<any>();
  const { listing_id } = useCreateListingStore();
  const { isEdit } = route.params || {};

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

  // ── GET photos ────────────────────────────────────────────────────────────
  const { data: photosData, isFetching, refetch } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_PHOTOS, String(listing_id)],
    queryFn: () => getListingPhotosApi({ listing_id: String(listing_id) }),
    enabled: Boolean(listing_id),
  });

  // ── Normalize photos — API returns [] or {} ───────────────────────────────
  const rawPhotos = photosData?.data?.photos;
  const existingPhotos: Record<string, any[]> =
    rawPhotos && !Array.isArray(rawPhotos) && typeof rawPhotos === 'object'
      ? rawPhotos
      : {};

  // ── Merge fixed + extra API categories (case-insensitive dedup) ───────────
  const apiCategoryNames = Object.keys(existingPhotos);
  const fixedCategoryNames = FIXED_CATEGORIES.map((c) => c.name);

  const extraCategoryNames = apiCategoryNames.filter(
    (apiName) =>
      !fixedCategoryNames.some(
        (fixedName) => fixedName.toLowerCase() === apiName.toLowerCase(),
      ),
  );

  const allCategoryNames = [...fixedCategoryNames, ...extraCategoryNames];

  // ── Build tourData ────────────────────────────────────────────────────────
  const tourData = allCategoryNames.map((categoryName, index) => {
    // case-insensitive match against API keys
    const matchedKey = Object.keys(existingPhotos).find(
      (k) => k.toLowerCase() === categoryName.toLowerCase(),
    );
    const photosArray: any[] = matchedKey ? existingPhotos[matchedKey] : [];
    const featuredPhoto = photosArray.find((p: any) => p.is_featured === true);
    const coverPhoto = featuredPhoto || photosArray[0];
    const coverImage = coverPhoto?.url || null;

    return {
      id:      index.toString(),
      title:   categoryName,
      count:   photosArray.length,
      image:   coverImage,
      isEmpty: photosArray.length === 0, // true = add mode, false = edit mode
    };
  });

  // ── Navigate to correct screen per category ───────────────────────────────
  const handleCardPress = (selectedCategory: string) => {
    const fixed = FIXED_CATEGORIES.find(
      (c) => c.name.toLowerCase() === selectedCategory.toLowerCase(),
    );
    const targetRoute = fixed
      ? fixed.route
      : NavigationRoutes.APP_STACK.OTHER_VIDEOS;

    navigate(targetRoute, {
      isEdit,
      existingPhotos: existingPhotos[selectedCategory] || [],
      category: selectedCategory,
    });
  };

  return {
    tourData,
    handleExport,
    handleExportSubmit,
    handleCardPress,
    isFetching,
    refetch,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting,
  };
}