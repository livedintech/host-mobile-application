import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { useState } from 'react';

export interface MediaItem {
  path: string;
  type: string;
  size?: number;
}

export const useInteriorPhotoContainer = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  const handleNext = () => {
    console.log("Saving Interior Media...", mediaList);
    navigate(NavigationRoutes.APP_STACK.EXTERIOR_PHOTOS_VIDEOS)
  };

  const handleSaveAndExit = () => {
    console.log("Saving as draft and exiting...");
  };

  return {
    setMediaList,
    handleNext,
    handleSaveAndExit,
    mediaList
  };
};