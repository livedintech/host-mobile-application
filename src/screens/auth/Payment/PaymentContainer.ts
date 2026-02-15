import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate, reset } from '@/services/navigationService';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export default function usePaymentContainer() {
  const { params } = useRoute();
  const phone = params?.phone;

  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  const onPlanSelect = (plan: 'annual' | 'monthly') => {
    setSelectedPlan(plan);
  };

  const handleStartTrial = () => {
    const days = selectedPlan === 'annual' ? 14 : 7;
    console.log(`Starting ${days}-day free trial`);
    navigate(NavigationRoutes.AUTH_STACK.ADD_CARD_DETAIL, { plan: selectedPlan, phone: phone })
  };

  const handleSkipThis = () => {
    reset(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    Toast.show({
      type: 'success',
      text1: 'Your Account Create Successfully',
    });
  }

  return {
    selectedPlan,
    onPlanSelect,
    handleStartTrial,
    handleSkipThis
  };
}