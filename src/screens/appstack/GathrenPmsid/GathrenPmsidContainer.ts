import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { queryClient } from '@/services/api';
import { creatGathernChannelApi } from '@/services/bookingManagementApi';
import { navigate } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import { CreateAccountResponse } from '@/types/api/authTypes';
import { creatGathernChannelResponse } from '@/types/api/bookingManagementTypes';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

export default function useGathrenPMSIdContainer() {
  const { user } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      pms_id: '',
    }
  });

  const { mutate: creatGathernChannelPayload, isPending, isIdle } =
    useMutation<creatGathernChannelResponse, Error, { platform_user_id: string }>({
      mutationFn: (payload) =>
        creatGathernChannelApi({
          user_id: user!.id,
          platform_user_id: payload?.platform_user_id
        }),
      onSuccess: ({ data, message }) => {
        navigate(NavigationRoutes.APP_STACK.GATHERN_IMPORT, { ch_channel_id: data?.channel?.ch_channel_id });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
        });
        Toast.show({ type: 'success', text1: message });
      },

      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message });
      },
    });

  const onNext = (data: { pms_id: string }) => {
    // Remove the return false — it prevents the mutation
    const payload = {
      platform_user_id: data.pms_id
    };
    creatGathernChannelPayload(payload);
  };



  const onCreateAccount = () => {
    console.log('Navigate to Create Account');
  };

  return {
    isLoading: isPending && !isIdle,
    control,
    errors,
    handleSubmit,
    onNext,
    onCreateAccount
  };
}