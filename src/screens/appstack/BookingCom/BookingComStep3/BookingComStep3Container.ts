import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { navigate, resetToRoutes } from '@/services/navigationService';
import { connectBookingComWithChannexApi } from '@/services/bookingManagementApi';
import { bookingcomConnectWithChannexPayloadType } from '@/types/api/bookingManagementTypes';
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

    const step3Schema = yup.object().shape({
        title: yup.string().required(i18n.t('app.booking_com_step3.validation_name_required')),
        rate: listingId
            ? yup.string()
            : yup.string()
                .required(i18n.t('app.booking_com_step3.validation_rate_required'))
                .test('positive', i18n.t('app.booking_com_step3.validation_rate_positive'), val => Number(val) > 0),
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(step3Schema),
        defaultValues: {
            title: selectedTitle || '',
            rate: '',
        }
    });

    const { mutate: submitPMS, isPending: isSubmitting } = useMutation({
        mutationFn: connectBookingComWithChannexApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id] });
            Toast.show({ type: 'success', text1: i18n.t('app.booking_com_step3.success_connected') });
            resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_BOOKING }] as any);
        },
        onError: (error: any) => {
            Toast.show({ type: 'error', text1: i18n.t('common.toast.submit_failed'), text2: error?.message });
        }
    });

    const onContinue = (data: any) => {
        const connectionPayload = listingId
            ? { title: data.title, listing_id: String(listingId), hotel_id: hotelId }
            : { title: data.title, hotel_id: hotelId, rate: Number(data.rate), availability: 1 };

        const payload: bookingcomConnectWithChannexPayloadType = {
            user_id: Number(user!.id),
            channel_name: data.title,
            ...connectionPayload,
        };
        submitPMS(payload);
    };

    return {
        control,
        errors,
        handleContinue: handleSubmit(onContinue),
        isSubmitting,
        hasListing: !!listingId
    };
}