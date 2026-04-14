import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { queryClient } from '@/services/api';
import {
  createChannelsUserbyId,
  getChannelsUserbyId,
} from '@/services/bookingManagementApi';
import { navigate } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import { Linking, Alert } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export default function useManageBookingContainer() {
  const { user } = useAuthStore();

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn: () =>
      getChannelsUserbyId({
        user_id: Number(user?.id),
      }),
    enabled: !!user?.id,
  });

  const connectedAccounts = response?.data || [];

  // 🔥 Platform Config (single source of truth)
  const PLATFORM_CONFIG = {
    Airbnb: {
      key: 'Airbnb',
      alreadyMsg: 'Airbnb Already Connected',
      alreadyDesc: 'Your Airbnb account is already connected.',
      action: () => createChannexAccount(),
    },
    Gathern: {
      key: 'Gathern',
      alreadyMsg: 'Gathern Already Connected',
      alreadyDesc: 'Your Gathern account is already connected.',
      action: () => navigate(NavigationRoutes.APP_STACK.GATHREN_PMSID),
    },
    'Booking.com': {
      key: 'Bookings.com', // ⚠️ API key different
      alreadyMsg: 'Booking.com Already Connected',
      alreadyDesc: 'Your Booking.com account is already connected.',
      action: () => navigate(NavigationRoutes.APP_STACK.BOOKING_COM_PMSID),
    },
  };

  const { mutate: createChannexAccount, isPending } = useMutation({
    mutationFn: () => createChannelsUserbyId({ user_id: user!.id }),
    onSuccess: (res) => {
      const url = res?.data?.connection_link_url;
      if (url) Linking.openURL(url);

      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_CHANNELS_USER],
      });
    },
    onError: (error: any) => {
      console.log('Create Error:', error?.message);
    },
  });

  // ✅ CLEAN handler
  const handleConnect = (platform: keyof typeof PLATFORM_CONFIG) => {
    const config = PLATFORM_CONFIG[platform];

    const isConnected = connectedAccounts.some(
      (acc: any) => acc.connection_type === config.key
    );

    // if (isConnected) {
    //   Toast.show({
    //     type: 'info',
    //     text1: config.alreadyMsg,
    //     text2: config.alreadyDesc,
    //   });
    //   return;
    // }

    config.action();
  };

  const goToListing = (item: {
    connection_type: string;
    ch_channel_id: string;
  }) => {
    const route =
      item?.connection_type === 'Gathern'
        ? NavigationRoutes.APP_STACK.GATHERN_IMPORT
        : NavigationRoutes.APP_STACK.AIRBNB_IMPORT;

    navigate(route, { ch_channel_id: item?.ch_channel_id });
  };

  return {
    handleConnect,
    isLoading,
    isPending,
    refetch,
    connectedAccounts,
    goToListing,
    user,
  };
}