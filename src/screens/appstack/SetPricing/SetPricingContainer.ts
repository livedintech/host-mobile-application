import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PricingFormValues, pricingSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { createListingPricingPayload, createListingPricingResponse } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';
import { createListingPricingApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateListingStore } from '@/store/useCreateListingStore';

export default function useSetPricingContainer() {
    const { user } = useAuthStore();
    const { listing_id, channel_id } = useCreateListingStore();
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
            markup: '',
            security_deposit: '',
            cleaningFee: '',
        },
    });

    const {
        mutate: createListingPricing,
        isPending,
        isIdle,
    } = useMutation<createListingPricingResponse, Error, createListingPricingPayload>({
        mutationFn: createListingPricingApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message || 'Pricing saved successfully',
            });
            navigate(NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE);
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });

  const onSubmit = (data: PricingFormValues) => {
    if (!listing_id) {
        Toast.show({
            type: 'error',
            text1: 'Listing ID is missing',
        });
        return;
    }

    const payload: createListingPricingPayload = {
        channel_id: channel_id || '',
        listing_id,
        user_id: Number(user?.id),
        listing_currency: "SAR",
        prices: {
            weekday: Number(data.weekdayPrice),
            weekend: Number(data.weekendPrice),
            discount: Number(data.discount),
            tax: Number(data.taxVat),
            markup: Number(data.markup),
            cleaning_fee: Number(data.cleaningFee),
            security_deposit: Number(data.security_deposit),
        },
    };
    createListingPricing(payload);
};


    return {
        isLoading: isPending && !isIdle,
        control,
        errors,
        handleSubmit,
        onSubmit,
    };
}
