import { useCallback } from 'react';
import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { getUser } from '@/services/UserPermission';
import { User } from '@/types/api/authTypes';
import { useQuery } from '@tanstack/react-query';
import { useCreateListingStore } from '@/store/useCreateListingStore';

export default function useHomeContainer() {
  const { updateListing, setListingId } = useCreateListingStore();

  const { data: UserPermission, isLoading, refetch } = useQuery<User>({
    queryKey: [STORAGE_CONST.GET_USER],
    queryFn: getUser,
  });

  const channels = UserPermission?.channels || {};
  const unexported_listings = UserPermission?.unexported_listings?.[0];
  const in_completed_listings = UserPermission?.in_completed_listings?.[0];

  console.log('unexported_listings:', unexported_listings);
  console.log('in_completed_listings:', in_completed_listings);

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
          title: `${platform} Connected`,
          desc: 'Import listings from Airbnb',
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

  return {
    onConnect,
    UserPermission,
    cardsData,
    getCardContent,
    iconMap,
    isLoading,
    refetch,
    goToPropertyDetail,
    in_completed_listings,
    unexported_listings
  };
}