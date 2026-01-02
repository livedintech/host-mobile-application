import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

export default function useGathrenPMSIdContainer() {

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      pms_id: '',
    }
  });

  const onNext = (data: any) => {
    navigate(NavigationRoutes.APP_STACK.GATHERN_IMPORT)
  };

  const onCreateAccount = () => {
    console.log('Navigate to Create Account');
  };

  return { control, errors, handleSubmit, onNext, onCreateAccount };
}