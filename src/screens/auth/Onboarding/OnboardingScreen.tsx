import React from 'react';
import { View, StyleSheet, FlatList, ImageBackground } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useOnboardingContainer, { onboardingData } from './OnboardingContainer';

const OnboardingScreen = () => {
    const {
        activeIndex,
        flatListRef,
        handleMomentumScrollEnd,
        handleContinue,
        handleGetStarted,
        loginWithPhone,
        handleSkip
    } = useOnboardingContainer();

    const isLastSlide = activeIndex === onboardingData.length - 1;

    const renderItem = ({ item }: any) => (
        <ImageBackground style={styles.slide} source={item.bg} resizeMode='cover'>
            {/* Dark overlay for text legibility if needed */}
            <View style={styles.overlay} />

            <View style={styles.contentContainer}>
                <View style={styles.textSection}>
                    <AppText
                        text={item.title}
                        textAlign='center'
                        fontSize={32}
                        color={Colors.WHITE}
                        type='Bold'
                        lineHeight={40}
                    />
                    <AppText
                        text={item.subtitle}
                        textAlign='center'
                        fontSize={16}
                        color={Colors.WHITE}
                        style={styles.description}
                    />
                </View>
            </View>
        </ImageBackground>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                keyExtractor={(item) => item.id}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {onboardingData.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            activeIndex === i ? styles.activeDot : styles.inactiveDot
                        ]}
                    />
                ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.footer}>
                <ButtonView
                    style={styles.glassButton}
                    onPress={isLastSlide ? handleGetStarted : handleContinue}
                >
                    <AppText text={onboardingData[activeIndex].primaryBtn} color={Colors.WHITE} type='Bold' fontSize={16} />
                </ButtonView>

                <ButtonView
                    style={styles.glassButtonSecondary}
                    onPress={isLastSlide ? loginWithPhone : handleSkip}
                >
                    <AppText text={onboardingData[activeIndex].secondaryBtn} color={Colors.WHITE} type='Regular' fontSize={16} />
                </ButtonView>
            </View>
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    slide: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)', // Subtle dimming for text clarity
    },
    contentContainer: {
        flex: 1,
        paddingTop: Metrics.verticalScale(100),
        paddingHorizontal: Metrics.scale(40),
    },
    textSection: {
        alignItems: 'center',
    },
    description: {
        marginTop: Metrics.verticalScale(12),
        opacity: 0.9,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: Metrics.verticalScale(180), // Adjusted to sit above buttons
        alignSelf: 'center',
    },
    dot: {
        height: Metrics.scale(6),
        borderRadius: 100,
        marginHorizontal: Metrics.scale(4),
    },
    activeDot: {
        width: Metrics.scale(40),
        backgroundColor: '#20957B', // Your branding Teal
    },
    inactiveDot: {
        width: Metrics.scale(10),
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    footer: {
        position: 'absolute',
        bottom: Metrics.verticalScale(50),
        width: '100%',
        paddingHorizontal: Metrics.scale(30),
    },
    glassButton: {
        height: Metrics.verticalScale(56),
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Metrics.verticalScale(12),
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glass effect
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    glassButtonSecondary: {
        height: Metrics.verticalScale(56),
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker glass for skip
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
});