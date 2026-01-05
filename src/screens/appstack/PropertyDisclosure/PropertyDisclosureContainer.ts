import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DisclosureFormValues, disclosureSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function usePropertyDisclosureContainer() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<DisclosureFormValues>({
        resolver: yupResolver(disclosureSchema),
        defaultValues: {
            securityCameras: '',
            noiseMonitor: '',
            weaponsOnProperty: '',
        },
    });

    const onSubmit = (data: DisclosureFormValues) => {
        console.log('onSubmit', data);
        navigate(NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD)
    };

    return {
        isLoading: false,
        control,
        errors,
        handleSubmit,
        onSubmit,
    };
}