import { queryClient } from '@/services/api';
import { createChannelsUserbyId } from '@/services/bookingManagementApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import STORAGE_CONST from '@/constants/storage';
import { pop } from '@/services/navigationService';
import { useForm } from 'react-hook-form';

const AIRBNB_REDIRECT_SCHEME = 'livedinapp://airbnb-callback';

type FormValues = {
  channelName: string;
};

export default function useAirbnbAccountNameContainer() {
  const { user } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: { channelName: '' },
  });

  const openAirbnbOAuth = async (url: string) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(url, AIRBNB_REDIRECT_SCHEME, {
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#FFFFFF',
          preferredControlTintColor: '#000000',
          readerMode: false,
          animated: true,
          modalEnabled: true,
          enableBarCollapsing: false,
          showTitle: true,
        });
        if (result.type === 'success') {
          await queryClient.refetchQueries({ queryKey: [STORAGE_CONST.GET_CHANNELS_USER] });
          pop(2);
        }
      } else {
        const { Linking } = require('react-native');
        Linking.openURL(url);
      }
    } catch {
      const { Linking } = require('react-native');
      Linking.openURL(url);
    }
  };

  const { mutate: createAccount, isPending } = useMutation({
    mutationFn: (data: FormValues) =>
      createChannelsUserbyId({
        user_id: user!.id,
        channel_name: data.channelName,
        redirect_url: AIRBNB_REDIRECT_SCHEME,
      }),
    onSuccess: (res) => {
      const url = res?.data?.connection_link_url;
      if (url) openAirbnbOAuth(url);
    },
    onError: (error: any) => {
      console.log('Airbnb account error:', error?.message);
    },
  });

  const onNext = handleSubmit((data) => {
    createAccount(data);
  });

  return {
    control,
    errors,
    onNext,
    isPending,
  };
}
