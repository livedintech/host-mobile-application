import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  checkUserisExistFormValues,
  checkUserisExistSchema
} from '@/validation/auth/authSchemas';
import { useMutation } from '@tanstack/react-query';
import {
  CheckUserExistPayload,
  CheckUserExistResponse,
} from '@/types/api/authTypes';
import { CheckUserApi } from '@/services/authApi';
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useState } from 'react';

export default function useLoginWithPhoneContainer() {
  const [phoneNumber, setphoneNumber] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<checkUserisExistFormValues>({
    resolver: yupResolver(checkUserisExistSchema),
    defaultValues: {
      country: { cca2: 'SA', callingCode: '966' },
      phoneNumber: '',
    },
  });

  // ----------------- Normal Login -----------------
  const {
    mutate: checkUserPayload,
    isPending,
    isIdle,
  } = useMutation<CheckUserExistResponse, Error, CheckUserExistPayload>({
    mutationFn: CheckUserApi,
    onSuccess: data => {
      navigate(NavigationRoutes.AUTH_STACK.ENTER_PASSWORD, phoneNumber);
    },
    onError: error => {
      if (error?.message === 'User not found') {
        navigate(NavigationRoutes.AUTH_STACK.MANAGE_LISTING,phoneNumber);
      }
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

  const onSubmit = async (data: checkUserisExistFormValues) => {
    const payload = {
      phone_number: data?.country?.callingCode + +data?.phoneNumber,
    };
    setphoneNumber(payload?.phone_number);
    checkUserPayload(payload);
  };

  return {
    isLoading: isPending && !isIdle,
    control,
    errors,
    watch,
    handleSubmit,
    onSubmit,
  };
}
