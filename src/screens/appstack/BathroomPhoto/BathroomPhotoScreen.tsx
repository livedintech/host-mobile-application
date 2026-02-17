import React from 'react';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { usePropertyMediaUpload } from '@/hooks/usePropertyMediaUpload';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useRoute } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';

const ExteriorPhotoScreen = () => {
    // const { mediaList, setMediaList, handleNext, isLoading, handleSaveAndExit } = usePropertyMediaUpload({
    //     listingId: listing_id,
    //     category: 'bathroom',
    //     nextRoute: NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE
    // });
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
    category: 'bathroom', // ya 'exterior' ya jaisa bhi screen ho
    nextRoute: !isEdit
        ? NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE
        : undefined,
    exitRoute: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS, // 👈 ADD
    mode: isEdit ? 'edit' : 'create',
    initialMedia: existingPhotos.map((p: any) => ({
        path: p.url,
        type: p.type || 'image/jpeg',
    })),
});


    return (
        // <PhotoUploadTemplate
        //     screenTitle="Add Photos & Videos"
        //     sectionTitle="Bathroom Photos & Videos"
        //     maxImages={10}
        //     maxVideos={1}
        //     mediaList={mediaList}
        //     onMediaChange={setMediaList}
        //     primaryBtnTitle="Next"
        //     onPrimaryPress={handleNext}
        //     primaryLoading={isLoading}
        //     secondaryBtnTitle="Save & Exit"
        //     primaryDisable={mediaList.length === 0 || isLoading}
        //     onSecondaryPress={handleSaveAndExit}
        //     secondaryLoading={false}
        //     secondaryDisable={isLoading}
        //     isFetching={false}
        //     loading={false}
        // />
         <PhotoUploadTemplate
            screenTitle="Add Photos & Videos"
            sectionTitle="Bathroom Photos & Videos"
            maxImages={10}
            maxVideos={1}
            mediaList={mediaList}
            onMediaChange={setMediaList}
            primaryBtnTitle={!isEdit ? 'Next' : null}
            // onPrimaryPress={!isEdit ? handleNext : undefined}
            onPrimaryPress={()=> navigate(NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE)}
            primaryLoading={isLoading}
            primaryDisable={mediaList.length === 0 || isLoading}
            secondaryBtnTitle="Save & Exit"
            onSecondaryPress={handleSaveAndExit}
            secondaryLoading={false}
            secondaryDisable={isLoading}
            percentage={30}
        />
    );
};

export default ExteriorPhotoScreen;