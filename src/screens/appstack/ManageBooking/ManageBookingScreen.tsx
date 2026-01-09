import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useManageBookingContainer from './ManageBookingContainer';
import Metrics from '@/utility/Metrics';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import AppButton from '@/components/molecules/AppButton/AppButton';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ManageBookingSkeleton from '@/components/Skeletons/ManageBookingSkeleton';
import useAirbnbCallback from '@/hooks/useAirbnbCallback';

const ManageBookingScreen = () => {
      useAirbnbCallback();
    const {
        handleConnect,
        isPending,
        isLoading,
        refetch,
        response,
        goToListing,
        isOtaConnected
    } = useManageBookingContainer();

    const PlatformCard = ({ type, id, name, count, status, onPress }: any) => {
        const pfType = type ? type : 'Airbnb'
        return (
            <View>
                <AppText text={`${pfType} Account`} mb={13} color={Colors.BRUNSWICK_GREEN} fontSize={18}/>
                <GradientBorder borderRadius={24} style={styles.cardWrapper}>
                <View style={styles.cardInner}>
                    <View style={styles.rowContent}>
                        <AppText text={`${pfType} ID: `} type="Bold" color={Colors.BRUNSWICK_GREEN} fontSize={16} />
                        <AppText text={id} color={Colors.PINE_FOREST} type="Medium" />
                    </View>

                    <View style={styles.rowContent}>
                        <AppText text="Livedin Name: " type="Bold" color={Colors.BRUNSWICK_GREEN} />
                        <AppText text={name} color={Colors.PINE_FOREST} type="Medium" />
                    </View>

                    <View style={styles.rowContent}>
                        <AppText text="Total Property Count: " type="Bold" color={Colors.BRUNSWICK_GREEN} />
                        <AppText text={count} color={Colors.PINE_FOREST} type="Medium" />
                    </View>

                    <View style={styles.statusRow}>
                        <AppText text="Connection Status: " type="Bold" color={Colors.BRUNSWICK_GREEN} />
                        <AppText
                            text={status}
                            color={status === 'Active' ? Colors.MEDIUM_SEA_GREEN : Colors.INDIAN_RED}
                        />

                        {/* Arrow Button */}
                        <GradientBorder borderRadius={16} style={styles.arrowWrapper}>
                            <Pressable style={styles.arrowInner} onPress={onPress}>
                                <Svgicons path="arrowRightIcon" size={12} color={Colors.SUPER_GREY} />
                            </Pressable>
                        </GradientBorder>
                    </View>
                </View>
            </GradientBorder>
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <RefreshableScrollView
                isLoading={isLoading}
                onRefresh={refetch}
                style={styles.scrollContent}
                skeletonComponent={<ManageBookingSkeleton />}
            >
                {/* Header Title Switch */}
                <View style={styles.headerSection}>
                    <AppText
                        text={isOtaConnected ? 'Connected Booking Platform' : 'No Account Found'}
                        fontSize={32}
                        type="Bold"
                        color={Colors.BRUNSWICK_GREEN}
                        textAlign="left"
                    />
                </View>

                {isOtaConnected ? (
                    /* UI When Data Exists */
                    <View style={styles.listContainer}>
                        {response?.data?.map((acc: any) => (
                            <PlatformCard
                                key={acc?.id}
                                type={acc?.connection_type}
                                id={acc?.id}
                                name="Dummy"
                                count="0"
                                status="Active"
                                onPress={() => goToListing(acc)}
                            />
                        ))}
                    </View>
                ) : (
                    /* UI When No Data */
                    <GradientBorder borderRadius={35} style={styles.infoCardWrapper}>
                        <View style={styles.infoCardInner}>
                            <View style={styles.row}>
                                <View style={styles.activeDot} />
                                <View style={styles.avatarContainer}>
                                    <Image source={require('@/assets/img/img1.png')} style={styles.avatar} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 15 }}>
                                    <AppText text="A.LI - Livedin" type="Bold" color={Colors.BRUNSWICK_GREEN} />
                                    <AppText
                                        text="Connect your Airbnb, Gathern, or other booking platforms to manage all your listings in one place."
                                        color={Colors.NIGHT_OPACITY}
                                        mt={5}
                                        lineHeight={20}
                                    />
                                </View>
                            </View>
                        </View>
                    </GradientBorder>
                )}

                {/* Bottom Connect Buttons */}
                <View style={styles.btnFooter}>
                    <AppButton
                        title="Connect Airbnb"
                        onPress={() => handleConnect('Airbnb')}
                        disabled={isPending}
                        mb={15}
                    />
                    <AppButton
                        title="Connect Gathern"
                        onPress={() => handleConnect('Gathern')}
                        disabled={isPending}
                    />
                </View>
            </RefreshableScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },
    headerSection: { marginTop: 50, marginBottom: 40 },
    listContainer: { marginBottom: 20 },
    connectedCard: {
        borderWidth: 1,
        borderColor: '#EBEBEB',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        backgroundColor: Colors.WHITE,
    },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Metrics.verticalScale(8),
        gap: 5
    },
    deleteBtn: { padding: 5 },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    btnFooter: { marginTop: 10 },
    infoCardWrapper: { marginBottom: 33 },
    infoCardInner: { padding: 25, borderRadius: 35, backgroundColor: Colors.WHITE },
    avatarContainer: { backgroundColor: Colors.ADRIANA, borderRadius: 100, width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
    avatar: { width: 46, height: 54 },
    row: { flexDirection: 'row', alignItems: 'center', },
    activeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.BRUNSWICK_GREEN, marginRight: 8 },
    cardWrapper: {
        marginBottom: 20,
    },

    cardInner: {
        padding: 20,
        borderRadius: 24,
        backgroundColor: Colors.WHITE,
    },
    arrowWrapper: {
        marginLeft: 'auto',
        width: 32,
        height: 32,
    },

    arrowInner: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },


});

export default ManageBookingScreen;