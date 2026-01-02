import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';

export default function useAccountContainer() {

  const accountOptions = [
    { id: '1', title: 'Profile Setting', route: 'PROFILE_SETTINGS' },
    { id: '2', title: 'Manage Booking Platform', route: 'MANAGE_BOOKING' },
    { id: '3', title: 'Manage Listing', route: 'MANAGE_LISTING' },
    { id: '4', title: 'User Management', route: 'USER_MANAGEMENT' },
  ];

  const handlePress = (route: string) => {
    if (route === 'MANAGE_BOOKING') {
      navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING)
    }
    console.log('Navigating to:', route);
  };
  return { accountOptions, handlePress };
}