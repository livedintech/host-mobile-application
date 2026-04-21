import React from 'react';
import { useRoute } from '@react-navigation/native';

import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';
import { useCreateListingStore } from '@/store/useCreateListingStore';

const OtherPhotosScreen = () => {
  const route = useRoute<any>();
  const { listing_id, listing } = useCreateListingStore();

  const paramListing = route.params?.paramData?.listing;
  const isEdit = Boolean(paramListing?.listing_id);
  const category = route.params?.category || 'other';

  const {
    mediaList,
    setMediaList,
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
    category,
    nextRoute: NavigationRoutes.APP_STACK.EXTERIOR_PHOTOS_VIDEOS,
    exitRoute: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS,
    mode: isEdit ? 'edit' : 'create',
  });

  return (
    <PhotoUploadTemplate
      step={!isEdit ? 'Step 5' : undefined}
      screenTitle="Add Photos & Videos"
      sectionTitle={`${category} Photos & Videos`}
      maxImages={10}
      maxVideos={1}
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

export default OtherPhotosScreen;
