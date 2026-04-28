import { ConfirmActionRef } from '@/components/molecules/ConfirmAction/ConfirmAction';
import STORAGE_CONST from '@/constants/storage';
import { getManageYourListings, getSubscrptionUserPlanApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import { GetSubscriptionUserPlanResponse, ManageListingsResponse } from '@/types/api/createListingTypes';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function useSubscriptionHistoryContainer() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const removeSheetRef = useRef<ConfirmActionRef>(null);

  const {
    data,
    refetch,
    isLoading,
  } = useQuery<ManageListingsResponse>({
    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS, user?.id],
    queryFn: () =>
      getManageYourListings({
        user: user?.id!,
      }),
    enabled: Boolean(user?.id),
  });

  const {
    data: getSubscrptionUserPlan,
    refetch: refetchGetSubscrptionUserPlan,
    isLoading: isLoadingGetSubscrptionUserPlan,
  } = useQuery<GetSubscriptionUserPlanResponse>({
    queryKey: [STORAGE_CONST.GET_SUBSCRPTION_USER_PLAN, user?.id],
    queryFn: async () => {
      const response = await getSubscrptionUserPlanApi({ user_id: user?.id! });
      // API returns { success: false, message: "..." } when no subscription found.
      // Return it as-is so the screen can check response.success gracefully
      // instead of letting useQuery treat it as an error.
      return response;
    },
    enabled: Boolean(user?.id),
  });

  const features = [
    { id: 1, label: t('app.subscription.feature_guest_communication'), icon: 'phoneIcon' },
    { id: 2, label: t('app.subscription.feature_revenue_management'), icon: 'percentIcon' },
    { id: 3, label: t('app.subscription.feature_task_management'), icon: 'briefcaseIcon' },
    { id: 4, label: t('app.subscription.feature_multi_calendar'), icon: 'calendarGridIcon' },
  ];

  const openSheet = () => {
    removeSheetRef.current?.open();
  };

  // FIX: closeSheet should close the bottom sheet after confirmation
  // TODO: Add actual cancel subscription API call here before closing
  const closeSheet = () => {
    removeSheetRef.current?.close();
  };

  return {
    listings: data?.data ?? [], // FIX: default to empty array instead of undefined
    features,
    navigation,
    removeSheetRef,
    openSheet,
    closeSheet,
    refetch,
    isLoading,
    // FIX: export this so the screen can show loader for subscription card
    isLoadingGetSubscrptionUserPlan,
    getSubscrptionUserPlan,
  };
}