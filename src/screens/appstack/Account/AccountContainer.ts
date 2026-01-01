import { useNavigation } from '@react-navigation/native';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useAccountContainer() {
  const navigation = useNavigation();

  const accountOptions = [
    { id: '1', title: 'Profile Setting', route: 'PROFILE_SETTINGS' },
    { id: '2', title: 'Manage Booking Platform', route: 'MANAGE_BOOKING' },
    { id: '3', title: 'Manage Listing', route: 'MANAGE_LISTING' },
    { id: '4', title: 'User Management', route: 'USER_MANAGEMENT' },
  ];

  const handlePress = (route: string) => {
    // Navigation logic yahan aayegi
    console.log('Navigating to:', route);
  };

  return { accountOptions, handlePress, navigation };
}