import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginPayload, LoginResponse } from '@/types/api/authTypes';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { LoginFormValues, loginSchema } from '@/validation/auth/authSchemas';
import { loginApi } from '@/services/authApi';

export default function useLoginContainer() {
    const { setToken, setUser } = useAuthStore();

    // ----------------- useForm Setup -----------------
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });
    // ----------------- Normal Login -----------------
    const { mutate: loginPayload, isPending, isIdle } = useMutation<
        LoginResponse,
        Error,
        LoginPayload
    >({
        mutationFn: loginApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message,
            });
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
            console.log('error',error);
            
        },
    });
    // ----------------- Form Submission -----------------
    const onSubmit = async (data: LoginFormValues) => {
        const payload = {
            email: data.email,
            password: data?.password
        }
        loginPayload(payload)
    };


    return {
        isLoading: isPending && !isIdle,
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
    };
}
