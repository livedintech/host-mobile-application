import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import Toast from 'react-native-toast-message';

export default function useAccountContainer() {
  const accountOptions = [
    { id: '1', title: 'Profile Settings', route: 'PROFILE_SETTINGS' },
    { id: '2', title: 'Manage Booking Platform', route: 'MANAGE_BOOKING' },
    { id: '3', title: 'Manage Listing', route: 'MANAGE_LISTING' },
    { id: '4', title: 'User Management', route: 'USER_MANAGEMENT' },
    { id: '5', title: 'Smart Lock Managment', route: 'SMART_LOCK_MANAGMENT' },
    { id: '6', title: 'Reviews Management', route: 'REVIEW_MANAGEMENT' },
  ];

  const handlePress = (route: string) => {
    if (route === 'MANAGE_BOOKING') {
      navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
    }
    if (route === 'PROFILE_SETTINGS') {
       Toast.show({
            type: 'success',
            text1: 'Coming soon',
          });
      // navigate(NavigationRoutes.APP_STACK.PROFILE_SETTING);
    }
    if (route === 'MANAGE_LISTING') {
      navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
    }
    if (route === 'USER_MANAGEMENT') {
      navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT);
    }
    if (route === 'SMART_LOCK_MANAGMENT') {
      navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS);
    }
    if (route === 'REVIEW_MANAGEMENT') {
      navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT);
    }
  
  };
  return { accountOptions, handlePress };
}
