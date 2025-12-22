import { useState, useRef } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Metrics from '@/utility/Metrics';

export const onboardingData = [
    {
        id: '1',
        title: 'Unlock Higher Returns\nFrom Your Property',
        subtitle: 'Powered by intelligent automation',
        primaryBtn: 'Continue',
        secondaryBtn: 'Skip',
    },
    {
        id: '2',
        title: 'One Intelligent Control\nfor Every Channel',
        subtitle: 'Agent ALI works across all channels so\nthe host doesn’t have to.',
        primaryBtn: 'Continue',
        secondaryBtn: 'Skip',
        isItalicTitle: true,
    },
    {
        id: '3',
        title: 'Total Control. Zero\nHeavy Lifting.',
        subtitle: 'Agent ALI does the work. You stay in charge.',
        primaryBtn: 'Get Started',
        secondaryBtn: 'Login with Phone Number',
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

    return {
        activeIndex,
        flatListRef,
        handleMomentumScrollEnd,
        handleContinue,
    };
}