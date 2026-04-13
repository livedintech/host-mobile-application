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
    console.log('testinf');
    
    
    if (platform === 'Airbnb') {
      const isAirbnbConnected = connectedAccounts.some(
        (acc: any) => acc.connection_type === 'Airbnb'
      );

      if (isAirbnbConnected) {
        Toast.show({
          type: 'info',
          text1: 'Airbnb Already Connected',
          text2: 'Your Airbnb account is already connected.',
        });
        return;
      }

      createChannexAccount();
    }

    if (platform === 'Gathern') {
      const isGathernConnected = connectedAccounts.some(
        (acc: any) => acc.connection_type === 'Gathern'
      );

      if (isGathernConnected) {
        Toast.show({
          type: 'info',
          text1: 'Gathern Already Connected',
          text2: 'Your Gathern account is already connected.',
        });
        return;
      }

      navigate(NavigationRoutes.APP_STACK.GATHREN_PMSID);
    }

    if (platform === 'Booking.com') {
  const isBookingConnected = connectedAccounts.some(
    (acc: any) => acc.connection_type === 'Bookings.com'
  );

  if (isBookingConnected) {
    Toast.show({
      type: 'info',
      text1: 'Booking.com Already Connected',
      text2: 'Your Booking.com account is already connected.',
    });
    return;
  }

  navigate(NavigationRoutes.APP_STACK.BOOKING_COM_PMSID);
}
  };

  const goToListing = (item: { connection_type: string, ch_channel_id: string }) => {

    if (item?.connection_type === 'Gathern') {
      navigate(NavigationRoutes.APP_STACK.GATHERN_IMPORT, { ch_channel_id: item?.ch_channel_id });
    } else {
      navigate(NavigationRoutes.APP_STACK.AIRBNB_IMPORT, { ch_channel_id: item?.ch_channel_id });
    }
  }

  return {
    handleConnect,
    isOtaConnected,
    isLoading,
    isPending,
    refetch,
    response,
    goToListing,
    connectedAccounts
  };
}