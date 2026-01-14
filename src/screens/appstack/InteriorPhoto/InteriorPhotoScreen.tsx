import React from 'react';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';

const InteriorPhotoScreen = () => {
    const { mediaList, setMediaList, handleNext, isLoading, handleSaveAndExit } = usePropertyMediaUpload({
        listingId: 123,
        category: 'interior',
        nextRoute: NavigationRoutes.APP_STACK.EXTERIOR_PHOTOS_VIDEOS
    });

    return (
        <PhotoUploadTemplate
            step="Step 3"
            screenTitle="Add Photos & Videos"
            sectionTitle="Interior Photos & Videos"
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

export default InteriorPhotoScreen;