import { ConfirmActionRef } from '@/components/molecules/ConfirmAction/ConfirmAction';
import STORAGE_CONST from '@/constants/storage';
import { getManageYourListings, getSubscrptionUserPlanApi } from '@/services/ createListingService';
import { contactEligibilityApi } from '@/services/paymentService';
import { useAuthStore } from '@/store/useAuthStore';
import { GetSubscriptionUserPlanResponse, ManageListingsResponse } from '@/types/api/createListingTypes';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const ELIGIBLE_PLAN_ID = 'df0c79c6-e11e-4215-97b1-249011095c8f';

export default function useSubscriptionHistoryContainer() {
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const removeSheetRef = useRef<ConfirmActionRef>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);

  useEffect(() => {
    // Step 1: no plan assigned yet → send to Payment (signup) screen
    if (user?.sub_plan_id === null || user?.sub_plan_id === undefined) {
      navigate(NavigationRoutes.APP_STACK.SELECT_PLAN);
      return;
    }

    // Step 2: plan exists → check eligibility
    const email = user?.email ?? '';
    if (!email) {
      setIsCheckingEligibility(false);
      return;
    }
    contactEligibilityApi(email)
      .then((result) => {
        if (result?.data?.eligible) {
          navigate(NavigationRoutes.APP_STACK.SUBSCRIPTION_WEBVIEW, {
            planId: ELIGIBLE_PLAN_ID,
            qtyFrom: 1,
            full_name: user?.name ?? '',
            email: user?.email ?? '',
            country_code: user?.country_code ?? '',
            phone_number: user?.phone ?? '',
          });
        } else {
          setIsCheckingEligibility(false);
        }
      })
      .catch(() => {
        setIsCheckingEligibility(false);
      });
  }, []);

  const { data, refetch, isLoading } = useQuery<ManageListingsResponse>({
    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS, user?.id],
    queryFn: () => getManageYourListings({ user: user?.id! }),
    enabled: Boolean(user?.id),
  });

  const {
    data: getSubscrptionUserPlan,
    isLoading: isLoadingGetSubscrptionUserPlan,
  } = useQuery<GetSubscriptionUserPlanResponse>({
    queryKey: [STORAGE_CONST.GET_SUBSCRPTION_USER_PLAN, user?.id],
    queryFn: async () => {
      const response = await getSubscrptionUserPlanApi({ user_id: user?.id! });
      return response;
    },
    enabled: Boolean(user?.id),
  });

  const openSheet = () => removeSheetRef.current?.open();
  const closeSheet = () => removeSheetRef.current?.close();

  return {
    listings: data?.data ?? [],
    navigation,
    removeSheetRef,
    openSheet,
    closeSheet,
    refetch,
    isLoading,
    isLoadingGetSubscrptionUserPlan,
    getSubscrptionUserPlan,
    isCheckingEligibility,
  };
}
