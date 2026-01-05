import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { StepOneFormValues, stepOneSchema } from '@/validation/auth/createListingSchemas';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';

export default function useCreateListingStepOneContainer() {
  const navigation = useNavigation();

  const propertyOptions = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'Villa', value: 'villa' },
    { label: 'Studio', value: 'studio' },
    { label: 'Shared Room', value: 'shared_room' },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StepOneFormValues>({
    resolver: yupResolver(stepOneSchema),
    defaultValues: {
      propertyType: '',
    },
  });

  const onNext = (data: StepOneFormValues) => {
    navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE_SET_LOCATION)
  };

  const onSaveExit = () => {
    console.log('Saving and Exiting...');
    navigation.goBack();
  };

  return { control, errors, propertyOptions, handleSubmit, onNext, onSaveExit, navigation };
}