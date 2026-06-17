import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { resetPasswordApi } from '@/services/authApi';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from '@/types/api/authTypes';

// Validation Schema
const addNewPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required(i18n.t('auth.add_new_password.validation_password_required'))
    .min(8, i18n.t('auth.add_new_password.validation_password_min'))
    .matches(/[a-z]/, i18n.t('auth.add_new_password.validation_password_lowercase'))
    .matches(/[A-Z]/, i18n.t('auth.add_new_password.validation_password_uppercase'))
    .matches(/[0-9]/, i18n.t('auth.add_new_password.validation_password_number'))
    .matches(/[@$!%*?&#]/, i18n.t('auth.add_new_password.validation_password_symbol')),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], i18n.t('auth.add_new_password.validation_passwords_match'))
    .required(i18n.t('auth.add_new_password.validation_confirm_required')),
});

export default function useAddNewPasswordContainer() {
  const { params } = useRoute();
  const phone = params?.phone_number;
  const phoneWithCode = params?.phone_with_code;
  const countryCode = params?.country_code
  const otp = params?.otp;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    mutate: resetPasswordPayload,
    isPending,
    isIdle,
  } = useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: resetPasswordApi,
    onSuccess: ({}) => {
      Toast.show({ type: 'success', text1: i18n.t('common.toast.password_updated') });
      navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error.message || i18n.t('auth.add_new_password.update_failed') });
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      phone_number: phone,
      phone_with_code : phoneWithCode ,
      country_code :countryCode ,
      otp: otp,
      password: data?.password,
      password_confirmation: data?.confirmPassword,
    };
    resetPasswordPayload(payload);
  };

  return {
    isLoading: isPending && !isIdle,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
  };
}
