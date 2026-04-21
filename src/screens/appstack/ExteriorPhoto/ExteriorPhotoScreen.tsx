// ExteriorPhotoScreen.tsx
import React from 'react';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useRoute } from '@react-navigation/native';

const ExteriorPhotoScreen = () => {
  const route = useRoute<any>();
  const { listing_id } = useCreateListingStore();

  const paramListing = route.params?.paramData?.listing;
  const isEdit = Boolean(paramListing?.listing_id);

  const {
    mediaList,
    deletePhoto,
    setCoverPhoto,
    handleNext,
    handleSaveAndExit,
    isLoading,
    isFetching,
    isDeleting,
    refetchPhotos,
    uploadNewPhotos
  } = usePropertyMediaUpload({
    listingId: String(listing_id),
    category: 'exterior',
    nextRoute: NavigationRoutes.APP_STACK.BATHROOM_PHOTOS_VIDEOS,
    exitRoute: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS,
    mode: isEdit ? 'edit' : 'create',
  });

  return (
    <PhotoUploadTemplate
      step={!isEdit ? 'Step 3' : undefined}
      screenTitle="Add Photos & Videos"
      sectionTitle="Exterior Photos & Videos"
      maxImages={10}
      maxVideos={1}
      percentage={25}
      mediaList={mediaList}
      onDelete={deletePhoto}
      onSetCover={setCoverPhoto}
      isFetching={isFetching}
      primaryBtnTitle={!isEdit ? 'Next' : undefined}
      onPrimaryPress={handleNext}
      primaryLoading={isLoading}
      secondaryBtnTitle="Save & Exit"
      onSecondaryPress={handleSaveAndExit}
      secondaryLoading={isLoading}
      onMediaChange={uploadNewPhotos}
      onRefresh={refetchPhotos}
      isDeleting={isDeleting}
    />
  );
};

export default ExteriorPhotoScreen;