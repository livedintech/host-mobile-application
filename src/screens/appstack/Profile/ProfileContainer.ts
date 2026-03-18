import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { profileFormValues, profileSchema } from '@/validation/auth/authSchemas';
import { useCallback, useState } from 'react';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteAccountApi } from '@/services/authApi';
import Toast from 'react-native-toast-message';
import { getProfileCitiesApi, getProfileCountriesApi, removeProfilePictureApi, updateProfileApi, uploadProfilePictureApi } from '@/services/profileApi';
import { ProfilePicture, UpdateProfilePayload } from '@/types/api/profileTypes';
import STORAGE_CONST from '@/constants/storage';

export default function useProfileContainer() {
  const navigation = useNavigation();
  const { user, logout, setUser } = useAuthStore();

  // ✅ existing pic bhi state mein rakho
  const [selectedImage, setSelectedImage] = useState<ProfilePicture | null>(null);
  const currentProfilePic = user?.profile_picture || null; // existing server image

  // ✅ Image select hone par turant upload
  const onImageSelect = (image: ProfilePicture) => {
    setSelectedImage(image);
    uploadImage(image); // ✅ turant API hit
  };

  const getInitialPhoneData = () => {
    const rawPhone = user?.phone?.toString() || '';
    if (!rawPhone) {
      return { phone_country: { cca2: 'SA', callingCode: '966' }, phone_number: '' };
    }
    if (rawPhone.startsWith('966')) {
      return {
        phone_country: { cca2: 'SA', callingCode: '966' },
        phone_number: rawPhone.replace('966', ''),
      };
    }
    return { phone_country: { cca2: 'SA', callingCode: '966' }, phone_number: rawPhone };
  };

  const phoneData = getInitialPhoneData();

  const { control, handleSubmit, formState: { errors }, watch } = useForm<profileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      full_name: user?.name || '',
      gender: user?.gender || '',
      country: user?.country_id ? Number(user.country_id) : undefined,
      city: user?.city_id ? Number(user.city_id) : undefined,
      address: user?.permanent_address || '',
      phone_country: phoneData.phone_country,
      phone_number: phoneData.phone_number,
    },
  });

  const selectedCountryId = watch('country');
  const selectedCityId = watch('city');

  // ----------------- Update Profile -----------------
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfileApi(payload),
    onSuccess: (data) => {
      // Optionally update local user state
      if (data?.data) setUser(data.data);
      Toast.show({ type: 'success', text1: data?.message || 'Profile updated!' });
      goBack()
    },
    onError: (error: any) => {
      console.log('Profile update error:', JSON.stringify(error));
      Toast.show({ type: 'error', text1: error?.message || 'Failed to update profile' });
    },
  });

  const goToChangePassword = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.CHANGE_PASSWORD);
  }, []);

  // ----------------- Form Submit -----------------
  const onSave = (data: profileFormValues) => {
    const rawPhone = data.phone_number?.startsWith(data.phone_country.callingCode)
      ? data.phone_number
      : `${data.phone_country.callingCode}${data.phone_number}`;

    const payload: UpdateProfilePayload = {
      name: data.full_name,
      gender: data.gender,
      country_id: Number(data.country),
      city_id: Number(data.city),
      permanent_address: data.address,
      phone: rawPhone,
      // ✅ profile_picture bilkul nahi
    };
    updateProfile(payload);
  };

  // ----------------- Delete Account -----------------
  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Account deleted successfully' });
      logout();
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error?.message || 'Failed to delete account' });
    },
  });

  const { data: countriesData = [], isLoading: isLoadingCountriesData } = useQuery({
    queryKey: [STORAGE_CONST.PROFILE_COUNTRIES],
    queryFn: getProfileCountriesApi,
  });

  const { data: citiesData = [], isLoading: isLoadingStatesData } = useQuery({
    queryKey: [STORAGE_CONST.PROFILE_CITIES, selectedCountryId],
    queryFn: () => getProfileCitiesApi({ country_id: Number(selectedCountryId) }),
    enabled: Boolean(selectedCountryId),
  });

  // ✅ Image Upload Mutation
  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: uploadProfilePictureApi,
    onSuccess: (data) => {
      if (data?.data) setUser(data.data); // ✅ store update — MoreScreen par bhi reflect hoga
      setSelectedImage(null);
      Toast.show({ type: 'success', text1: 'Photo updated!' });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: 'Failed to upload photo' });
    },
  });

  // ✅ Image Remove Mutation
  const { mutate: removeImage, isPending: isRemoving } = useMutation({
    mutationFn: removeProfilePictureApi,
    onSuccess: (data) => {
      if (data?.data) setUser(data.data); // ✅ store update
      Toast.show({ type: 'success', text1: 'Photo removed!' });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: 'Failed to remove photo' });
    },
  });

  const countriesOptions = countriesData.map((item: any) => ({
    label: item.name,
    value: item.id,         // number — matches form value with ===
  }));

  const citiesOptions = citiesData.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));


  return {
    control,
    errors,
    handleSubmit,
    onSave,
    isLoading: isUpdating,
    navigation,
    watch,
    goToChangePassword,
    deleteAccount,
    isDeleting,
    onImageSelect,
    selectedImage,
    currentProfilePic,
    removeImage,
    isUploading,
    isRemoving,
    countriesOptions,
    citiesOptions,
    isLoadingCountriesData,
    isLoadingStatesData,
  };
}