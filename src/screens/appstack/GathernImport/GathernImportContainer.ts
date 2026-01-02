import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export type GathernFormValues = {
  [key: string]: {
    listing: string;
    ical: string;
  };
};

export default function useGathernImportContainer() {
  const navigation = useNavigation();

  const listingOptions = [
    { label: 'Livedin Alpha', value: 'alpha_house', livedinId: '45084593' },
    { label: 'Livedin Omega', value: 'omega_house', livedinId: '45084594' },
    { label: 'Livedin Beta', value: 'beta_villa', livedinId: '45084595' },
  ];

  const [properties] = useState([
    { id: '7084593', title: 'Alpha House', fieldBase: 'prop_1' },
    { id: '5623043', title: 'Alpha House', fieldBase: 'prop_2' },
  ]);

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      prop_1_listing: '',
      prop_1_ical: '',
      prop_2_listing: 'omega_house',
      prop_2_ical: 'https://gathern.com/ical/property/12345/bookings.ics',
    }
  });

  const handleIndividualImport = (fieldBase: string) => {
    const listing = watch(`${fieldBase}_listing` as any);
    const ical = watch(`${fieldBase}_ical` as any);
    console.log('Importing Gathern Property:', { fieldBase, listing, ical });
  };

  const onNext = (data: any) => {
    console.log('Final Gathern Data:', data);
    navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
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