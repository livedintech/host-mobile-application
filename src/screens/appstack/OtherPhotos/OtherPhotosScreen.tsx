import React from 'react';
import { useRoute } from '@react-navigation/native';

import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useTranslation } from 'react-i18next';

const OtherPhotosScreen = () => {
  const route = useRoute<any>();
  const { t } = useTranslation();

  const { listing_id, listing } = useCreateListingStore();

  const isEdit = route.params?.isEdit;
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
step={!isEdit ? t('app.photo_upload.step_5') : undefined}
      screenTitle={t('app.photo_upload.other_title')}
      sectionTitle={t('app.photo_upload.other_section', { category })}
      maxImages={10}
      maxVideos={1}
      mediaList={mediaList}
      onDelete={deletePhoto}
      onSetCover={setCoverPhoto}
      isFetching={isFetching}
      primaryBtnTitle={!isEdit ? t('app.photo_upload.next') : undefined}
      onPrimaryPress={handleNext}
      primaryLoading={isLoading}
      secondaryBtnTitle={t('app.photo_upload.save_exit')}
      onSecondaryPress={handleSaveAndExit}
      secondaryLoading={isLoading}
      onMediaChange={uploadNewPhotos}
      onRefresh={refetchPhotos}
      isDeleting={isDeleting}
    />
  );
};

export default OtherPhotosScreen;
