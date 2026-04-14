import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import { bookingcomTestConnectionApi } from '@/services/bookingManagementApi';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const step1Schema = yup.object().shape({
    hotelId: yup.string().required('Property ID is required'),
});

export default function useBookingComStep1Container() {
    const { control, handleSubmit, formState: { errors },watch } = useForm({
        resolver: yupResolver(step1Schema),
        defaultValues: { hotelId: '' }
    });
    const hotelId = watch('hotelId')

    const { mutate: testConnection, isPending: isTesting } = useMutation({
        mutationFn: bookingcomTestConnectionApi,
        onSuccess: (variables) => {
            Toast.show({ type: 'success', text1: 'Connection Successful' });
            navigate(NavigationRoutes.APP_STACK.BOOKING_COM_STEP_2, { hotelId: hotelId });
        },
        onError: (error: any) => {
            console.log('error',error?.message);
            
            Toast.show({ type: 'error', text1: error?.message|| 'Invalid Property ID' });
        },
    });

    const onNext = (data: { hotelId: string }) => {
        testConnection({ hotel_id: data.hotelId });
    };

    return { control, errors, handleNext: handleSubmit(onNext), isTesting };
}