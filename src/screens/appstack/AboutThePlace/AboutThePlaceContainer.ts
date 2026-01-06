import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { StepTwoFormValues, stepTwoSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useAboutThePlaceContainer() {
  const navigation = useNavigation();

  const binaryOptions = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }];
  const numberOptions = Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
  const otherHouseFeatures = [
    { label: 'Air Conditioning', value: 'ac' },
    { label: 'Wi-Fi', value: 'wifi' },
    { label: 'Free Parking', value: 'parking' },
    { label: 'Garden / Backyard', value: 'garden' },
    { label: 'Security Cameras', value: 'cctv' },
    { label: 'First Aid Kit', value: 'first_aid' },
    { label: 'TV / Streaming Services', value: 'tv' },
    { label: 'Washing Machine', value: 'laundry' },
  ];

  const { control, handleSubmit, formState: { errors } } = useForm<StepTwoFormValues>({
    resolver: yupResolver(stepTwoSchema),
    defaultValues: {
      size: '',
      bedrooms: '4',
      beds: '5',
      minDayStay: '1',
      otherFeatures: []
    },
  });

  const onNext = (data: StepTwoFormValues) => {
    console.log('Step 2 Data:', data);
    navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS)
    // navigation.navigate('Step3');
  };

  return { control, errors, binaryOptions, numberOptions, handleSubmit, onNext, navigation, otherHouseFeatures };
}