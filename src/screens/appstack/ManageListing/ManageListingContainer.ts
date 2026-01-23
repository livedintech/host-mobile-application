import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { getManageYourListings } from '@/services/ createListingService';

export default function useManageListingContainer() {
    const { user } = useAuthStore();
  

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
   const { data } = useQuery({
    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS, user?.id],
    queryFn: () =>
      getManageYourListings({
        user: user?.id!,
      }),
    enabled: Boolean(user?.id),
  });
  const onCreateNew = useCallback(() =>{
    navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE)
  },[]);

   const goToPropertyDetail = useCallback(() =>{
    navigate(NavigationRoutes.APP_STACK.PROPERTY_DETAIL);
  },[]);


  // const onAddExisting = () => console.log('Add New Listing');
  const onCreateNewListing = useCallback(() =>{
    navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
  },[])

  return { listings, onCreateNew, onCreateNewListing,goToPropertyDetail };
}