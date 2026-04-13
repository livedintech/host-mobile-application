import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { queryClient } from '@/services/api';
import { createGathernCreateChannelApi } from '@/services/bookingManagementApi';
import { navigate } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import { CreateGathernUserPayloadType, creatGathernChannelResponse } from '@/types/api/bookingManagementTypes';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

type FormValues = {
    gender: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    country: {
        cca2: string;
        callingCode: string;
    };
    mobile: string;
    platform_user_id: string;
    check_in_hour: string;
    check_out_hour: string;
};

export default function useGathrenCreateAccountContainer() {
    const { user } = useAuthStore();

    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            gender: '',
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            platform_user_id: '',
            country: {
                cca2: 'SA',
                callingCode: '966',
            },
            mobile: '',
        }
    });

    const { mutate: createGathernCreateChannelPayload, isPending, isIdle } = useMutation<
        creatGathernChannelResponse,
        Error,
        CreateGathernUserPayloadType
    >({
        mutationFn: createGathernCreateChannelApi,
        onSuccess: ({ message }) => {
            navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);

            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
            });
            queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHANNELS_USER] });

            Toast.show({ type: 'success', text1: message });
        },
        onError: (error) => {
            Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
        },
    });

    const onNext = (data: FormValues) => {
        const payload: CreateGathernUserPayloadType = {
            gender: data.gender,
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            email: data.email,
            country_code: `+${data.country.callingCode}`,
            mobile: data.mobile,
           platform_user_id: data.platform_user_id,
        };

        createGathernCreateChannelPayload(payload);
    };

    const onCreateAccount = () => {
        console.log('Navigate to Create Account');
    };

    return {
        isLoading: isPending && !isIdle,
        control,
        errors,
        handleSubmit,
        onNext,
        onCreateAccount,
    };
}