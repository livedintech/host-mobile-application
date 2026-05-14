import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import {
  CreateAccountPayload,
  CreateAccountResponse,
} from '@/types/api/authTypes';
import { createAccountApi } from '@/services/authApi';
import Toast from 'react-native-toast-message';
import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { navigate, reset } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useCreateAccountContainer() {
  const signUpSchema = useMemo(() => yup.object().shape({
    fullName: yup.string().required(i18n.t('auth.create_account.validation_name_required')),
    password: yup
      .string()
      .min(8, i18n.t('auth.create_account.validation_password_min'))
      .matches(/[a-zA-Z]/, i18n.t('auth.create_account.validation_password_letters'))
      .matches(/[0-9]/, i18n.t('auth.create_account.validation_password_numbers'))
      .matches(/[@$!%*?&#]/, i18n.t('auth.create_account.validation_password_symbols'))
      .required(i18n.t('auth.create_account.validation_password_required')),
  }), []);

  const route = useRoute<any>();
  const navigation = useNavigation();

  const { params } = useRoute();
  const country_code = params?.payload?.country_code;
  const phone_number = params?.payload?.phone_number;
  const phone_with_code = params?.payload?.phone_with_code;
  const listing_count = params?.payload?.listing_count;
  const pricing = params?.payload?.pricing;

  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const confirmedRef = useRef(false);

  const prefill      = (route.params as any) || {};
  const deepLinkName = prefill?.payload?.name || prefill?.name || '';

  const toggleTerms = useCallback(() => setIsTermsAccepted(prev => !prev), []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: deepLinkName,
      password: '',
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (confirmedRef.current) return;
      e.preventDefault();
      setShowBackModal(true);
    });
    return unsubscribe;
  }, [navigation]);

  const confirmGoBack = useCallback(() => {
    confirmedRef.current = true;
    setShowBackModal(false);
    reset(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
  }, []);

  const cancelGoBack = useCallback(() => {
    setShowBackModal(false);
  }, []);

  const {
    mutate: createAccountPayload,
    isPending,
    isIdle,
  } = useMutation<CreateAccountResponse, Error, CreateAccountPayload>({
    mutationFn: createAccountApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message });
      navigate(NavigationRoutes.AUTH_STACK.PAYMENT, {
        country_code,
        phone_number,
        phone_with_code,
        pricing,
      });
    },
    onError: ({ message }) => {
      Toast.show({ type: 'error', text1: message });
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      name: data.fullName,
      password: data.password,
      country_code,
      phone_number: String(phone_number),
      phone_with_code,
      listing_count,
      agreeToTerms: isTermsAccepted
    };
    createAccountPayload(payload);
  };

  return {
    isLoading: isPending && !isIdle,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    handleLanguage: () => console.log('AR Toggled'),
    isTermsAccepted,
    toggleTerms,
    showBackModal,
    confirmGoBack,
    cancelGoBack,
  };
}
