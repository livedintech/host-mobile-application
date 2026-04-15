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

const BookingComStep2Screen = () => {
    const { control, bookingRooms, listingOptions, handleNext, errors } = useBookingComStep2Container();

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.mainContainer}>
                <RefreshableScrollView style={styles.scrollContainer}>
                    <View style={styles.headerContainer}>
                        <AppText text="Booking.com" type="Bold" fontSize={32} color={Colors.BLACK} />
                        <AppText text="Listings" type="Bold" fontSize={32} color={Colors.BLACK} />
                    </View>

                    {bookingRooms.map((room) => (
                        <View key={room.id} style={styles.cardContainer}>
                            <View style={styles.infoRow}>
                                <AppText text="Booking.com ID:" type="Regular" fontSize={14} color={Colors.BLACK} style={{flex: 1}}/>
                                <AppText text={room.id} type="Bold" fontSize={14} color={Colors.BLACK} style={{flex: 1}}/>
                                <View style={styles.logoBox}><Svgicons path='bookingCom'/></View>
                            </View>

                            <View style={styles.dropdownSection}>
                                <AppText text="Existing Listing:" type="Regular" fontSize={14} color={Colors.BLACK} mb={8} />
                                <DropdownField
                                    name={`listing_${room.id}`}
                                    control={control}
                                    errors={errors}
                                    data={listingOptions}
                                    placeholder="None"
                                    label=''
                                />
                            </View>
                        </View>
                    ))}
                </RefreshableScrollView>
                <View style={styles.footer}>
                    <AppButton title="Next" onPress={handleNext} />
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