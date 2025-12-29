import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import {
  CreateAccountPayload,
  CreateAccountResponse,
} from '@/types/api/authTypes';
import { createAccountApi } from '@/services/authApi';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Toast from 'react-native-toast-message';

// SignUp Schema
const signUpSchema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain letters')
    .matches(/[0-9]/, 'Password must contain numbers')
    .required('Password is required'),
});

export default function useCreateAccountContainer() {
  const { params } = useRoute();
  const phone = params?.phone;
  const listing_count = params?.listing_count;
  

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      password: '',
    },
  });

  const {
    mutate: createAccountPayload,
    isPending,
    isIdle,
  } = useMutation<CreateAccountResponse, Error, CreateAccountPayload>({
    mutationFn: createAccountApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message });
      navigate(NavigationRoutes.AUTH_STACK.PAYMENT,{phone: phone});
    },
    onError: ({ message }) => {
      Toast.show({ type: 'error', text1: message });
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      name: data?.fullName,
      password: data?.password,
      phone_number: phone,
      listing_count: listing_count,
    };
    createAccountPayload(payload);
    console.log('onSubmit', data);
  };

  return {
    isLoading: isPending && !isIdle,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    handleLanguage: () => console.log('AR Toggled'),
  };
}
