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

export default function useManageBookingContainer() {
  const { user } = useAuthStore();

  // ✅ GET channel response handling
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn: () =>
      getChannelsUserbyId({
        user_id: Number(user?.id)
      }),
    enabled: !!user?.id,
  });

  // API response structure ke mutabiq data extract karein
  const connectedAccounts = response?.data || [];
  const isOtaConnected = connectedAccounts.length > 0;

  // ✅ CREATE channex account
  const { mutate: createChannexAccount, isPending } = useMutation({
    mutationFn: () => createChannelsUserbyId({ user_id: user!.id }),
    onSuccess: (res) => {
      const airbnbUrl = res?.data?.connection_link_url;
      if (airbnbUrl) {
        Linking.openURL(airbnbUrl);
      }
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHANNELS_USER] });
    },
    onError: (error: any) => {
      console.log('Create Error:', error?.message);
    },
  });

  const handleConnect = (platform: string) => {
    if (platform === 'Airbnb') {
      createChannexAccount();
    }
    if (platform === 'Gathern') {
      navigate(NavigationRoutes.APP_STACK.GATHREN_PMSID);
    }
  };

  const goToListing = (ch_channel_id: number) => {
    navigate(NavigationRoutes.APP_STACK.AIRBNB_IMPORT, { ch_channel_id })
  }

  return {
    handleConnect,
    isOtaConnected,
    isLoading,
    isPending,
    refetch,
    response,
    goToListing
  };
}