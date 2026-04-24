import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useReservationDetailsContainer from './ReservationDetailsContainer';
import { useTranslation } from 'react-i18next';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack, navigate } from '@/services/navigationService';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const ReservationDetailsScreen = () => {
    const { t } = useTranslation();
    const { details } = useReservationDetailsContainer();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <GradientBorder
                    borderRadius={16}
                    borderWidth={1}
                    style={styles.arrowCircleInner}
                >
                    <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
                        <Svgicons path="arrowLeftIcon" size={26} />
                    </Pressable>
                </GradientBorder>
                <AppText
                    text="Abdulrahman Al Hassan"
                    fontSize={18}
                    type="Bold"
                    color={Colors.MIDNIGHT}
                />

                <Menu>
                    <MenuTrigger customStyles={{ triggerWrapper: styles.menuTrigger }}>
                        <Svgicons path="menu" size={28} color={Colors.CHARCOAL} />
                    </MenuTrigger>
                    <MenuOptions customStyles={{ optionsContainer: styles.popupMenu }}>
                        <MenuOption style={styles.menuItem}>
                            <AppText
                                text={t('app.reservation_details.view_calendar')}
                                fontSize={14}
                                color={Colors.CHARCOAL}
                            />
                            <Svgicons path="listingCalendar" size={24} />
                        </MenuOption>
                        <MenuOption style={styles.menuItem} onSelect={() => navigate(NavigationRoutes.APP_STACK.RESERVATION_DETAILS)}>
                            <AppText
                                text={t('app.reservation_details.reservation_details')}
                                fontSize={14}
                                color={Colors.CHARCOAL}
                            />
                            <Svgicons path="reservationDetail" size={24} />
                        </MenuOption>
                        <MenuOption style={styles.menuItem} onSelect={() => {
                            navigate(NavigationRoutes.APP_STACK.ASSIGN_CHAT)
                        }}>
                            <AppText
                                text={t('app.reservation_details.assign_chat')}
                                fontSize={14}
                                color={Colors.CHARCOAL}
                            />
                            <Svgicons path="expandIcon" size={24} />
                        </MenuOption>
                        <MenuOption style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                            <AppText
                                text={t('app.reservation_details.add_notes')}
                                fontSize={14}
                                color={Colors.CHARCOAL}
                            />
                            <Svgicons path="note" size={24} />
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View style={styles.titleWrapper}>
                    <AppText text={t('app.reservation_details.reservation_details')} fontSize={23} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <Svgicons path="File_Document" size={24} color={Colors.BRUNSWICK_GREEN} ml={8} />
                </View>

                {/* Property Name */}
                <View style={[styles.propertyRow,{marginBottom: Metrics.verticalScale(26)}]}>
                    <AppText text={t('app.reservation_details.property_name')} fontSize={18} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <AppText text={details.propertyName} fontSize={18} color={Colors.BRUNSWICK_GREEN} />
                </View>

                {/* Address Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <AppText text={t('app.reservation_details.address')} fontSize={17} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                        <Svgicons path="pinLocationIcon" size={17} color={Colors.BRUNSWICK_GREEN} ml={8} />
                    </View>
                    <AppText text={details.address} fontSize={14} color={Colors.BRUNSWICK_GREEN} mt={8} style={{ lineHeight: 24 }} />
                </View>

                {/* Unit Type */}
                <View style={[styles.propertyRow, { marginVertical: Metrics.verticalScale(15) }]}>
                    <AppText text={t('app.reservation_details.unit_type')} fontSize={18} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <AppText text={details.unitType} fontSize={18} color={Colors.BRUNSWICK_GREEN} />
                </View>

                {/* Guest Details Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <AppText text={t('app.reservation_details.guest_details')} fontSize={17} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                        <Svgicons path="homeIcon" size={18} color={Colors.BRUNSWICK_GREEN} ml={8} />
                    </View>

                    <View style={styles.detailsList}>
                        <DetailRow label={t('app.reservation_details.guest_email')} value={details.guestEmail} />
                        <DetailRow label={t('app.reservation_details.guest_phone')} value={details.guestPhone} />
                        <DetailRow label={t('app.reservation_details.booking_platform')} value={details.bookingPlatform} />

                        <View style={styles.spacer} />

                        <DetailRow label={t('app.reservation_details.num_guests')} value={details.numberOfGuests} />
                        <DetailRow label={t('app.reservation_details.num_nights')} value={details.numberOfNights} />

                        <View style={styles.spacer} />

                        <DetailRow label={t('app.reservation_details.checkin_time')} value={details.checkInTime} />
                        <DetailRow label={t('app.reservation_details.checkout_time')} value={details.checkOutTime} />
                        <DetailRow label={t('app.reservation_details.booking_dates')} value={details.bookingDates} />

                        <View style={styles.spacer} />

                        <View style={styles.row}>
                            <AppText text={t('app.reservation_details.payment_status')} fontSize={14} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                            <AppText
                                text={details.paymentStatus}
                                fontSize={14}
                                color={details.paymentStatus === 'Paid' ? Colors.PERSIAN_GREEN : Colors.INDIAN_RED}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

// Internal Helper Component
const DetailRow = ({ label, value }: { label: string, value: string | number }) => (
    <View style={styles.row}>
        <AppText text={`${label}: `} fontSize={14} type="Bold" color={Colors.BRUNSWICK_GREEN} />
        <AppText text={value.toString()} fontSize={14} color={Colors.BRUNSWICK_GREEN} />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Metrics.scale(20),
        paddingVertical: Metrics.verticalScale(15),
    },
    backBtn: { padding: 8, borderWidth: 1, borderColor: Colors.SMOOTH_GREY, borderRadius: 100 },
    scrollContainer: { paddingHorizontal: Metrics.scale(25), paddingBottom: Metrics.verticalScale(30) },
    titleWrapper: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginVertical: Metrics.verticalScale(20) },
    propertyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
    card: {
        borderWidth: 1,
        borderColor: Colors.SMOOTH_GREY,
        borderRadius: 20,
        padding: Metrics.scale(20),
        marginVertical: Metrics.verticalScale(10),
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Metrics.verticalScale(10) },
    detailsList: { marginTop: Metrics.verticalScale(10) },
    row: { flexDirection: 'row', marginBottom: Metrics.verticalScale(8), flexWrap: 'wrap' },
    spacer: { height: Metrics.verticalScale(15) },
     arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  menuTrigger: {
    padding: 8,
  },
  popupMenu: {
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    padding: 5,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default ReservationDetailsScreen;