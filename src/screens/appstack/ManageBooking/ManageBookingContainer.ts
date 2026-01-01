import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { useNavigation } from '@react-navigation/native';

export default function useManageBookingContainer() {
  const navigation = useNavigation();

  const handleConnect = (platform: string) => {
    console.log(`Connecting to ${platform}`);
    if (platform === 'Airbnb') {
      navigate(NavigationRoutes.APP_STACK.AIRBNB_IMPORT)
    }
     if (platform === 'Gathern') {
      navigate(NavigationRoutes.APP_STACK.GATHREN_PMSID)
    }
  };

  return { navigation, handleConnect };
}