import React from 'react';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useRoute } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';

const ExteriorPhotoScreen = () => {
    const route = useRoute<any>();
    const { isEdit = false, existingPhotos = [] } = route.params || {};
    const { listing_id } = useCreateListingStore();
  const {
    mediaList,
    setMediaList,
    handleNext,
    handleSaveAndExit,
    isLoading,
} = usePropertyMediaUpload({
    listingId: listing_id,
    category: 'exterior',
    nextRoute: !isEdit
        ? NavigationRoutes.APP_STACK.BATHROOM_PHOTOS_VIDEOS
        : undefined,
    exitRoute: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS, // 👈 ADD
    mode: isEdit ? 'edit' : 'create',
    initialMedia: existingPhotos.map((p: any) => ({
        path: p.url,
        type: p.type || 'image/jpeg',
    })),
});


    return (
        <PhotoUploadTemplate
            screenTitle="Add Photos & Videos"
            sectionTitle="Exterior Photos & Videos"
            maxImages={10}
            maxVideos={1}
            mediaList={mediaList}
            onMediaChange={setMediaList}
            primaryBtnTitle={!isEdit ? 'Next' : null}
            // onPrimaryPress={!isEdit ? handleNext : undefined}
             onPrimaryPress={()=> navigate(NavigationRoutes.APP_STACK.BATHROOM_PHOTOS_VIDEOS)}
            primaryLoading={isLoading}
            primaryDisable={mediaList.length === 0 || isLoading}
            secondaryBtnTitle="Save & Exit"
            onSecondaryPress={handleSaveAndExit}
            secondaryLoading={false}
            secondaryDisable={isLoading}
            percentage={25}
        />
    );
};

export default ExteriorPhotoScreen;