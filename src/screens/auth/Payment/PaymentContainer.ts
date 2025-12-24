import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { useState } from 'react';

export default function usePaymentContainer() {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  const onPlanSelect = (plan: 'annual' | 'monthly') => {
    setSelectedPlan(plan);
  };

  const handleStartTrial = () => {
    const days = selectedPlan === 'annual' ? 14 : 7;
    console.log(`Starting ${days}-day free trial`);
    navigate(NavigationRoutes.AUTH_STACK.ADD_CARD_DETAIL)
  };

  return {
    selectedPlan,
    onPlanSelect,
    handleStartTrial,
  };
}