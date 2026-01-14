import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PricingFormValues, pricingSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { createListingPricingApi } from '@/services/ createListingService';
import { createListingPricingPayload, createListingPricingResponse } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';

export default function useSetPricingContainer() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PricingFormValues>({
        resolver: yupResolver(pricingSchema),
        defaultValues: {
            weekdayPrice: '',
            weekendPrice: '',
            discount: '',
            taxVat: '',
            security_deposit: '',
            cleaningFee: '',
        },
    });
    const {
        mutate: createListingPricingPayload,
        isPending,
        isIdle,
    } = useMutation<createListingPricingResponse, Error, createListingPricingPayload>({
        mutationFn: createListingPricingApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'error',
                text1: message || 'Something went wrong',
            });
            navigate(NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE)
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });

    const onSubmit = (data: PricingFormValues) => {
        const payload = {
            listing_id: 123,
            prices: {
                weekday: Number(data.weekdayPrice),
                weekend: Number(data.weekendPrice),
                cleaning_fee: Number(data.cleaningFee),
                security_deposit: Number(data.weekdayPrice),
            }
        }
        navigate(NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE)
        // createListingPricingPayload(payload)
    };


    return {
        isLoading: isPending && !isIdle,
        control,
        errors,
        handleSubmit,
        onSubmit,
    };
}
