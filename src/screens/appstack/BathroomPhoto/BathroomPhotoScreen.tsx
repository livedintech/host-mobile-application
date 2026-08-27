import React from 'react';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useRoute } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import { useTranslation } from 'react-i18next';

const BathroomPhotoScreen = () => {
  const route = useRoute<any>();
  const { t } = useTranslation();

  const { listing_id } = useCreateListingStore();

  const paramListing = route.params?.paramData?.listing;
  const isEdit = Boolean(paramListing?.listing_id);

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
    uploadNewPhotos,
  } = usePropertyMediaUpload({
    listingId: String(listing_id),
    category: 'bathroom',
    nextRoute: NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE,
    exitRoute: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS,
    mode: isEdit ? 'edit' : 'create',
  });

  return (
    <PhotoUploadTemplate
      // step={!isEdit ? t('app.photo_upload.step_4') : undefined}
      screenTitle={t('app.photo_upload.exterior_title')}
      sectionTitle={t('app.photo_upload.bathroom_section')}
      maxImages={10}
      maxVideos={1}
      percentage={30}
      mediaList={mediaList}
      onDelete={deletePhoto}
      onSetCover={setCoverPhoto}
      isFetching={isFetching}
      isEdit={isEdit}
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

export default BathroomPhotoScreen;