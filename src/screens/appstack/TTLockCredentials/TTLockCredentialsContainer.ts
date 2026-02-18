import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DeviceInfo from 'react-native-device-info';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { SmartLockConnectApi } from '@/services/smartLockApi';
import {
  smartLockApiResponseType,
  smartLockConnectPayloadType,
} from '@/types/api/smartLockTypes';

const ttLockSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password too short')
    .required('Password is required'),
});

export default function useTTLockCredentialsContainer() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ttLockSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  // SmartLockConnectApi
  const {
    mutate: SmartLockConnectPayload,
    isPending,
    isIdle,
  } = useMutation<smartLockApiResponseType, Error, smartLockConnectPayloadType>(
    {
      mutationFn: SmartLockConnectApi,
      onSuccess: ({ message }) => {
        Toast.show({
          type: 'success',
          text1: message,
        });
        navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS);
      },
      onError: error => {
        Toast.show({
          type: 'error',
          text1: error.message || 'Something went wrong',
        });
      },
    },
  );

  const onSubmit = (data: { username: string; password: string }) => {
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const payload: smartLockConnectPayloadType = {
      ...data,
      timezone: timezone,
    };
    SmartLockConnectPayload(payload);

  };

  return {
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isPending && !isIdle,
  };
}
