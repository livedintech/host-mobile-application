import React from 'react';
import { useRoute } from '@react-navigation/native';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { MediaItem, usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useTranslation } from 'react-i18next';

const InteriorPhotoScreen = () => {
  const route = useRoute<any>();
  const { listing_id } = useCreateListingStore();
  const { t } = useTranslation();


  const paramListing = route.params?.paramData?.listing;
  const isEdit = Boolean(paramListing?.listing_id);

  const {
    mediaList,
    uploadNewPhotos,
    deletePhoto,
    setCoverPhoto,
    handleNext,
    handleSaveAndExit,
    isLoading,
    isFetching,
    refetchPhotos,
    isDeleting
  } = usePropertyMediaUpload({
    listingId: String(listing_id),
    category: 'interior',
    nextRoute: NavigationRoutes.APP_STACK.EXTERIOR_PHOTOS_VIDEOS,
    exitRoute: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS,
    mode: isEdit ? 'edit' : 'create',
  });

  return (
    <PhotoUploadTemplate
   step={!isEdit ? t('app.photo_upload.step_2') : undefined}
      screenTitle={t('app.photo_upload.interior_title')}
      sectionTitle={t('app.photo_upload.interior_section')}
      maxImages={15}
      maxVideos={1}
      percentage={20}
      mediaList={mediaList}
      onMediaChange={uploadNewPhotos}  // ✅ directly uploadNewPhotos
      onDelete={deletePhoto}
      onSetCover={setCoverPhoto}
      isFetching={isFetching}
      primaryBtnTitle={!isEdit ? t('app.photo_upload.next') : undefined}
      onPrimaryPress={handleNext}
      primaryLoading={isLoading}
      secondaryBtnTitle={t('app.photo_upload.save_exit')}
      onSecondaryPress={handleSaveAndExit}
      secondaryLoading={isLoading}
      onRefresh={refetchPhotos}
      isDeleting={isDeleting}
    />
  );
};

export default InteriorPhotoScreen;