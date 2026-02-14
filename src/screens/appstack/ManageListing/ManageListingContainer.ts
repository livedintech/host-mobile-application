import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { getManageYourListings } from '@/services/ createListingService';
import { ManageListingItem, ManageListingsResponse } from '@/types/api/createListingTypes';
import { useCreateListingStore } from '@/store/useCreateListingStore';

export default function useManageListingContainer() {
  const { user } = useAuthStore();
  const { updateListing, setListingId, setChannelId } = useCreateListingStore();

  const { data,refetch,isLoading } = useQuery<ManageListingsResponse>({
    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS, user?.id],
    queryFn: () =>
      getManageYourListings({
        user: user?.id!,
      }),
    enabled: Boolean(user?.id),
  });
  const onCreateNew = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE)
  }, []);

  const goToPropertyDetail = ({ id, name }: ManageListingItem) => {
    updateListing({
      name,
    })
    setChannelId("8b7b2e2c-b7bc-4b3c-8a6a-d9a7a4833ccb")
    setListingId(id.toString())
    navigate(NavigationRoutes.APP_STACK.PROPERTY_DETAIL);
  };

  // const onAddExisting = () => console.log('Add New Listing');
  const onCreateNewListing = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
  }, [])

  return { listings: data, onCreateNew, onCreateNewListing, goToPropertyDetail,refetch,isLoading };
}