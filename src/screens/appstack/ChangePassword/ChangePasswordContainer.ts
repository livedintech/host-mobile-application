import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { ChangePasswordFormValues, changePasswordSchema } from '@/validation/auth/authSchemas';
import { goBack } from '@/services/navigationService';
import { changePasswordApi } from '@/services/authApi';
import { useAuthStore } from '@/store/useAuthStore';

export default function useChangePasswordContainer() {
  const navigation = useNavigation();
  const { logout } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: (payload: any) => changePasswordApi(payload),
    onSuccess: (data) => {
      Toast.show({
        type: 'success',
        text1: data?.message || 'Password updated successfully',
      });
      logout();
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error.message || 'Failed to change password' });
    }
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword(data);
    // goBack()
  };

  return { control, errors, handleSubmit, onSubmit, isLoading: false, navigation };
}