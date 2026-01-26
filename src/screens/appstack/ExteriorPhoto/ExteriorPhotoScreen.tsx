import React from 'react';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import { useExteriorPhotoContainer } from './ExteriorPhotoContainer';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';
import { useCreateListingStore } from '@/store/useCreateListingStore';

const ExteriorPhotoScreen = () => {
    const { listing_id } = useCreateListingStore();
    const { mediaList, setMediaList, handleNext, isLoading, handleSaveAndExit } = usePropertyMediaUpload({
        listingId: listing_id,
        category: 'exterior',
        nextRoute: NavigationRoutes.APP_STACK.BATHROOM_PHOTOS_VIDEOS
    });

    return (
        <PhotoUploadTemplate
            screenTitle="Add Photos & Videos"
            sectionTitle="Exterior Photos & Videos"
            maxImages={10}
            maxVideos={1}
            mediaList={mediaList}
            onMediaChange={setMediaList}
            primaryBtnTitle="Next"
            onPrimaryPress={handleNext}
            primaryLoading={isLoading}
            secondaryBtnTitle="Save & Exit"
            onSecondaryPress={handleSaveAndExit}
            secondaryLoading={false}
            isFetching={false}
            loading={false}
            primaryDisable={mediaList.length === 0 || isLoading}
            secondaryDisable={isLoading}
        />
    );
};

export default ExteriorPhotoScreen;