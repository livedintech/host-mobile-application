import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { resetPasswordApi } from '@/services/authApi';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from '@/types/api/authTypes';

// Validation Schema
const addNewPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function useAddNewPasswordContainer() {
  const { params } = useRoute();
  const phone = params?.phone;
  const otp = params?.otp;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    mutate: resetPasswordPayload,
    isPending,
    isIdle,
  } = useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: resetPasswordApi,
    onSuccess: ({}) => {
      Toast.show({ type: 'success', text1: 'Password updated successfully!' });
      navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error.message || 'Update failed' });
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      phone_number: phone,
      otp: otp,
      password: data?.password,
      password_confirmation: data?.password,
    };
    resetPasswordPayload(payload);
  };

  return {
    isLoading: isPending && !isIdle,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
  };
}
