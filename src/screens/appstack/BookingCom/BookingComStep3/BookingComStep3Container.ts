import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import { bookingcomConnectionApi } from '@/services/bookingManagementApi';
import Toast from 'react-native-toast-message';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { useAuthStore } from '@/store/useAuthStore';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useBookingComStep3Container() {
    const route = useRoute<any>();
    const { user } = useAuthStore();
    const { hotelId, listingId, selectedTitle } = route.params || {};
    console.log('hotelId', hotelId);


    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: selectedTitle || '',
            rate: '',
        }
    });

    const { mutate: submitPMS, isPending: isSubmitting } = useMutation({
        mutationFn: bookingcomConnectionApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id] });
            Toast.show({ type: 'success', text1: 'Successfully Connected!' });
            navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
        },
        onError: (error: any) => {
            Toast.show({ type: 'error', text1: 'Submit Failed', text2: error?.message });
        }
    });

    const onContinue = (data: any) => {
        const payload = listingId
            ? { title: data.title, listing_id: String(listingId), hotel_id: hotelId }
            : { title: data.title, hotel_id: hotelId, rate: Number(data.rate), availability: 1 };
        submitPMS(payload as any);
    };

    return {
        control,
        errors,
        handleContinue: handleSubmit(onContinue),
        isSubmitting,
        hasListing: !!listingId
    };
}