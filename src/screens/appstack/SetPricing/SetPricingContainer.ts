import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PricingFormValues, pricingSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useSetPricingContainer() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PricingFormValues>({
        resolver: yupResolver(pricingSchema),
        defaultValues: {
           weekdayPrice: undefined,
            weekendPrice: undefined,
            discount: undefined,
            taxVat: undefined,
            markupPrice: undefined,
            cleaningFee: undefined,
        },
    });

    const onSubmit = (data: PricingFormValues) => {
        console.log('data', data);
        navigate(NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE)
    };

    return {
        isLoading: false,
        control,
        errors,
        handleSubmit,
        onSubmit,
    };
}
