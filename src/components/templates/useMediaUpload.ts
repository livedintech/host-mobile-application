import { useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert } from 'react-native';

export interface MediaItem {
  path: string;
  type: string;
  size?: number;
  isUploading?: boolean;
}

interface UseMediaUploadProps {
  maxImages: number;
  maxVideos: number;
  mediaList: MediaItem[];
  onMediaChange: (list: MediaItem[]) => void;
}

export const useMediaUpload = ({
  maxImages,
  maxVideos,
  mediaList,
  onMediaChange,
}: UseMediaUploadProps) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  // Constants for Validation
  const MAX_VIDEO_SIZE_MB = 20;
  const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;
  const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];
  const ALLOWED_VIDEO_FORMATS = ['video/mp4'];

  const isVideo = (mime: string) => mime.toLowerCase().includes('video');
  const isImage = (mime: string) => mime.toLowerCase().includes('image');

  // Helper to validate and add media to the list
  const validateAndAddMedia = (files: any | any[]) => {
  const incomingFiles = Array.isArray(files) ? files : [files];
  const currentImages = mediaList.filter((item) => isImage(item.type)).length;
  const currentVideos = mediaList.filter((item) => isVideo(item.type)).length;

  let validFiles: MediaItem[] = [];
  let errorMsg = '';

  for (const file of incomingFiles) {
    const mime = file.mime.toLowerCase();
    const size = file.size || 0;

    const isValidFormat = [...ALLOWED_IMAGE_FORMATS, ...ALLOWED_VIDEO_FORMATS].includes(mime);
    if (!isValidFormat) {
      errorMsg = 'Invalid format. Only JPG, PNG, and MP4 are allowed.';
      continue;
    }

    if (isImage(mime)) {
      const totalImages = currentImages + validFiles.filter((f) => isImage(f.type)).length;
      if (totalImages < maxImages) {
        validFiles.push({ path: file.path, type: mime, size });
      } else {
        errorMsg = `Limit reached: Maximum ${maxImages} images allowed.`;
      }
    }

    if (isVideo(mime)) {
      const totalVideos = currentVideos + validFiles.filter((f) => isVideo(f.type)).length;
      if (totalVideos < maxVideos) {
        if (size <= MAX_VIDEO_SIZE_BYTES) {
          validFiles.push({ path: file.path, type: mime, size });
        } else {
          errorMsg = `Video is too large. Limit is ${MAX_VIDEO_SIZE_MB}MB.`;
        }
      } else {
        errorMsg = `Limit reached: Maximum ${maxVideos} video allowed.`;
      }
    }
  }

  if (validFiles.length > 0) {
    onMediaChange(validFiles); // ✅ sirf naye files — mediaList merge nahi karo
  }

  if (errorMsg) {
    Alert.alert('Upload Restriction', errorMsg);
  }

  setPopupVisible(false);
};

  const uploadActions = {
    fromGallery: () => {
      ImagePicker.openPicker({
        multiple: true,
        mediaType: 'any',
      })
        .then(validateAndAddMedia)
        .catch((err) => {
          if (err.code !== 'E_PICKER_CANCELLED') console.log('Gallery Error:', err);
        });
    },
    takePhoto: () => {
      ImagePicker.openCamera({
        mediaType: 'photo',
      })
        .then(validateAndAddMedia)
        .catch((err) => {
          if (err.code !== 'E_PICKER_CANCELLED') console.log('Camera Error:', err);
        });
    },
    recordVideo: () => {
      ImagePicker.openCamera({
        mediaType: 'video',
      })
        .then(validateAndAddMedia)
        .catch((err) => {
          if (err.code !== 'E_PICKER_CANCELLED') console.log('Video Error:', err);
        });
    },
  };

  const removeMedia = (index: number) => {
    const updatedList = mediaList.filter((_, i) => i !== index);
    onMediaChange(updatedList);
  };

  return {
    isPopupVisible,
    setPopupVisible,
    uploadActions,
    removeMedia,
    handlePick: () => setPopupVisible(true),
  };
};