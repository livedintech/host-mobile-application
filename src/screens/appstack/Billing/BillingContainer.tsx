import { useNavigation } from '@react-navigation/native';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useCallback } from 'react';
import { navigate } from '@/services/navigationService';

export default function useBillingContainer() {
  const navigation = useNavigation();

  const goToTransactionHistory = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.TRANSACTION_HISTORY)
  }, []);

  const goToSubscriptionHistory = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.SUBSCRIPTION_HISTORY)
  }, []);

  const goToPaymentMethod = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.PAYMENT_METHOD_LIST)
  }, []);

  return { goToTransactionHistory,goToSubscriptionHistory,goToPaymentMethod };
}