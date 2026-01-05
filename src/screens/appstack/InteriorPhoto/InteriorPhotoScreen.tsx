import React from 'react';
import PhotoUploadTemplate from '@/components/templates/PhotoUploadTemplate';
import { useInteriorPhotoContainer } from './InteriorPhotoContainer';

const InteriorPhotoScreen = () => {
    const {handleNext,handleSaveAndExit,setMediaList,mediaList} = useInteriorPhotoContainer()
   
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

export default InteriorPhotoScreen;