import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { AddressFormValues, addressSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useConfirmAddressContainer() {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      country: 'Saudi Arabia',
      state: 'Al Madinah',
      city: 'Medina',
      district: 'Al riyaad',
      address: '',
      postalAddress: '',
    },
  });

  const onNext = (data: AddressFormValues) => {
    console.log('Address Confirmed:', data);
    navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE)
    // navigation.navigate('NextStep');
  };

  const onSaveExit = () => {
    console.log('Progress Saved. Exiting...');
  };

  return { control, errors, handleSubmit, onNext, onSaveExit, navigation };
}