import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';

const DOT_SIZE = 7;
const DOT_GAP = 5;
const DOT_COUNT = 3;
const STAGGER_DELAY = 120;

type DotsLoaderProps = {
    color: string;
    size?: number;
};

const Dot = ({ color, size, delay }: { color: string; size: number; delay: number }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 320, easing: Easing.out(Easing.quad) }),
                    withTiming(0, { duration: 320, easing: Easing.in(Easing.quad) }),
                ),
                -1,
            ),
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 0.6 + progress.value * 0.4 }],
        opacity: 0.35 + progress.value * 0.65,
    }));

    return (
        <Animated.View
            style={[
                { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
                animatedStyle,
            ]}
        />
    );
};

const DotsLoader = ({ color, size = DOT_SIZE }: DotsLoaderProps) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: DOT_COUNT }).map((_, index) => (
                <Dot key={index} color={color} size={size} delay={index * STAGGER_DELAY} />
            ))}
        </View>
    );
};

export default DotsLoader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: DOT_GAP,
    },
});
