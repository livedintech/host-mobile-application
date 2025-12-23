import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const homeSchema = yup.object().shape({
  city: yup.string().required('City is required'),
  district: yup.string().required('District is required'),
  bedrooms: yup.string().required('Number of bedrooms is required'),
});

export default function usePropertyCanEarnContainer() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(homeSchema),
    defaultValues: { city: '', district: '', bedrooms: '' }
  });

  const onNext = (data: any) => {
    console.log("Form Data:", data);
    setIsLoading(true);
    // Mocking API call for calculation
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1000);
  };
  const goTologinWithPhone = useCallback(()=>{
    navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)
  },[]);

  const goToConnectAccountIntro = useCallback(() =>{
    navigate(NavigationRoutes.AUTH_STACK.CONNECT_CALENDARS_INTRO)
  },[])

  return {
    control,
    errors,
    showResults,
    isLoading,
    handleSubmit: handleSubmit(onNext),
    resetView: () => setShowResults(false),
    goTologinWithPhone,
    goToConnectAccountIntro
  };
}