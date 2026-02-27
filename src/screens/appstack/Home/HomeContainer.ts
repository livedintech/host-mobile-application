import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { getUser } from '@/services/UserPermission';
import { useQuery } from '@tanstack/react-query';

export default function useHomeContainer() {
  const onConnect = (platform: string) => {
    console.log(`Connecting to ${platform}`);
    if (platform === 'Connect Airbnb' || 'Connect Gathern') {
      navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
    }
    if (platform === 'Connect New Listing') {
      navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE);
    }
  };

  const {
    data: UserPermission = [],
    isLoading: isUserLoading,
    refetch,
  } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER],
    queryFn: getUser,
  });

  console.log("UserPermission",UserPermission)
  return { onConnect , UserPermission};
}
