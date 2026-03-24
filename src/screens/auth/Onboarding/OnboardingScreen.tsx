// import React from 'react';
// import { View, StyleSheet, FlatList, ImageBackground } from 'react-native';
// import AppText from '@/components/molecules/AppText/AppText';
// import ButtonView from '@/components/molecules/AppButton/ButtonView';
// import { Colors } from '@/theme/colors';
// import Metrics from '@/utility/Metrics';
// import useOnboardingContainer, { onboardingData } from './OnboardingContainer';


// const OnboardingScreen = () => {
//     const {
//         activeIndex,
//         flatListRef,
//         handleMomentumScrollEnd,
//         handleContinue,
//         handleGetStarted,
//         loginWithPhone,
//         handleSkip
//     } = useOnboardingContainer();

//     const isLastSlide = activeIndex === onboardingData.length - 1;

//     const renderItem = ({ item }: any) => (
//         <ImageBackground source={item.bg} style={styles.slide} resizeMode='cover'>
//             <View style={styles.slide}>
//             {/* Top Image Area */}
//             <View style={styles.imageSection} />

//             {/* Text Content Area */}
//             <View style={styles.textSection}>
//                 <AppText
//                     text={item.title}
//                     textAlign='center'
//                     fontSize={30}
//                     color={Colors.BRUNSWICK_GREEN}
//                     type='Bold'
//                 />
//                 <AppText
//                     text={item.subtitle}
//                     textAlign='center'
//                     color={Colors.BLACK_60_PERCENT}
//                     style={styles.description}
//                 />
//             </View>
//         </View>
//         </ImageBackground>

//     );

//     return (
//         <ImageBackground style={styles.container} source={require('@/assets/img/on-boarding-bg.jpg')} resizeMode='cover'>
//             <FlatList
//                 ref={flatListRef}
//                 data={onboardingData}
//                 renderItem={renderItem}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 onMomentumScrollEnd={handleMomentumScrollEnd}
//                 keyExtractor={(item) => item.id}
//             />

//             {/* Custom Pagination Dots */}
//             <View style={styles.pagination}>
//                 {onboardingData.map((_, i) => (
//                     <View
//                         key={i}
//                         style={[
//                             styles.dot,
//                             activeIndex === i ? styles.activeDot : styles.inactiveDot
//                         ]}
//                     />
//                 ))}
//             </View>

//             {/* Action Buttons */}
//             <View style={styles.footer}>
//                 <ButtonView style={styles.btnPrimary} onPress={isLastSlide ? handleGetStarted : handleContinue}>
//                     <AppText text={onboardingData[activeIndex].primaryBtn} color={Colors.BRUNSWICK_GREEN} type='Regular'/>
//                 </ButtonView>

//                 <ButtonView style={styles.btnSecondary} onPress={isLastSlide ? loginWithPhone : handleSkip}>
//                     <AppText text={onboardingData[activeIndex].secondaryBtn} color={Colors.BRUNSWICK_GREEN} type='Regular' />
//                 </ButtonView>
//             </View>
//         </ImageBackground>
//     );
// };

// export default OnboardingScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8F8F8', // Light background to mimic the checkered area
//     },
//     slide: {
//         width: Metrics.screenWidth,
//         flex: 1,
//     },
//     imageSection: {
//         flex: 0.55,
//     },
//     textSection: {
//         flex: 0.55,
//         paddingHorizontal: Metrics.scale(30),
//         alignItems: 'center',
//     },
//     titleRow: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'center',
//     },
//     description: {
//         marginTop: Metrics.verticalScale(15),
//         lineHeight: 24,
//     },
//     pagination: {
//         flexDirection: 'row',
//         position: 'absolute',
//         bottom: Metrics.verticalScale(210),
//         alignSelf: 'center',
//     },
//     dot: {
//         height: Metrics.scale(8),
//         borderRadius: 100,
//         marginHorizontal: Metrics.scale(3),
//     },
//     activeDot: {
//         width: Metrics.scale(53),
//         backgroundColor: Colors.BRUNSWICK_GREEN,
//         borderRadius: 100
//     },
//     inactiveDot: {
//         width: Metrics.scale(10),
//         height: Metrics.verticalScale(8),
//         backgroundColor: '#E0E0E0',
//     },
//     footer: {
//         position: 'absolute',
//         bottom: Metrics.verticalScale(40),
//         width: '100%',
//         paddingHorizontal: Metrics.scale(20),
//     },
//     btnPrimary: {
//         borderWidth: 1,
//         borderColor: '#D1D1D1',
//         borderRadius: 100,
//         height: Metrics.verticalScale(56),
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: Metrics.verticalScale(12),
//         backgroundColor: 'rgba(255,255,255,0.7)',
//     },
//     btnSecondary: {
//         borderWidth: 1,
//         borderColor: '#D1D1D1',
//         borderRadius: 100,
//         height: Metrics.verticalScale(56),
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(255,255,255,0.7)',
//     },
// });

// screens/Onboarding/OnboardingScreen.tsx

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