import React from 'react';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';

const ExteriorPhotoScreen = () => {
    const { mediaList, setMediaList, handleNext, isLoading, handleSaveAndExit } = usePropertyMediaUpload({
        listingId: 123,
        category: 'bathroom',
        nextRoute: NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE
    });

    return (
        <PhotoUploadTemplate
            screenTitle="Add Photos & Videos"
            sectionTitle="Bathroom Photos & Videos"
            maxImages={10}
            maxVideos={1}
            mediaList={mediaList}
            onMediaChange={setMediaList}
            primaryBtnTitle="Next"
            onPrimaryPress={handleNext}
            primaryLoading={isLoading}
            secondaryBtnTitle="Save & Exit"
            primaryDisable={mediaList.length === 0 || isLoading}
            onSecondaryPress={handleSaveAndExit}
            secondaryLoading={false}
            secondaryDisable={isLoading}
            isFetching={false}
            loading={false}
            
        />
    );
};

export default ExteriorPhotoScreen;