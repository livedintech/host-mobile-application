import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { profileFormValues, profileSchema } from '@/validation/auth/authSchemas';
import { useCallback, useState } from 'react';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { deleteAccountApi } from '@/services/authApi';
import Toast from 'react-native-toast-message';
import { updateProfileApi } from '@/services/profileApi';
import { ProfilePicture, UpdateProfilePayload } from '@/types/api/profileTypes';

export default function useProfileContainer() {
  const navigation = useNavigation();
  const { user, logout, setUser } = useAuthStore();

    // ✅ existing pic bhi state mein rakho
  const [selectedImage, setSelectedImage] = useState<ProfilePicture | null>(null);
  const currentProfilePic = user?.profile_picture || null; // existing server image

   const onImageSelect = (image: ProfilePicture) => {
    setSelectedImage(image); // naya select hua
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
      country: user?.country || '',
      city: user?.city || '',
      address: user?.permanent_address || '',
      phone_country: phoneData.phone_country,
      phone_number: phoneData.phone_number,
    },
  });

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
      // ✅ naya ho toh naya, warna kuch mat bhejo
      profile_picture: selectedImage || undefined,
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
  };
}