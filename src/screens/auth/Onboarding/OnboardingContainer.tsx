import { useState, useRef, useCallback } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export const onboardingData = [
    {
        id: '1',
        title: 'Unlock Higher Returns From Your Property',
        subtitle: 'Powered by intelligent automation',
        primaryBtn: 'Continue',
        secondaryBtn: 'Skip',
        bg: require('@/assets/img/unlock_onboard.png'),
    },
    {
        id: '2',
        title: 'One Intelligent Control\nfor Every Channel',
        subtitle: 'Agent ALI works across all channels so\nthe host doesn’t have to.',
        primaryBtn: 'Continue',
        secondaryBtn: 'Skip',
        isItalicTitle: true,
        bg: require('@/assets/img/intelligent.png'),
    },
    {
        id: '3',
        title: 'Total Control. Zero\nHeavy Lifting.',
        subtitle: 'Agent ALI does the work. You stay in charge.',
        primaryBtn: 'Get Started',
        secondaryBtn: 'Login with Phone Number',
        bg: require('@/assets/img/control.png'),
    },
];

export default function useOnboardingContainer() {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

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
        handleSkip
    };
}