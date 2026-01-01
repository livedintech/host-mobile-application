import { useNavigation } from '@react-navigation/native';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';

export default function useSelectPaymentContainer() {
  const navigation = useNavigation();

  const paymentMethods = [
    { id: '1', name: 'Mada', icon: require('@/assets/img/mada_logo.png') },
    { id: '2', name: 'STC Pay', icon: require('@/assets/img/stc_pay_logo.png') },
    { id: '3', name: 'MasterCard/Visa', icon: require('@/assets/img/mastercard_visa.png') },
    { id: '4', name: 'Apple Pay', icon: require('@/assets/img/apple_pay.png') },
    { id: '5', name: 'Google Pay', icon: require('@/assets/img/google_pay.png') },
  ];

  const onSelect = (method: string) => {
    console.log('Selected:', method);
    navigate(NavigationRoutes.APP_STACK.ADD_NEW_PAYMENT_METHOD)
  };

  return { paymentMethods, onSelect, navigation };
}