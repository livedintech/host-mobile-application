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

const BookingComPMSIDScreen = () => {
    const {
        control,
        errors,
        handleSubmit,
        handleTestConnection,
        isSubmitting,
        isTesting,
        apartments,
        isTestSuccess,
        listingOptions
    } = useBookingComContainer()

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <RefreshableScrollView style={styles.container}>

                {/* Header */}
                <AppText
                    text="Connect OTAS"
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
                            label="Title"
                            name="roomId"
                            control={control}
                            errors={errors}
                            placeholder="Enter Room ID"
                        />
                    </View>

                    <View style={styles.halfCol}>
                        <DropdownField
                            label="Select Apartment"
                            name="apartmentId"
                            control={control}
                            errors={errors}
                            placeholder="Select Apartment"
                            data={listingOptions}
                        />
                    </View>

                    {/* Row 2: Hotel ID — half width */}
                    <View style={styles.halfCol}>
                        <InputField
                            label="Enter Hotel ID"
                            name="hotelId"
                            control={control}
                            errors={errors}
                            placeholder="Enter Hotel ID"
                        />
                    </View>

                    {/* Buttons */}
                    <AppButton
                        title="Test Connection"
                        onPress={handleTestConnection}
                        loading={isTesting}
                        mb={10}
                    />
                    <AppButton
                        title="Submit"
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