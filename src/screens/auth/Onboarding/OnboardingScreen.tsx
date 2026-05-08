import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useOnboardingContainer from './OnboardingContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';
import AppButton from '@/components/molecules/AppButton/AppButton';

const TEAL = '#09A389';
const BG_COLOR = '#EEF5F3';

const OnboardingScreen = () => {
    const {
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
    } = useOnboardingContainer();

    const currentSlide = onboardingData[activeIndex];

    const renderMixedTitle = (item: typeof onboardingData[0]) => {
        const { title, titleHighlight, isHighlightItalic } = item;
        const parts = title.split(titleHighlight);

        return (
            <AppText type='Bold' fontSize={28} color='#1A2421' textAlign='center' style={styles.title}>
                {parts[0]}
                <AppText type='Bold' fontSize={28} color={TEAL} italic={isHighlightItalic}>
                    {titleHighlight}
                </AppText>
                {parts[1] ?? ''}
            </AppText>
        );
    };

    const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
        <View style={styles.slide}>
            <View style={styles.textContainer}>
                {renderMixedTitle(item)}
                <AppText
                    text={item.subtitle}
                    textAlign='center'
                    fontSize={14}
                    color={Colors.EERIE_BLACK}
                    type='Regular'
                    lineHeight={22}
                    style={styles.subtitle}
                />
            </View>
            <View style={styles.imageContainer}>
                <Image source={item.bg} style={styles.image} resizeMode='contain' />
            </View>
        </View>
    );

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                    length: Metrics.screenWidth,
                    offset: Metrics.screenWidth * index,
                    index,
                })}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewabilityConfig.current}
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
                <AppButton
                    onPress={isLastSlide ? loginWithPhone : handleSkip}
                    title={isLastSlide ? currentSlide.primaryBtn : currentSlide.secondaryBtn}
                    variant='secondary'
                    type='Regular'
                />
                <AppButton
                    onPress={isLastSlide ? handleGetStarted : handleContinue}
                    title={isLastSlide ? currentSlide.secondaryBtn : currentSlide.primaryBtn}
                    variant='primary'
                    type='Regular'
                />
            </View>
        </BGImage>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_COLOR,
    },
    slide: {
        width: Metrics.screenWidth,
        paddingBottom: Metrics.verticalScale(220),
    },
    textContainer: {
        paddingTop: Metrics.verticalScale(72),
        paddingHorizontal: Metrics.scale(32),
        alignItems: 'center',
    },
    title: {
        marginTop: Metrics.verticalScale(50),
        marginBottom: Metrics.verticalScale(12),
    },
    subtitle: {
        paddingHorizontal: Metrics.scale(20)
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: Metrics.scale(20),
    },
    image: {
        width: Metrics.screenWidth * 0.72,
        height: Metrics.verticalScale(360),
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: Metrics.verticalScale(178),
        alignSelf: 'center',
    },
    dot: {
        height: Metrics.scale(6),
        borderRadius: 100,
        marginHorizontal: Metrics.scale(4),
    },
    activeDot: {
        width: Metrics.scale(40),
        backgroundColor: TEAL,
    },
    inactiveDot: {
        width: Metrics.scale(10),
        backgroundColor: 'rgba(9, 163, 137, 0.25)',
    },
    footer: {
        position: 'absolute',
        bottom: Metrics.verticalScale(40),
        width: '100%',
        paddingHorizontal: Metrics.scale(24),
        gap: Metrics.verticalScale(12),
    },
    outlineButton: {
        height: Metrics.verticalScale(56),
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(26, 36, 33, 0.15)',
    },
    tealButton: {
        height: Metrics.verticalScale(56),
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: TEAL,
    },
});
