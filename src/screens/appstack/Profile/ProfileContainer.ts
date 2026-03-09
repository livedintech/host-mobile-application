import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { profileFormValues, profileSchema } from '@/validation/auth/authSchemas';
import { useCallback, useMemo } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteAccountApi, updateProfileApi } from '@/services/authApi';
import Toast from 'react-native-toast-message';
import { getCountriesApi, getProfileCitiesApi } from '@/services/userManagement';

export default function useProfileContainer() {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();

  const { data: countriesData, isLoading: isCountriesLoading } = useQuery({
    queryKey: ['COUNTRIES_LIST'],
    queryFn: getCountriesApi,
  });

  const countryOptions = useMemo(() => {
    if (!countriesData) return [];
    return countriesData.map((country: any) => ({
      label: country.name,
      value: String(country.id),
    }));
  }, [countriesData]);

  const getInitialPhoneData = () => {
    const rawPhone = user?.phone?.toString() || '';
    
    if (!rawPhone) {
      return {
        phone_country: { cca2: 'SA', callingCode: '966' },
        phone_number: '',
      };
    }

    // Split based on "966" prefix for Saudi Arabia
    if (rawPhone.startsWith('966')) {
      return {
        phone_country: { cca2: 'SA', callingCode: '966' },
        phone_number: rawPhone.replace('966', ''), // e.g., "99993333"
      };
    }

    return {
      phone_country: { cca2: 'SA', callingCode: '966' },
      phone_number: rawPhone,
    };
  };

  const phoneData = getInitialPhoneData();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<profileFormValues>({
    resolver: yupResolver(profileSchema) as any,
    defaultValues: {
      full_name: user?.name || '',  
      gender: user?.gender || '',  
      country: user?.country_id ? String(user.country_id) : '',
      city: user?.city_id ? String(user.city_id) : '',
      address: '',              
      phone_country: phoneData.phone_country,
      phone_number: phoneData.phone_number,
      profile_picture: null
    },
  });

  const selectedCountryId = watch('country');

  const { data: citiesData, isLoading: isCitiesLoading } = useQuery({
    queryKey: ['CITIES_LIST', selectedCountryId],
    queryFn: () => getProfileCitiesApi(selectedCountryId),
    enabled: !!selectedCountryId,
  });

  const cityOptions = useMemo(() => {
    return (citiesData || []).map((c: any) => ({
      label: c.name,
      value: String(c.id),
    }));
  }, [citiesData]);

  const onCountryChange = () => {
    setValue('city', '');
  };

  const goToChangePassword = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.CHANGE_PASSWORD);
  }, []);

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (response) => {
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });
      // Invalidate user query to fetch fresh data across the app
      // queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_USER] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Failed to update profile',
      });
    },
  });

  const onSave = (data: profileFormValues) => {
    console.log('^^^^data', typeof(data?.country))
    const formData = new FormData();
    
    formData.append('name', data.full_name);
    formData.append('gender', data.gender);
    formData.append('permanent_address', data.address);

    if (data.country) {
      formData.append('country_id', String(Number(data.country)));
    }
    
    if (data.city) {
      formData.append('city_id', String(Number(data.city)));
    }
    
    
    formData.append('email', ''); 
    formData.append('phone', '');

    // Image handling
    if (data.profile_picture?.uri) {
      formData.append('profile_picture', {
        uri: data.profile_picture.uri,
        name: data.profile_picture.name || 'image.jpg',
        type: data.profile_picture.type || 'image/jpeg',
      } as any);
    }

  updateProfile(formData);
};

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: (data) => {
      console.log('Sucesssss')
      Toast.show({
        type: 'success',
        text1: 'Account deleted successfully',
      });
      logout();
    },
    onError: (error: any) => {
      console.log('Errorrr')
      Toast.show({
        type: 'error',
        text1: error?.message || 'Failed to delete account',
      });
    },
  });

  return {
    control,
    errors,
    handleSubmit,
    onSave,
    isLoading: false,
    navigation,
    watch,
    goToChangePassword,
    deleteAccount,
    isDeleting,
    countryOptions,
    cityOptions,
    isCountriesLoading,
    isCitiesLoading,
    onCountryChange,
    selectedCountryId,
    setValue
  };
}

