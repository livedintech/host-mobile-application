import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';

export default function usePaymentMethodListContainer() {
  const navigation = useNavigation();
  const [isSecure, setIsSecure] = useState(true);
  const [isDefault, setIsDefault] = useState(true);

  const onAddNew = () => {
    navigate(NavigationRoutes.APP_STACK.SELECT_PAYMENT_METHOD)
  };

  return { 
    isSecure, 
    setIsSecure, 
    isDefault, 
    setIsDefault, 
    onAddNew, 
    navigation 
  };
}