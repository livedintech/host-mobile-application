import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView'
import InputField from '@/components/molecules/Input/InputField'
import AppText from '@/components/molecules/AppText/AppText'
import AppButton from '@/components/molecules/AppButton/AppButton'
import Metrics from '@/utility/Metrics'
import { Colors } from '@/theme/colors'
import BGImage from '@/components/molecules/BGImage/BGImage'
import { goBack } from '@/services/navigationService'
import useBookingComStep1Container from './BookingComStep1Container'
import { useTranslation } from 'react-i18next'

const BookingComStep1Screen = () => {
    const { t } = useTranslation()
    const {
        control,
        errors,
        handleNext,
        isTesting,
    } = useBookingComStep1Container()

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <RefreshableScrollView style={styles.container}>
                

                <View style={styles.contentContainer}>
                    {/* Header */}
                    <AppText
                        text={t('app.booking_com_step1.enter_your')}
                        type="Regular"
                        fontSize={32}
                        color={Colors.BLACK}
                    >
                        <AppText
                            text={t('app.booking_com_step1.property_id_highlight')}
                            type="Bold"
                            fontSize={32}
                            color={Colors.TEAL_PRIMARY_ALT}
                        />
                    </AppText>

                    <View style={styles.inputWrapper}>
                        {/* Input Field */}
                        <InputField
                            label={t('app.booking_com_step1.property_id_label')}
                            name="hotelId"
                            control={control}
                            errors={errors}
                            placeholder="12345687"
                            keyboardType="numeric"
                        />

                        {/* Instructional Text */}
                        <AppText
                            text={t('app.booking_com_step1.description')}
                            type="Regular"
                            fontSize={12}
                            color={Colors.BLACK_53_PERCENT} 
                            mt={15}
                            style={{ lineHeight: 18 }}
                        />
                    </View>
                </View>

            </RefreshableScrollView>

            {/* Bottom Button */}
            <View style={styles.footer}>
                <AppButton
                    title={t('app.booking_com_step1.next')}
                    onPress={handleNext}
                    loading={isTesting}
                />
            </View>
        </BGImage>
    )
}

export default BookingComStep1Screen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Metrics.baseMargin,
    },
    backButton: {
        marginTop: 50,
        marginBottom: 30,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    contentContainer: {
        marginTop: 40,
    },
    inputWrapper: {
        marginTop: 40,
    },
    footer: {
        paddingHorizontal: Metrics.baseMargin,
        paddingBottom: 40,
        paddingTop: 20,
    }
})