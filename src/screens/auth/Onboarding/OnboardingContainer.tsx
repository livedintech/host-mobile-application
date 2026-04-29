import { useState, useRef, useCallback } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, I18nManager } from 'react-native';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useTranslation } from 'react-i18next';

export default function useOnboardingContainer() {
    const { t } = useTranslation();
    const isRTL = I18nManager.isRTL;

    const onboardingData = [
        {
            id: '1',
            title: t('auth.onboarding.slide1.title'),
            titleHighlight: t('auth.onboarding.slide1.title_highlight'),
            isHighlightItalic: true,
            subtitle: t('auth.onboarding.slide1.subtitle'),
            primaryBtn: t('auth.onboarding.slide1.primary_btn'),
            secondaryBtn: t('auth.onboarding.slide1.secondary_btn'),
            bg: require('@/assets/img/onboadingImg1.png'),
        },
        {
            id: '2',
            title: t('auth.onboarding.slide2.title'),
            titleHighlight: t('auth.onboarding.slide2.title_highlight'),
            isHighlightItalic: true,
            subtitle: t('auth.onboarding.slide2.subtitle'),
            primaryBtn: t('auth.onboarding.slide2.primary_btn'),
            secondaryBtn: t('auth.onboarding.slide2.secondary_btn'),
            bg: require('@/assets/img/onboadingImg2.png'),
        },
        {
            id: '3',
            title: t('auth.onboarding.slide3.title'),
            titleHighlight: t('auth.onboarding.slide3.title_highlight'),
            isHighlightItalic: true,
            subtitle: t('auth.onboarding.slide3.subtitle'),
            primaryBtn: t('auth.onboarding.slide3.primary_btn'),
            secondaryBtn: t('auth.onboarding.slide3.secondary_btn'),
            bg: require('@/assets/img/onboadingImg3.png'),
        },
    ];

    const [activeIndex, setActiveIndex] = useState(
        isRTL ? onboardingData.length - 1 : 0
    );

    const flatListRef = useRef<FlatList>(null);
    const isScrolling = useRef(false);

    const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = Math.abs(e.nativeEvent.contentOffset.x);
        const index = Math.round(offsetX / Metrics.screenWidth);
        const clampedIndex = Math.max(0, Math.min(index, onboardingData.length - 1));
        setActiveIndex(clampedIndex);
        isScrolling.current = false;
    };

    const handleContinue = useCallback(() => {
        if (isScrolling.current) return;

        setActiveIndex(prev => {
            if (prev >= onboardingData.length - 1) return prev;

            const nextIndex = prev + 1;
            isScrolling.current = true;

            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            }, 0);

            return nextIndex;
        });
    }, [onboardingData.length]);

    const loginWithPhone = useCallback(() => {
        navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    }, []);

    const handleGetStarted = useCallback(() => {
        navigate(NavigationRoutes.AUTH_STACK.PROPERTY_CAN_EARN);
    }, []);

    const handleSkip = useCallback(() => {
        navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    }, []);

    return {
        activeIndex,
        flatListRef,
        handleMomentumScrollEnd,
        handleContinue,
        handleGetStarted,
        loginWithPhone,
        handleSkip,
        onboardingData,
    };
}
