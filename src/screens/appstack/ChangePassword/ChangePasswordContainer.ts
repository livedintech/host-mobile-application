import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { ChangePasswordFormValues, changePasswordSchema } from '@/validation/auth/authSchemas';
import { goBack } from '@/services/navigationService';

export default function useChangePasswordContainer() {
  const navigation = useNavigation();

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
    mutationFn: async (data: ChangePasswordFormValues) => {
      // API Call logic here
      console.log('Changing password...', data);
    },
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Password changed successfully' });
      reset();
      navigation.goBack();
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error.message || 'Failed to change password' });
    }
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    // changePassword(data);
    goBack()
  };

  return { control, errors, handleSubmit, onSubmit, isLoading: false, navigation };
}