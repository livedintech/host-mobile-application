import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { goBack, navigate } from '@/services/navigationService';
import Toast from 'react-native-toast-message';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getListingPhotosApi,
  uploadListingPhotosApi,
  deleteListingPhotoApi,
  setFeaturedPhotoApi,
} from '@/services/ createListingService';
import i18n from '@/locales/i18n/i18n';

export interface MediaItem {
  path: string;
  type: string;
  size?: number;
  id?: number;        // ✅ primary key — delete ke liye
  external_id?: string | null; // ✅ null aa sakta hai
  isExisting?: boolean;
  isFeatured?: boolean;
}

interface UsePropertyMediaUploadProps {
  listingId: string | number | null;
  category: 'interior' | 'exterior' | 'bedroom' | 'bathroom' | 'other';
  nextRoute?: string;
  exitRoute?: string;
  description?: string;
  mode?: 'create' | 'edit';
}

export const usePropertyMediaUpload = ({
  listingId,
  category,
  nextRoute,
  description = 'Property Photo',
  mode = 'create',
  exitRoute,
}: UsePropertyMediaUploadProps) => {
  const { listing_id, channel_id } = useCreateListingStore();
  const effectiveListingId = String(listingId || listing_id);

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  // ── GET photos ────────────────────────────────────────────────────────────
  const { isFetching, data: photosData, refetch: refetchPhotos } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_PHOTOS, effectiveListingId, category],
    queryFn: () => getListingPhotosApi({ listing_id: effectiveListingId }),
    enabled: Boolean(effectiveListingId),
  });

  // ✅ v5 — useEffect se photos set karo
  useEffect(() => {
    if (photosData?.data?.photos) {
      const photos = photosData.data.photos;
      const categoryKey = Object.keys(photos).find(
        key => key.toLowerCase() === category.toLowerCase()
      );
      const categoryPhotos = categoryKey ? photos[categoryKey] : [];
      const existing: MediaItem[] = categoryPhotos.map((p: any) => ({
        path: p.url,
        type: 'image/jpeg',
        id: p.id,
        external_id: p.external_id,
        isExisting: true,
        isFeatured: p.is_featured,
      }));
      setMediaList(existing);
    }
  }, [photosData]);

  // ── Base64 helper ─────────────────────────────────────────────────────────
  const getBase64 = async (uri: string): Promise<string | null> => {
    try {
      const filePath = Platform.OS === 'android'
        ? uri.replace('file://', '')
        : decodeURI(uri.replace('file://', ''));
      return await RNFS.readFile(filePath, 'base64');
    } catch (error) {
      console.error('Base64 error:', error);
      return null;
    }
  };

  // ── POST upload ───────────────────────────────────────────────────────────
  const { mutate: uploadMutate, isPending: isUploading } = useMutation({
    mutationFn: uploadListingPhotosApi,
    onSuccess: () => {
      Toast.show({ type: 'success', text1: i18n.t('app.photo_upload.photos_uploaded') });
      refetchPhotos(); // ✅ GET se fresh photos aayenge — tab show honge
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.LISTING_PHOTOS] });

      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
    },
    onError: (err: any) => {
      // ✅ Local state touch nahi kiya — kuch remove karne ki zarurat nahi
      Alert.alert(i18n.t('app.photo_upload.upload_error_title'), err?.message || i18n.t('common.toast.something_went_wrong'))
    },
  });
  // ── DELETE ────────────────────────────────────────────────────────────────
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteListingPhotoApi,
    onSuccess: () => {
      refetchPhotos();
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.LISTING_PHOTOS] });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      Toast.show({ type: 'success', text1: i18n.t('app.photo_upload.photo_deleted') });
    },
    onError: (err: any) => {
      Toast.show({ type: 'error', text1: err?.message || i18n.t('app.photo_upload.delete_failed') });
    },
  });

  // ── COVER ─────────────────────────────────────────────────────────────────
  const { mutate: coverMutate } = useMutation({
    mutationFn: setFeaturedPhotoApi,
    onSuccess: (_: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.LISTING_PHOTOS] });
      setMediaList(prev =>
        prev.map(m => ({ ...m, isFeatured: m.id === variables.media_id }))
      );
      Toast.show({ type: 'success', text1: i18n.t('app.photo_upload.cover_photo_set') });
    },
    onError: (err: any) => {
      Toast.show({ type: 'error', text1: err?.message || i18n.t('app.photo_upload.cover_photo_failed') });
    },
  });

  // ── Image select — immediately upload ─────────────────────────────────────
  const uploadNewPhotos = async (newItems: MediaItem[]) => {
    if (!newItems.length) return;

    // ✅ Local state mein ADD MAT KARO — sirf API hit karo
    try {
      const photoObjects = await Promise.all(
        newItems.map(async item => {
          const base64String = await getBase64(item.path);
          return {
            url: base64String || item.path,
            description,
            category,
          };
        })
      );

      uploadMutate({
        listing_id: effectiveListingId,
        channel_id,
        save_and_exit: 0,
        photos: photoObjects,
      });
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Something went wrong');
    }
  };
  // ── Delete ────────────────────────────────────────────────────────────────
  const deletePhoto = (index: number) => {
    const item = mediaList[index];

    if (!item.id) {
      Toast.show({ type: 'error', text1: i18n.t('app.photo_upload.cannot_delete') });
      return;
    }

    deleteMutate({
      media_id: item.id,           // ✅ id use karo
      listing_id: effectiveListingId,
    });
  };
  // ── Cover ─────────────────────────────────────────────────────────────────
  const setCoverPhoto = (index: number) => {
    const item = mediaList[index];

    if (!item.id) {
      Toast.show({ type: 'error', text1: i18n.t('app.photo_upload.not_uploaded_yet') });
      return;
    }

    coverMutate({
      listing_id: effectiveListingId,
      media_id: item.id,
    });
  };

  // ── Next — sirf navigate ──────────────────────────────────────────────────
  const handleNext = () => {
    if (mediaList.length === 0) {
      Alert.alert(i18n.t('app.photo_upload.upload_required'), i18n.t('app.photo_upload.upload_required_desc', { category }))
      return;
    }
    if (nextRoute) navigate(nextRoute);
  };

  // ── Save & Exit — sirf navigate ───────────────────────────────────────────
  const handleSaveAndExit = () => {
    if (mediaList.length === 0) {
      Alert.alert(i18n.t('app.photo_upload.upload_required'), i18n.t('app.photo_upload.upload_required_desc', { category }))
      return;
    }
    if (mode === 'edit') {
      goBack();
    } else if (exitRoute) {
      navigate(exitRoute);
    }
  };

  return {
    mediaList,
    setMediaList,
    uploadNewPhotos,
    deletePhoto,
    setCoverPhoto,
    handleNext,
    handleSaveAndExit,
    isLoading: isUploading,
    isFetching,
    refetchPhotos,
    isDeleting
  };
};