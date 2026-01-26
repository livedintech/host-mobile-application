import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { navigate } from '@/services/navigationService';
import { BASE_URL_DEV } from '@env';
import Toast from 'react-native-toast-message';

const BASE_URL = BASE_URL_DEV;

export interface MediaItem {
  path: string;
  type: string;
  size?: number;
}

interface UseMediaUploadProps {
  listingId: number | null;
  category: 'interior' | 'exterior' | 'bedroom' | 'bathroom' | 'other';
  nextRoute: string;
  description?: string;
}

export const usePropertyMediaUpload = ({
  listingId,
  category,
  nextRoute,
  description = "Property Photo"
}: UseMediaUploadProps) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Platform specific path handling
  const getBase64 = async (uri: string) => {
    try {
      let filePath = Platform.OS === 'android'
        ? uri.replace('file://', '')
        : decodeURI(uri.replace('file://', ''));
      return await RNFS.readFile(filePath, 'base64');
    } catch (error) {
      console.error("Base64 Conversion Error: ", error);
      return null;
    }
  };

  const handleNext = async () => {
    if (mediaList.length === 0) {
      Alert.alert("Required", `Please upload at least one ${category} photo.`);
      return;
    }

    setIsLoading(true);
    try {
      // Har photo ko base64 mein convert karna
      const photoObjects = await Promise.all(
        mediaList.map(async (item) => {
          const base64String = await getBase64(item.path);
          return {
            url: `data:${item.type};base64,${base64String}`,
            description: description,
            category: category
          };
        })
      );

      const body = {
        listing_id: listingId,
        photos: photoObjects,
      };

      const response = await fetch(`${BASE_URL}api/v2/channelmanagement/create-listing/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: result?.message,
        });
        navigate(nextRoute);
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error: any) {
      Alert.alert("Upload Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndExit = () => {
    // Yahan aap draft ki logic likh sakte hain
    console.log(`Saving ${category} photos as draft...`);
    Toast.show({ type: 'info', text1: 'Draft Saved' });
  };

  return {
    mediaList,
    setMediaList,
    handleNext,
    handleSaveAndExit,
    isLoading
  };
};