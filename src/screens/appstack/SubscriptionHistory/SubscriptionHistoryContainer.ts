import { ConfirmActionRef } from '@/components/molecules/ConfirmAction/ConfirmAction';
import STORAGE_CONST from '@/constants/storage';
import { getManageYourListings } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import { ManageListingsResponse } from '@/types/api/createListingTypes';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';

export default function useSubscriptionHistoryContainer() {
    const { user } = useAuthStore();
  
  const navigation = useNavigation();
  const removeSheetRef = useRef<ConfirmActionRef>(null);

  const { data,refetch,isLoading } = useQuery<ManageListingsResponse>({
    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS, user?.id],
    queryFn: () =>
      getManageYourListings({
        user: user?.id!,
      }),
    enabled: Boolean(user?.id),
  });

  const features = [
    { id: 1, label: '24/7 Guest\nCommunication', icon: 'phoneIcon' },
    { id: 2, label: '10 Revenue\nManagement', icon: 'percentIcon' },
    { id: 3, label: 'Task\nManagement', icon: 'briefcaseIcon' },
    { id: 4, label: 'Multi-\ncalendar', icon: 'calendarGridIcon' },
  ];
  const openSheet = () => {
    removeSheetRef.current?.open();
  }
  const closeSheet = () =>{
    removeSheetRef.current?.close();

  }
  return { listings:data?.data, features, navigation, removeSheetRef, openSheet,closeSheet ,refetch, isLoading};
}