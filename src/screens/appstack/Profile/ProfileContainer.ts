import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { profileFormValues, profileSchema } from '@/validation/auth/authSchemas';
import { useCallback } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';

export default function useProfileContainer() {
  const navigation = useNavigation();
  const {user} = useAuthStore();
  

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<profileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      full_name: user?.name,
      gender: '',
      country: '',
      city: '',
      address: '',
      phone_country: { cca2: 'SA', callingCode: '966' },
      phone_number: '',
    },
  });

  // Profile Update API Mutation (Example)
  // const { mutate: updateProfile, isPending } = useMutation({
  //   mutationFn: async (payload: any) => {
  //     // Aapki API service yahan aayegi
  //     console.log('API Payload:', payload);
  //   },
  //   onSuccess: () => {
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Profile updated successfully',
  //     });
  //   },
  //   onError: (error: any) => {
  //     Toast.show({
  //       type: 'error',
  //       text1: error.message || 'Failed to update profile',
  //     });
  //   },
  // });

  const goToChangePassword = useCallback(() =>{
    navigate(NavigationRoutes.APP_STACK.CHANGE_PASSWORD)
  },[])

  const onSave = (data: profileFormValues) => {
    const payload = {
      ...data,
      full_phone: `+${data.phone_country.callingCode}${data.phone_number}`,
    };

    console.log('onSave',payload);
    
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