import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useManageListingContainer() {

  const [listings] = useState([
    {
      id: '71229342',
      name: 'Alpha House',
      address: 'Street XYZ, Al Madinah, Madina Saudi Arabia',
      image: require('@/assets/img/property_placeholder.png'), // Replace with your actual image path
    },
    {
      id: '71229343',
      name: 'Alpha House',
      address: 'Street XYZ, Al Madinah, Madina Saudi Arabia',
      image: require('@/assets/img/property_placeholder.png'),
    },
    {
      id: '71229344',
      name: 'Alpha House',
      address: 'Street XYZ, Al Madinah, Madina Saudi Arabia',
      image: require('@/assets/img/property_placeholder.png'),
    },
  ]);
  const goToCreateListingStepOne = useCallback(() =>{
    navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE)
  },[])

  const onAddExisting = () => console.log('Add New Listing');

  return { listings, onCreateNew:goToCreateListingStepOne, onAddExisting };
}