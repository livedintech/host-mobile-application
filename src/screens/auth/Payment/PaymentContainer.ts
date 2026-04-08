import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getSelectListingApi, getSubscriptionFeaturesApi } from '@/services/authApi';
import { navigate, reset } from '@/services/navigationService';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export default function usePaymentContainer() {
  const { params } = useRoute();
  const country_code = params?.country_code;
const phone_number = params?.phone_number;
const phone_with_code = params?.phone_with_code;
const pricing = params?.pricing;

  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('monthly');

  const onPlanSelect = (plan: 'annual' | 'monthly') => {
    setSelectedPlan(plan);
  };

  const handleStartTrial = () => {
    const days = selectedPlan === 'annual' ? 14 : 14;
    console.log(`Starting ${days}-day free trial`);
    navigate(NavigationRoutes.AUTH_STACK.SELECT_PAYMENT_METHOD, { 
  plan: selectedPlan, 
  country_code, 
  phone_number, 
  phone_with_code 
})
  };

  const handleSkipThis = () => {
    reset(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    Toast.show({
      type: 'success',
      text1: 'Your Account Create Successfully',
    });
  }

  //   const { data: data = [] } = useQuery({
  //   queryKey: [STORAGE_CONST.SUBSCRPTION_FEATURES],
  //   queryFn: getSubscriptionFeaturesApi({
  //     subscription_id: 1
  //   }),
  // });

  const { data, isLoading,refetch } = useQuery({
    queryKey: [STORAGE_CONST.SUBSCRPTION_FEATURES],
    queryFn: () =>
      getSubscriptionFeaturesApi({subscription_id:1 }),
    // enabled: !!subscription_id,
  });

  console.log('data::::',data?.addons);
  
  const addons = data?.addons || []
  const base = data?.base || []

  return {
    selectedPlan,
    onPlanSelect,
    handleStartTrial,
    handleSkipThis,
    addons,
    base,
    pricing,
    isLoading,
    refetch
  };
}