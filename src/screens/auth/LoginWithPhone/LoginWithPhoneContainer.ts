// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import {
//   checkUserisExistFormValues,
//   checkUserisExistSchema
// } from '@/validation/auth/authSchemas';
// import { useMutation } from '@tanstack/react-query';
// import {
//   CheckUserExistPayload,
//   CheckUserExistResponse,
// } from '@/types/api/authTypes';
// import { CheckUserApi } from '@/services/authApi';
// import Toast from 'react-native-toast-message';
// import { navigate } from '@/services/navigationService';
// import NavigationRoutes from '@/navigation/NavigationRoutes';
// import { useState } from 'react';
// import { usePhoneStore } from '@/store/usePhoneStore';
// import { useRememberMeStore } from '@/store/useRememberMeStore';

// export default function useLoginWithPhoneContainer() {
//   const { callingCode, cca2, clearCredentials, password, phoneNumber: storePhoneNo, rememberMe, setRememberMe, setPassword } = useRememberMeStore()


//   const setPhoneData = usePhoneStore((state) => state.setPhoneData);

//   const [phoneNumber, setphoneNumber] = useState('');
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm<checkUserisExistFormValues>({
//     resolver: yupResolver(checkUserisExistSchema),
//     defaultValues: {
//       country: { cca2: cca2 || 'SA', callingCode: callingCode || '966' },
//       phoneNumber: storePhoneNo || '',
//     },
//   });
//   const countryCca2 = watch('country')?.cca2;
//   const countryCallingCode = watch('country')?.callingCode;
//   const phoneNo = watch('phoneNumber');

//   console.log('countryCca2', countryCca2);
//   console.log('countryCallingCode', countryCallingCode);





//   // ----------------- Normal Login -----------------
//   const {
//     mutate: checkUserPayload,
//     isPending,
//     isIdle,
//   } = useMutation<CheckUserExistResponse, Error, CheckUserExistPayload>({
//     mutationFn: CheckUserApi,
//     onSuccess: data => {
//       const payload = {
//         countryCca2,
//         countryCallingCode,
//         phoneNo
//       }
//       navigate(NavigationRoutes.AUTH_STACK.ENTER_PASSWORD, payload);
//     },
//     onError: error => {
//       if (error?.message === 'User not found') {
//         setPhoneData({
//           phoneNumber: phoneNumber
//         })
//         // navigate(NavigationRoutes.AUTH_STACK.MANAGE_LISTING, phoneNumber);
//         navigate(NavigationRoutes.AUTH_STACK.VERIFY_PHONE_NUMBER, phoneNumber);
//       }
//       // Toast.show({
//       //   type: 'error',
//       //   text1: error.message || 'Something went wrong',
//       // });
//     },
//   });

//   const onSubmit = async (data: checkUserisExistFormValues) => {

//     const payload = {
//       phone_number: data?.country?.callingCode + data?.phoneNumber,
//     };
//     setphoneNumber(payload?.phone_number);
//     checkUserPayload(payload);
//   };

//   return {
//     isLoading: isPending && !isIdle,
//     control,
//     errors,
//     watch,
//     handleSubmit,
//     onSubmit,
//   };
// }

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  checkUserisExistFormValues,
  checkUserisExistSchema
} from '@/validation/auth/authSchemas';
import { useMutation } from '@tanstack/react-query';
import {
  CheckUserExistPayload,
  CheckUserExistResponse,
  VerifyOtpPayload // Import your payload type
} from '@/types/api/authTypes';
import { CheckUserApi, resendOtpApi } from '@/services/authApi'; // Import resendOtpApi
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useState } from 'react';
import { usePhoneStore } from '@/store/usePhoneStore';
import { useRememberMeStore } from '@/store/useRememberMeStore';

export default function useLoginWithPhoneContainer() {
  const { cca2, callingCode, phoneNumber: storePhoneNo,rememberMe,setRememberMe } = useRememberMeStore();
  const setPhoneData = usePhoneStore((state) => state.setPhoneData);
  const [phoneNumber, setphoneNumber] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<checkUserisExistFormValues>({
    resolver: yupResolver(checkUserisExistSchema),
    defaultValues: {
      country: { cca2: cca2 || 'SA', callingCode: callingCode || '966' },
      phoneNumber: storePhoneNo || '',
    },
  });

  const countryCca2 = watch('country')?.cca2;
  const countryCallingCode = watch('country')?.callingCode;
  const phoneNo = watch('phoneNumber');

  // --- 1. Mutation to Send OTP (to be called if user is not found) ---
  const { mutate: sendOtpForNewUser, isPending: isSendingOtp } = useMutation({
    mutationFn: resendOtpApi,
    onSuccess: () => {
      // Navigate ONLY after the OTP has been successfully sent
      
      navigate(NavigationRoutes.AUTH_STACK.VERIFY_PHONE_NUMBER, {
        isLoginScreen: false,
        phone: countryCallingCode + phoneNo,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Failed to send verification code',
      });
    }
  });

  // --- 2. Mutation to Check User Existence ---
  const {
    mutate: checkUserPayload,
    isPending,
    isIdle,
  } = useMutation<CheckUserExistResponse, Error, CheckUserExistPayload>({
    mutationFn: CheckUserApi,
    onSuccess: () => {
      const payload = {
        countryCca2,
        countryCallingCode,
        phoneNo
      };
      navigate(NavigationRoutes.AUTH_STACK.ENTER_PASSWORD, payload);
    },
    onError: error => {
      if (error?.message === 'User not found') {
        setPhoneData({ phoneNumber: phoneNumber });
        
        // Trigger the OTP send here
        sendOtpForNewUser({ phone_number: phoneNumber });
      } else {
        Toast.show({
          type: 'error',
          text1: error.message || 'Something went wrong',
        });
      }
    },
  });

  const onSubmit = async (data: checkUserisExistFormValues) => {
    const fullPhone = data?.country?.callingCode + data?.phoneNumber;
    setphoneNumber(fullPhone);
    checkUserPayload({ phone_number: fullPhone });
  };

  return {
    // Combine loading states so the button shows spinner during both calls
    isLoading: (isPending && !isIdle) || isSendingOtp,
    control,
    errors,
    watch,
    handleSubmit,
    onSubmit,
    rememberMe,
    setRememberMe
  };
}
