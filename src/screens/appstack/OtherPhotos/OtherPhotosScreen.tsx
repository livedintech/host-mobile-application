import React from 'react';
import { useRoute } from '@react-navigation/native';

import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';
import { useCreateListingStore } from '@/store/useCreateListingStore';

const OtherPhotosScreen = () => {
  const route = useRoute<any>();
  const { isEdit = false, existingPhotos = [],category = '' } = route.params || {};

  const { listing_id } = useCreateListingStore();

const {
  mediaList,
  setMediaList,
  handleNext,
  handleSaveAndExit,
  isLoading,
} = usePropertyMediaUpload({
  listingId: listing_id,
  category: category,
  nextRoute: !isEdit
    ? NavigationRoutes.APP_STACK.EXTERIOR_PHOTOS_VIDEOS
    : undefined,
  exitRoute: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS,
  mode: isEdit ? 'edit' : 'create',
  initialMedia: existingPhotos.map((p: any) => ({
    path: p.url,
    type: p.type || 'image/jpeg',
  })),
});


  return (
    <PhotoUploadTemplate
      step=""
      screenTitle="Add Photos & Videos"
      sectionTitle={`${category} Photos & Videos`}
      maxImages={10}
      maxVideos={1}
      mediaList={mediaList}
      onMediaChange={setMediaList}
      primaryBtnTitle={!isEdit ? 'Next' : null}
      onPrimaryPress={!isEdit ? handleNext : undefined}
      primaryLoading={isLoading}
      primaryDisable={mediaList.length === 0 || isLoading}
      secondaryBtnTitle="Save & Exit"
      onSecondaryPress={handleSaveAndExit}
      secondaryLoading={false}
      secondaryDisable={isLoading}
    />
  );
};

export default OtherPhotosScreen;
