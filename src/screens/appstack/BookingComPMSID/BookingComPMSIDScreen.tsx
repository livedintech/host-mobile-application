import { StyleSheet, View } from 'react-native'
import React from 'react'
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView'
import useBookingComContainer from './BookingComContainer'
import InputField from '@/components/molecules/Input/InputField'
import DropdownField from '@/components/molecules/Input/DropdownField'
import AppText from '@/components/molecules/AppText/AppText'
import AppButton from '@/components/molecules/AppButton/AppButton'
import Metrics from '@/utility/Metrics'
import { Colors } from '@/theme/colors'
import BGImage from '@/components/molecules/BGImage/BGImage'
import { useTranslation } from 'react-i18next'

const BookingComPMSIDScreen = () => {
    const { t } = useTranslation()
    const {
        control,
        errors,
        handleSubmit,
        handleTestConnection,
        isSubmitting,
        isTesting,
        isTestSuccess,
        listingOptions,
        hasApartment
    } = useBookingComContainer()

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <RefreshableScrollView style={styles.container}>

                {/* Header */}
                <AppText
                    text={t('app.booking_com_pms.title')}
                    type="Bold"
                    fontSize={32}
                    color={Colors.BRUNSWICK_GREEN}
                    mb={30}
                />

                {/* Form Card */}
                <View style={styles.cardInner}>

                    {/* Row 1: Title + Select Apartment */}
                    <View style={styles.halfCol}>
                        <InputField
                            label={t('app.booking_com_pms.title_label')}
                            name="roomId"
                            control={control}
                            errors={errors}
                            placeholder={t('app.booking_com_pms.title_placeholder')}
                        />
                    </View>

                    <View style={styles.halfCol}>
                        <DropdownField
                            label={t('app.booking_com_pms.apartment_label')}
                            name="apartmentId"
                            control={control}
                            errors={errors}
                            placeholder={t('app.booking_com_pms.apartment_label')}
                            data={listingOptions}
                        />
                    </View>
                    {!hasApartment ? (
                        <View style={styles.halfCol}>
                            <InputField
                                label={t('app.booking_com_pms.rate_label')}
                                name="rate"
                                control={control}
                                errors={errors}
                                placeholder={t('app.booking_com_pms.rate_placeholder')}
                            />
                        </View>
                    ) : null}

                    {/* Row 2: Hotel ID — half width */}
                    <View style={styles.halfCol}>
                        <InputField
                            label={t('app.booking_com_pms.hotel_id_label')}
                            name="hotelId"
                            control={control}
                            errors={errors}
                            placeholder={t('app.booking_com_pms.hotel_id_label')}
                        />
                    </View>

                    {/* Buttons */}
                    <AppButton
                        title={t('app.booking_com_pms.test_connection')}
                        onPress={handleTestConnection}
                        loading={isTesting}
                        mb={10}
                    />
                    <AppButton
                        title={t('app.booking_com_pms.submit')}
                        onPress={handleSubmit}
                        loading={isSubmitting}
                        disabled={!isTestSuccess || isTesting}
                    />
                </View>
            </RefreshableScrollView>
        </BGImage>
    )
}

export default BookingComPMSIDScreen

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Metrics.baseMargin,
        paddingTop: 50,
    },
    cardWrapper: {
        marginBottom: 20,
    },
    cardInner: {
        padding: 24,
        borderRadius: 30,
        gap: 4,
        borderColor: Colors.BEAUTY_SILVER,
        borderWidth: 1
    },
    halfCol: {
        flex: 1,
    },
})