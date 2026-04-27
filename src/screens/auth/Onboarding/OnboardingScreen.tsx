import React from 'react';
import { View, StyleSheet, FlatList, ImageBackground, I18nManager } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useOnboardingContainer from './OnboardingContainer';
import i18n from '@/locales/i18n/i18n';

const OnboardingScreen = () => {
    const {
        activeIndex,
        flatListRef,
        handleMomentumScrollEnd,
        handleContinue,
        handleGetStarted,
        loginWithPhone,
        handleSkip,
        onboardingData
    } = useOnboardingContainer();

    const isLastSlide = activeIndex === onboardingData.length - 1;

    const renderItem = ({ item }: any) => {
        const bgImage = i18n.language === 'ar' ? item.bgAr : item.bg;

        return (
            <ImageBackground style={styles.slide} source={bgImage} resizeMode='cover'>
                <View style={styles.overlay} />
                <View style={styles.contentContainer}>
                    <View style={styles.textSection}>
                        <AppText
                            text={item.title}
                            textAlign='center'
                            fontSize={26}
                            color={Colors.WHITE}
                            type='Bold'
                            lineHeight={34}
                            mb={11}
                        />
                        <AppText
                            text={item.subtitle}
                            textAlign='center'
                            fontSize={14}
                            color={Colors.WHITE}
                            style={styles.description}
                            type='Medium'
                        />
                    </View>
                </View>
            </ImageBackground>
        );
    };

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
                {onboardingData.map((_, i) => {
                    const displayIndex = I18nManager.isRTL
                        ? onboardingData.length - 1 - activeIndex
                        : activeIndex;

                    return (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                displayIndex === i ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    );
                })}
            </View>

            {/* Action Buttons */}
            <View style={styles.footer}>
                <ButtonView
                    style={styles.glassButton}
                    onPress={isLastSlide ? handleGetStarted : handleContinue}
                >
                    <AppText text={onboardingData[activeIndex].primaryBtn} color={Colors.WHITE} type='Regular' fontSize={14} />
                </ButtonView>

                <ButtonView
                    style={styles.glassButtonSecondary}
                    onPress={isLastSlide ? loginWithPhone : handleSkip}
                >
                    <AppText text={onboardingData[activeIndex].secondaryBtn} color={Colors.WHITE} type='Regular' fontSize={14} />
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
        backgroundColor: 'rgba(0,0,0,0.2)',
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
        bottom: Metrics.verticalScale(195),
        alignSelf: 'center',
    },
    dot: {
        height: Metrics.scale(6),
        borderRadius: 100,
        marginHorizontal: Metrics.scale(4),
    },
    activeDot: {
        width: Metrics.scale(40),
        backgroundColor: '#09A389',
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
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    glassButtonSecondary: {
        height: Metrics.verticalScale(56),
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
});