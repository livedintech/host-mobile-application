import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { useState } from 'react';

export interface MediaItem {
  path: string;
  type: string;
  size?: number;
}

export const useExteriorPhotoContainer = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  const handleNext = () => {
    navigate(NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE)
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