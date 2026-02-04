import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { goBack, navigate } from '@/services/navigationService';
import { BASE_URL_DEV } from '@env';
import Toast from 'react-native-toast-message';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { useCreateListingStore } from '@/store/useCreateListingStore';

const BASE_URL = BASE_URL_DEV;

export interface MediaItem {
  path: string;
  type: string;
  size?: number;
}

interface UseMediaUploadProps {
  listingId: string;
  category: 'interior' | 'exterior' | 'bedroom' | 'bathroom' | 'other';
  nextRoute?: string;
  description?: string;
  mode?: 'create' | 'edit';
  initialMedia?: MediaItem[];
}

export const usePropertyMediaUpload = ({
  listingId,
  category,
  nextRoute,
  description = 'Property Photo',
  mode = 'create',
  initialMedia = [],
}: UseMediaUploadProps) => {
  const { listing_id } = useCreateListingStore()
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [isLoading, setIsLoading] = useState(false);

  // Platform specific path handling
  const getBase64 = async (uri: string) => {
    try {
      const filePath =
        Platform.OS === 'android'
          ? uri.replace('file://', '')
          : decodeURI(uri.replace('file://', ''));

      return await RNFS.readFile(filePath, 'base64');
    } catch (error) {
      console.error('Base64 Conversion Error: ', error);
      return null;
    }
  };

  // -----------------------------
  // COMMON UPLOAD FUNCTION
  // -----------------------------
  const uploadMedia = async (): Promise<boolean> => {
    if (mediaList.length === 0) {
      Alert.alert('Required', `Please upload at least one ${category} photo.`);
      return false;
    }

    try {
      const photoObjects = await Promise.all(
        mediaList.map(async item => {
          const base64String = item.path.startsWith('http')
            ? null
            : await getBase64(item.path);

          return {
            url: base64String
              ? `${base64String}`
              : item.path,
            description,
            category,
          };
        }),
      );

      const body = {
        listing_id: listingId,
        photos: photoObjects,
      };

      const url =
        mode === 'edit'
          ? `${BASE_URL}api/v2/channelmanagement/create-listing/photos`
          : `${BASE_URL}api/v2/channelmanagement/create-listing/photos`;

      const response = await fetch(url, {
        method: mode === 'edit' ? 'POST' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Upload failed');
      }
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS],
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });

      Toast.show({
        type: 'success',
        text1: result?.message || 'Uploaded successfully',
      });

      return true;
    } catch (error: any) {
      Alert.alert(
        'Upload Error',
        error?.message || 'Something went wrong',
      );
      return false;
    }
  };

  // -----------------------------
  // NEXT (CREATE MODE)
  // -----------------------------
  const handleNext = async () => {
    if (mode === 'edit') return;

    setIsLoading(true);

    const success = await uploadMedia();

    setIsLoading(false);

    if (success && nextRoute) {
      navigate(nextRoute);
    }
  };

  // -----------------------------
  // SAVE & EXIT (EDIT MODE)
  // -----------------------------
  const handleSaveAndExit = async () => {
    setIsLoading(true);

    const success = await uploadMedia();

    setIsLoading(false);

    if (success) {
      goBack();
    }
  };

  return {
    mediaList,
    setMediaList,
    handleNext,
    handleSaveAndExit,
    isLoading,
  };
};
