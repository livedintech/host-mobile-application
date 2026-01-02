import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

type FormValues = {
  property_1: string;
  property_2: string;
  property_3: string;
};


export default function useAirbnbImportContainer() {
  const navigation = useNavigation();

  // Dropdown sirf livedin mapping ke liye
  const listingOptions = [
    {
      label: 'Livedin Alpha',
      value: 'alpha_house',
      livedinId: '45084593',
    },
    {
      label: 'Livedin Omega',
      value: 'omega_house',
      livedinId: '45084594',
    },
    {
      label: 'Livedin Beta',
      value: 'beta_villa',
      livedinId: '45084595',
    },
  ];

  // Airbnb properties (fixed data)
  const [properties] = useState([
    {
      id: '7084593',
      title: 'Alpha House',
      fieldName: 'property_1',
    },
    {
      id: '7084594',
      title: 'Omega House',
      fieldName: 'property_2',
    },
    {
      id: '7084595',
      title: 'Beta Villa',
      fieldName: 'property_3',
    },
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      property_1: '',
      property_2: '',
      property_3: 'omega_house',
    }
  });

const handleIndividualImport = (fieldName: keyof FormValues) => {
    const selectedValue = watch(fieldName);
    console.log('Importing:', {
      fieldName,
      livedinMapping: selectedValue,
    });
  };


  const onNext = (data: any) => {
    console.log('Final form submit:', data);
    navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING)
  };

  return {
    control,
    errors,
    properties,
    listingOptions,
    handleSubmit,
    onNext,
    watch,
    handleIndividualImport,
    navigation
  };
}
