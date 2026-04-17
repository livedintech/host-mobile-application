import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const FinishUpStep3Screen = () => {

    const onNext = () => {
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_BOOKING_DETAIL);
    };

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.container}>

                {/* Header Section */}
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => goBack()}>
                        <Svgicons path='arrowLeftIcon' size={24} color={Colors.BLACK} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Illustration Image */}
                    <Svgicons path='house_step3' size={326} />
                    {/* <View style={styles.imageContainer}>
                        <Image
                            source={require('@/assets/img/illustrations/house_step3.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View> */}

                    {/* Text Content */}
                    <View style={styles.textContainer}>
                        <AppText text="Step 3" fontSize={20} type="Medium" color={Colors.BLACK} />
                        <AppText
                            text="Finish up and go live"
                            fontSize={28}
                            type="Bold"
                            mt={20}
                            pr={90}
                        />
                        <AppText
                            text="In this step, choose your nightly rate, respond to a few final questions, and publish your property when you're ready."
                            fontSize={12}
                            color={Colors.DARK_CHARCOAL_OPACITY}
                            mt={30}
                        />
                    </View>
                </View>

                {/* Footer Navigation */}
                <View style={styles.footer}>
                    <AppButton
                        title="Next"
                        onPress={onNext}
                    />
                </View>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: {
        paddingHorizontal: 25,
        paddingTop: 20,
        flexDirection: 'row',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    image: {
        width: '100%',
        height: 280,
    },
    textContainer: {
        marginTop: 0,
    },
    footer: {
        padding: 25,
        paddingBottom: 40,
    },
});

export default FinishUpStep3Screen;