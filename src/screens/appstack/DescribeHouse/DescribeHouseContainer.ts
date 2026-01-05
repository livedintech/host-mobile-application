import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DescribeHouseFormValues, describeHouseSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useDescribeHouseContainer() {
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DescribeHouseFormValues>({
    resolver: yupResolver(describeHouseSchema),
    defaultValues: {
      title: '',
      description: '',
      bookingType: 'Instant Booking',
      guestEligibility: 'Any Guest',
      checkInTime: '09:00',
      checkOutTime: '22:00',
    },
  });

  const descriptionValue = watch('description') || '';


  const onSubmit = (data: DescribeHouseFormValues) => {
    console.log('data',data);
    navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING)
    
    // saveDescription(data);
  };

  return {
    isLoading: false,
    control,
    errors,
    handleSubmit,
    onSubmit,
    descriptionLength: descriptionValue.length,
  };
}