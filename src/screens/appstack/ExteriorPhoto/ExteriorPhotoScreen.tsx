import React from 'react';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import { useExteriorPhotoContainer } from './ExteriorPhotoContainer';

const ExteriorPhotoScreen = () => {
    const {handleNext,handleSaveAndExit,setMediaList,mediaList} = useExteriorPhotoContainer()
   
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
            primaryLoading={false}
            secondaryBtnTitle="Save & Exit"
            onSecondaryPress={handleSaveAndExit}
            secondaryLoading={false}
            isFetching={false} 
            loading={false}
            primaryDisable={!Boolean(mediaList.length)}
        />
    );
};

export default ExteriorPhotoScreen;