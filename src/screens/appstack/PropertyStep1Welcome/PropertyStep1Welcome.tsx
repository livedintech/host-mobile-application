import React, { useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const PropertyStep1Welcome = () => {
    const onCreateNew = useCallback(() => {
        navigate(NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE)
    }, []);
    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Svgicons path='houseIllustration' size={326} />
                    <View style={styles.textWrapper}>
                        <AppText
                            text="Step 1"
                            fontSize={20}
                            type="Medium"
                            color={Colors.BLACK}
                            mb={20}
                        />

                        <AppText
                            text="Tell us about your property"
                            fontSize={32}
                            type="Bold"
                            color={Colors.BLACK}
                            style={styles.heading}
                            mb={20}
                        />

                        <AppText
                            text="In this step, provide the basic details of your property, including the property type, location, guest capacity, and other key property information to set up your listing."
                            fontSize={14}
                            type="Regular"
                            color="#6B6B6B"
                            style={styles.description}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <AppButton
                        title="Next"
                        color={Colors.WHITE}
                        fontSize={16}
                        onPress={onCreateNew}
                    />
                </View>

            </View>
        </BGImage>
    );
};

export default PropertyStep1Welcome;

const styles = StyleSheet.create({
    bgContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
    },
    illustration: {
        width: '100%',
        height: 250,
        alignSelf: 'center',
        marginBottom: 40,
    },
    textWrapper: {
        alignItems: 'flex-start',
    },
    heading: {
        marginTop: 10,
        lineHeight: 40,
    },
    description: {
        marginTop: 15,
        lineHeight: 22,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
});