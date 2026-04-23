import { useState, useRef, useCallback } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useTranslation } from 'react-i18next';




export default function useOnboardingContainer() {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
      const { t } = useTranslation();

    const onboardingData = [
    {
      id: '1',
      title:        t('auth.onboarding.slide1.title'),
      subtitle:     t('auth.onboarding.slide1.subtitle'),
      primaryBtn:   t('auth.onboarding.slide1.primary_btn'),
      secondaryBtn: t('auth.onboarding.slide1.secondary_btn'),
      bg: require('@/assets/img/unlock_onboard.png'),
      bgAr: require('@/assets/img/unlock_onboard.png'),

    },
    {
      id: '2',
      title:        t('auth.onboarding.slide2.title'),
      subtitle:     t('auth.onboarding.slide2.subtitle'),
      primaryBtn:   t('auth.onboarding.slide2.primary_btn'),
      secondaryBtn: t('auth.onboarding.slide2.secondary_btn'),
      isItalicTitle: true,
      bg: require('@/assets/img/intelligent.png'),
      bgAr: require('@/assets/img/intelligent.png'),

    },
    {
      id: '3',
      title:        t('auth.onboarding.slide3.title'),
      subtitle:     t('auth.onboarding.slide3.subtitle'),
      primaryBtn:   t('auth.onboarding.slide3.primary_btn'),
      secondaryBtn: t('auth.onboarding.slide3.secondary_btn'),
      bg: require('@/assets/img/control.png'),
      bgAr: require('@/assets/img/control_ar.png'),

    },
  ];

    const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / Metrics.screenWidth);
        setActiveIndex(index);
    };

    const handleContinue = () => {
        if (activeIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
            setActiveIndex(activeIndex + 1);
        }
    };
    const loginWithPhone = useCallback(() =>{
        navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)
    },[]);

    const handleGetStarted = useCallback(() => {
        console.log('handleGetStarted')
        navigate(NavigationRoutes.AUTH_STACK.PROPERTY_CAN_EARN)
    }, []);
     const handleSkip = useCallback(() => {
        navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)
    }, []);

    return {
        activeIndex,
        flatListRef,
        handleMomentumScrollEnd,
        handleContinue,
        handleGetStarted,
        loginWithPhone,
        handleSkip,
        onboardingData
    };
}