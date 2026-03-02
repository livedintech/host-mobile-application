import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { profileFormValues, profileSchema } from '@/validation/auth/authSchemas';
import { useCallback } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';

export default function useProfileContainer() {
  const navigation = useNavigation();
  const { user } = useAuthStore();

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
  } = useForm<profileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      full_name: user?.name || '',  
      gender: user?.gender || '',  
      country: user?.country || '', 
      city: user?.city || '',  
      address: '',              
      phone_country: phoneData.phone_country,
      phone_number: phoneData.phone_number,
    },
  });

  const goToChangePassword = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.CHANGE_PASSWORD);
  }, []);

  const onSave = (data: profileFormValues) => {
    const payload = {
      name: data.full_name,
      gender: data.gender,
      country: data.country,
      city: data.city,
      address: data.address,
      phone: `${data.phone_country.callingCode}${data.phone_number}`,
    };

    console.log('Final API Payload:', payload);
    // updateProfile(payload);
  };

  return {
    control,
    errors,
    handleSubmit,
    onSave,
    isLoading: false,
    navigation,
    watch,
    goToChangePassword
  };
}