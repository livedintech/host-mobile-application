import { useState, useRef, useCallback, useEffect } from 'react';
import { FlatList, I18nManager } from 'react-native';
import { navigate, replace } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';

export default function useOnboardingContainer() {
    const { t } = useTranslation();
    const isRTL = I18nManager.isRTL;
    const setHasSeenOnboarding = useAuthStore(s => s.setHasSeenOnboarding);

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

    const total = onboardingData.length;

    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === total - 1;

    const flatListRef = useRef<FlatList>(null);
    const isScrolling = useRef(false);

    // viewabilityConfig must be stable (useRef) to avoid FlatList warning
    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

    // Keep a ref of activeIndex so handleContinue can read it without stale closure.
    const activeIndexRef = useRef(0);

    // onViewableItemsChanged reports the data index of the visible item — RTL-safe.
    // Buttons update ONLY when the slide is actually visible, preventing jerk.
    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            const idx = viewableItems[0].index;
            activeIndexRef.current = idx;
            setActiveIndex(idx);
            isScrolling.current = false;
        }
    });

    // In RTL, FlatList physically shows item[total-1] (slide 3) first because RTL layout
    // is mirrored. Scroll to index 0 after mount so slide 1 is visible first.
    useEffect(() => {
        if (isRTL) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index: 0, animated: false });
            }, 100);
        }
    }, []);

    const handleContinue = useCallback(() => {
        if (isScrolling.current) return;
        const next = activeIndexRef.current + 1;
        if (next >= total) return;
        isScrolling.current = true;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
    }, [total]);

    const handleSkip = useCallback(() => {
        flatListRef.current?.scrollToIndex({ index: total - 1, animated: true });
    }, [total]);

    const loginWithPhone = useCallback(() => {
        // setHasSeenOnboarding();
        navigate(NavigationRoutes.AUTH_STACK.PROPERTY_CAN_EARN);
    }, []);

    const handleGetStarted = useCallback(() => {
        setHasSeenOnboarding();
        replace(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    }, []);

    return {
        activeIndex,
        isLastSlide,
        flatListRef,
        viewabilityConfig,
        onViewableItemsChanged,
        handleContinue,
        handleGetStarted,
        loginWithPhone,
        handleSkip,
        onboardingData,
        total,
    };
}
