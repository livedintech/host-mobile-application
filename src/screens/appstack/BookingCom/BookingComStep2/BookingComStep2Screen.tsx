import { StyleSheet, View } from 'react-native';
import React from 'react';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import useBookingComStep2Container from './BookingComStep2Container';
import { useTranslation } from 'react-i18next';

const BookingComStep2Screen = () => {
    const { t } = useTranslation();
    const { control, bookingRooms, listingOptions, handleNext, errors } = useBookingComStep2Container();

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.mainContainer}>
                <RefreshableScrollView style={styles.scrollContainer}>
                    <View style={styles.headerContainer}>
                        <AppText text={t('app.booking_com_step2.title_1')} type="Bold" fontSize={32} color={Colors.BLACK} />
                        <AppText text={t('app.booking_com_step2.title_2')} type="Bold" fontSize={32} color={Colors.BLACK} />
                    </View>

                    {bookingRooms.map((room) => (
                        <View key={room.id} style={styles.cardContainer}>
                            <View style={styles.infoRow}>
                                <AppText text={t('app.booking_com_step2.booking_id')} type="Regular" fontSize={14} color={Colors.BLACK} style={{flex: 1}}/>
                                <AppText text={room.id} type="Bold" fontSize={14} color={Colors.BLACK} style={{flex: 1}}/>
                                <View style={styles.logoBox}><Svgicons path='bookingCom'/></View>
                            </View>

                            <View style={styles.dropdownSection}>
                                <AppText text={t('app.booking_com_step2.existing_listing')} type="Regular" fontSize={14} color={Colors.BLACK} mb={8} />
                                <DropdownField
                                    name={`listing_${room.id}`}
                                    control={control}
                                    errors={errors}
                                    data={listingOptions}
                                    placeholder={t('app.booking_com_step2.none')}
                                    label=''
                                />
                            </View>
                        </View>
                    ))}
                </RefreshableScrollView>
                <View style={styles.footer}>
                    <AppButton title={t('app.booking_com_step2.next')} onPress={handleNext} />
                </View>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    scrollContainer: { flex: 1, paddingHorizontal: Metrics.baseMargin },
    headerContainer: { marginBottom: 30, marginTop: 50 },
    cardContainer: { backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.6)', marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    logoBox: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: '#B0BEC5', justifyContent: 'center', alignItems: 'center' },
    dropdownSection: { marginTop: 15 },
    footer: { paddingHorizontal: Metrics.baseMargin, paddingBottom: 40 }
});

export default BookingComStep2Screen;