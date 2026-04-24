import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRoute, useNavigation } from '@react-navigation/native'; // Added useNavigation
import { useMutation } from '@tanstack/react-query';
import {
  CreateAccountPayload,
  CreateAccountResponse,
} from '@/types/api/authTypes';
import { createAccountApi } from '@/services/authApi';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Toast from 'react-native-toast-message';
import { useCallback, useState, useEffect, useRef } from 'react'; // Added useEffect, useRef

// SignUp Schema
const signUpSchema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain letters')
    .matches(/[0-9]/, 'Password must contain numbers')
    .required('Password is required'),
});

export default function useCreateAccountContainer() {
  const route = useRoute<any>();
  const navigation = useNavigation(); // Hook for navigation

  const { params } = useRoute();
  const country_code = params?.payload?.country_code;
  const phone_number = params?.payload?.phone_number;
  const phone_with_code = params?.payload?.phone_with_code;
  const listing_count = params?.payload?.listing_count;
  const pricing = params?.payload?.pricing;
  
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  
  // --- Back Navigation Interception States ---
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [navAction, setNavAction] = useState<any>(null);
  const allowGoBack = useRef(false); // Ref to check if we should allow going back

  const prefill = (route.params as any) || {};

  console.log('deeplinkTest', prefill);

  const toggleTerms = useCallback(() => setIsTermsAccepted(prev => !prev), []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      password: '',
    },
  });

  // Intercept back navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (allowGoBack.current) {
        return; // Modal me 'Confirm' press karne par back jane do
      }

      // Default back behavior ko rok do
      e.preventDefault();
      
      // Action save karo aur modal show karo
      setNavAction(e.data.action);
      setIsExitModalVisible(true);
    });

    return unsubscribe;
  }, [navigation]);

  const onConfirmExit = () => {
    setIsExitModalVisible(false);
    allowGoBack.current = true; // Ab allow kar do back jana
    setTimeout(() => {
      if (navAction) {
        navigation.dispatch(navAction); // Save kiya hua action perform karo (jaise goBack)
      }
    }, 100);
  };

  const onCancelExit = () => {
    setIsExitModalVisible(false);
    setNavAction(null);
  };
  // -------------------------------------------

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
    // Export modal states and functions
    isExitModalVisible,
    onConfirmExit,
    onCancelExit,
  };
}