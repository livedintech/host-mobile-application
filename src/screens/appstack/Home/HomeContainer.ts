import { useCallback, useEffect } from 'react';
import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { getUser } from '@/services/UserPermission';
import { User } from '@/types/api/authTypes';
import { useQuery } from '@tanstack/react-query';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function useHomeContainer() {
  const {setUser} = useAuthStore()
  const { updateListing, setListingId } = useCreateListingStore();

  const { data: UserPermission, isLoading, refetch } = useQuery<User>({
    queryKey: [STORAGE_CONST.GET_USER],
    queryFn: getUser,
    enabled:true
  });

 useEffect(() => {
  if (UserPermission) {
    setUser(UserPermission);
  }
}, [UserPermission]);

  const channels = UserPermission?.channels || {};
  const unexported_listings = UserPermission?.unexported_listings || [];
  const incomplete_listings = UserPermission?.incomplete_listings || [];

  // const isNewLayout = UserPermission?.unexported_listings.length === 0;
  const isNewLayout = UserPermission?.has_import_listing;

  // ✅ Navigation Fix (bug resolved)
  const onConnect = useCallback((platform: string) => {
    console.log(`Connecting to ${platform}`);

    if (['Airbnb', 'Gathern', 'Booking'].includes(platform)) {
      navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
    }

    if (platform === 'Manual') {
      navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE);
    }
  }, []);

  const iconMap = {
    Airbnb: 'airbnb',
    Gathern: 'gathern',
    Booking: 'bookingCom',
    Manual: 'direct',
  };

  const cardsData = [
    { key: 'Airbnb' },
    { key: 'Gathern' },
    { key: 'Booking' },
    { key: 'Manual' },
  ];

  const getCardContent = useCallback(
    (platform: string) => {
      const countMap = {
        Airbnb: channels?.airbnb ?? 0,
        Gathern: channels?.gathern ?? 0,
        Booking: channels?.bcom ?? 0,
      };

      if (platform === 'Manual') {
        return {
          title: 'Create Listing',
          desc: 'Add a new listing manually',
        };
      }

      const count = countMap[platform] ?? 0;

      if (count > 0) {
        return {
          title: `Connect ${platform} `,
          desc: `Import listings from ${platform}`,
        };
      }

      return {
        title: `Connect ${platform}`,
        desc: `Import listings from ${platform}`,
      };
    },
    [channels]
  );

  const goToPropertyDetail = ({ id, name }: { name: string; id: string | number; }) => {
    updateListing({
      name,
    })
    setListingId(id.toString())
    navigate(NavigationRoutes.APP_STACK.PROPERTY_DETAIL);
  };

  const handleListingNavigation = (listings: any[], type: 'incomplete' | 'unexported') => {
    if (!listings || listings.length === 0) return;

    if (listings.length > 1) {
      navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
    } else {
      const item = listings[0];

      updateListing({
        name: item?.title,
      });

      setListingId(item?.listing_id?.toString());

      navigate(NavigationRoutes.APP_STACK.PROPERTY_DETAIL);
    }
  };


  return {
    onConnect,
    UserPermission,
    cardsData,
    getCardContent,
    iconMap,
    isLoading,
    refetch,
    goToPropertyDetail,
    incomplete_listings,
    unexported_listings,
    isNewLayout,
    handleListingNavigation
  };
}