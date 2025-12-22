import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { loginWithPhoneFormValues, loginWithPhoneSchema } from '@/validation/auth/authSchemas';

export default function useLoginWithPhoneContainer() {
    const { control, handleSubmit, formState: { errors }, watch } = useForm<loginWithPhoneFormValues>({
        resolver: yupResolver(loginWithPhoneSchema),
        defaultValues: {
            country: { cca2: 'SA', callingCode: '966' },
            phoneNumber: '',
        },
    });


    const onSubmit = async (data: loginWithPhoneFormValues) => {
        const payload = {
            phone: data?.phoneNumber,
            country_code: data?.country?.cca2,
            phone_with_code: data?.country?.callingCode,
        }
    };

    return {
        isLoading: false,
        control,
        errors,
        watch,
        handleSubmit,
        onSubmit,
    };
}
