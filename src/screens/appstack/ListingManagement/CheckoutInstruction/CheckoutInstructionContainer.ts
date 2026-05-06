import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { useRoute } from '@react-navigation/native';

const CheckoutInstructionContainer = () => {
  const { params } = useRoute<any>();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id);

  const onNext = (data: any) => {
    navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES);
  };

  const onSaveExit = (data: any) => {
 
  };

  return {
    onNext,
    onSaveExit,
  };
};

export default CheckoutInstructionContainer;
