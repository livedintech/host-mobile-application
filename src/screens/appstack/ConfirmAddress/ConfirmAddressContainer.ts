import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { addressSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useCreateListingStore } from '@/store/useCreateListingStore';

export type AddressFormValues = {
  name: string;
  country_code: string;
  state: string;
  city: string;
  street: string;
  apt?: string;
};

export default function useConfirmAddressContainer() {
  const { updateListing } = useCreateListingStore();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema) as any,
    defaultValues: {
      name: '',
      country_code: null,
      state: '',
      city: '',
      street: '',
      apt: '',
    },
  });

  const onNext = (data: AddressFormValues) => {
    updateListing({
      name: data.name,
      country_code: data.country_code?.cca2 || '',
      state: data.state,
      city: data.city,
      street: data.street,
      apt: data.apt,
    });
    navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE);
  };

  const onSaveExit = () => {
    console.log('Progress Saved. Exiting...');
  };

  return {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    navigation,
  };
}
