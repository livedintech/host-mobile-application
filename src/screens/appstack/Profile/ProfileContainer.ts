import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { profileFormValues, profileSchema } from '@/validation/auth/authSchemas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteAccountApi } from '@/services/authApi';
import Toast from 'react-native-toast-message';
import { getProfileCitiesApi, getProfileCountriesApi, removeProfilePictureApi, updateProfileApi, uploadProfilePictureApi } from '@/services/profileApi';
import { CityOption, CountryOption, ProfilePicture, UpdateProfilePayload } from '@/types/api/profileTypes';
import STORAGE_CONST from '@/constants/storage';

export default function useProfileContainer() {
  const [isFullViewVisible, setFullViewVisible] = useState(false);
  const navigation = useNavigation();
  const { user, logout, setUser } = useAuthStore();
  const isFirstRender = useRef(true);


  const [selectedImage, setSelectedImage] = useState<ProfilePicture | null>(null);
  const currentProfilePic = user?.profile_picture || null;

  const onImageSelect = (image: ProfilePicture) => {
    setSelectedImage(image);
    uploadImage(image);
  };

  const getInitialPhoneData = () => {
    const phone = user?.phone?.toString() || '';
    const callingCode = user?.phone_with_code?.toString() || '';
    const cca2 = user?.country_code || 'SA';

    return {
      phone_country: {
        cca2: cca2,
        callingCode: callingCode,
      },
      phone_number: phone,
    };
  };

  const phoneData = getInitialPhoneData();

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<profileFormValues>({
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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue('city', undefined, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [selectedCountryId]);

  // ----------------- Update Profile -----------------
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfileApi(payload),
    onSuccess: (data) => {
      if (data?.data) setUser(data.data);
      Toast.show({ type: 'success', text1: data?.message || 'Profile updated!' });
      goBack();
    },
    onError: (error: any) => {
      console.log('Profile update error:', JSON.stringify(error));
      Toast.show({ type: 'error', text1: error?.message || i18n.t('common.toast.failed_update_profile') });
    },
  });

  const goToChangePassword = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.CHANGE_PASSWORD);
  }, []);

  // ----------------- Form Submit -----------------
  const onSave = (data: profileFormValues) => {

    const payload: UpdateProfilePayload = {
  name: data.full_name,
  gender: data.gender,
  country_id: Number(data.country),
  city_id: Number(data.city),
  permanent_address: data.address,
  phone: data.phone_number,
  phone_with_code: data.phone_country.callingCode.replace('+', ''),
  country_code: data.phone_country.cca2,
};
    updateProfile(payload);
  };

  // ----------------- Delete Account -----------------
  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      Toast.show({ type: 'success', text1: i18n.t('common.toast.account_deleted') });
      logout();
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error?.message || i18n.t('common.toast.failed_delete_account') });
    },
  });

  const {
    data: countriesData = [],
    isLoading: isLoadingCountriesData,
    isError: isCountriesError,
    refetch: refetchCountries,
  } = useQuery({
    queryKey: [STORAGE_CONST.PROFILE_COUNTRIES],
    queryFn: getProfileCountriesApi,
  });

  const {
    data: citiesData = [],
    isLoading: isLoadingStatesData,
    isError: isCitiesError,
    refetch: refetchCities,
  } = useQuery({
    queryKey: [STORAGE_CONST.PROFILE_CITIES, selectedCountryId],
    queryFn: () => getProfileCitiesApi({ country_id: Number(selectedCountryId) }),
    enabled: Boolean(selectedCountryId),
  });

  useEffect(() => {
    if (countriesData.length > 0 && user?.country_id) {
      setValue('country', Number(user.country_id), { shouldValidate: false });
    }
  }, [countriesData, user?.country_id, setValue]);

  useEffect(() => {
    if (citiesData.length > 0 && user?.city_id && selectedCountryId) {
      setValue('city', Number(user.city_id), { shouldValidate: false });
    }
  }, [citiesData, user?.city_id, selectedCountryId, setValue]);

  useEffect(() => {
    if (isCountriesError) {
      Toast.show({
        type: 'error',
        text1: i18n.t('common.toast.failed_load_countries', { defaultValue: 'Failed to load countries' }),
      });
    }
  }, [isCountriesError]);

  useEffect(() => {
    if (isCitiesError) {
      Toast.show({
        type: 'error',
        text1: i18n.t('common.toast.failed_load_cities', { defaultValue: 'Failed to load cities' }),
      });
    }
  }, [isCitiesError]);

  // Image Upload
  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: uploadProfilePictureApi,
    onSuccess: (data) => {
      if (data?.data) setUser(data.data);
      setSelectedImage(null);
      Toast.show({ type: 'success', text1: i18n.t('app.profile.photo_updated') });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: i18n.t('common.toast.failed_upload_photo') });
    },
  });

  // Image Remove
  const { mutate: removeImage, isPending: isRemoving } = useMutation({
    mutationFn: removeProfilePictureApi,
    onSuccess: (data) => {
      if (data?.data) setUser(data.data);
      Toast.show({ type: 'success', text1: i18n.t('app.profile.photo_removed') });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: i18n.t('common.toast.failed_remove_photo') });
    },
  });

  const countriesOptions = (countriesData as CountryOption[]).map((item) => ({
    label: item.name,
    value: Number(item.id),
  }));

  const citiesOptions = (citiesData as CityOption[]).map((item) => ({
    label: item.name,
    value: Number(item.id),
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
    isCountriesError,
    isCitiesError,
    refetchCountries,
    refetchCities,
    setFullViewVisible,
    isFullViewVisible,
  };
}