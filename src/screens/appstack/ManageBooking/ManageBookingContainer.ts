import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  getChannelsUserbyId,
  getUserListingsByUserIDApi,
  updateChannelStatusApi,
} from '@/services/bookingManagementApi';
import { navigate } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import i18n from '@/locales/i18n/i18n';

export default function useManageBookingContainer() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: response, isLoading, refetch: refetchChannels } = useQuery({
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
      alreadyMsg: i18n.t('app.manage_booking.airbnb_connected'),
      alreadyDesc: i18n.t('app.manage_booking.airbnb_connected_desc'),
      action: () => navigate(NavigationRoutes.APP_STACK.AIRBNB_ACCOUNT_NAME),
    },
    Gathern: {
      key: 'Gathern',
      alreadyMsg: i18n.t('app.manage_booking.gathern_connected'),
      alreadyDesc: i18n.t('app.manage_booking.gathern_connected_desc'),
      action: () => navigate(NavigationRoutes.APP_STACK.GATHREN_PMSID),
    },
    'Booking.com': {
      key: 'Bookings.com',
      alreadyMsg: i18n.t('app.manage_booking.bookingcom_connected'),
      alreadyDesc: i18n.t('app.manage_booking.bookingcom_connected_desc'),
      action: () => navigate(NavigationRoutes.APP_STACK.BOOKING_COM_STEP_1),
    },
  };

  // ✅ CLEAN handler
  const handleConnect = (platform: keyof typeof PLATFORM_CONFIG) => {
    const config = PLATFORM_CONFIG[platform];

    config.action();
  };

  const goToListing = (item: {
    connection_type: string;
    ch_channel_id: string;
  }) => {
    if (item?.connection_type === 'Gathern') {
      navigate(NavigationRoutes.APP_STACK.GATHERN_IMPORT, { ch_channel_id: item?.ch_channel_id });
    }
    else if (item?.connection_type === 'Airbnb') {
      navigate(NavigationRoutes.APP_STACK.AIRBNB_IMPORT, { ch_channel_id: item?.ch_channel_id });
    }
  };

  // Fetch user listings (for dropdown options)
  const { data: apiResponse, isLoading: isLoadingDropdown, refetch: refetchListings } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id],
    queryFn: () =>
      getUserListingsByUserIDApi({
        user: user?.id!,
      }),
    enabled: Boolean(user?.id),
  });

  // Combined refetch — dono queries ek saath refresh hongi
  const refetch = async () => {
    await Promise.all([refetchChannels(), refetchListings()]);
  };

  const { mutate: deactivateChannel, isPending: isDeactivating } = useMutation({
    mutationFn: (channel_id: number) =>
      updateChannelStatusApi({ channel_id, status: 'inactive' }),
    onSuccess: () => {
      // Channels invalidate karo (account delete ke baad list update ho)
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id] });
      // Listings bhi invalidate karo (listing options fresh rahen)
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id] });
    },
  });

  // Prepare dropdown options (values must be strings)
  const listingOptions = apiResponse?.data?.map((item: any) => ({
    label: item.name,
    value: String(item.listing_id),
  })) ?? [];

  return {
    handleConnect,
    isLoading: isLoading || isLoadingDropdown,
    refetch,
    connectedAccounts,
    goToListing,
    user,
    listingOptions,
    deactivateChannel,
    isDeactivating,
  };
}