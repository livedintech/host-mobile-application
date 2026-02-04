import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PricingFormValues, pricingSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { createListingPricingPayload, createListingPricingResponse } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';
import { createListingPricingApi, editListingPriceApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useRoute } from '@react-navigation/native';

export default function useSetPricingContainer() {
    const { user } = useAuthStore();
    const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
    const { params } = useRoute<any>();
    const listing = params?.paramData?.listing;
    const isEdit = Boolean(listing?.id);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PricingFormValues>({
        resolver: yupResolver(pricingSchema),
        defaultValues: {
            weekdayPrice: listing?.prices?.weekday?.toString() || '',
            weekendPrice: listing?.prices?.weekend?.toString() || '',
            discount: listing?.prices?.discount?.toString() || '',
            taxVat: listing?.prices?.tax?.toString() || '',
            markup: listing?.prices?.markup?.toString() || '',
            security_deposit: listing?.prices?.security_deposit?.toString() || '',
            cleaningFee: listing?.prices?.cleaning_fee?.toString() || '',
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

    const {
        mutate: updateListingDetails,
        isPending: isUpdating,
    } = useMutation({
        mutationFn: editListingPriceApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message || 'Updated successfully',
            });
            goBack();
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });

    const onNext = (data: PricingFormValues) => {
        if (!listing_id) {
            Toast.show({
                type: 'error',
                text1: 'Listing ID is missing',
            });
            return;
        }

        const payload: createListingPricingPayload = {
            channel_id: channel_id ?? '',
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

    const onSaveExit = (data: PricingFormValues) => {
       

        const payload: createListingPricingPayload = {
            channel_id: channel_id,
            listing_id: listing_id,
            user_id: Number(user?.id),
            listing_currency: 'SAR',
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


        updateListingDetails(payload);
    };

    return {
        isEdit,
        isLoading: isPending || isUpdating,
        control,
        errors,
        handleSubmit,
        onNext,
        onSaveExit,
    };

}
