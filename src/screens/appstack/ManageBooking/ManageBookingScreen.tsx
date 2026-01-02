import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useManageBookingContainer from './ManageBookingContainer';
import Metrics from '@/utility/Metrics';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import AppButton from '@/components/molecules/AppButton/AppButton';

const ManageBookingScreen = () => {
    const { handleConnect } = useManageBookingContainer();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Empty State Illustration Text */}
                <View style={styles.illustrationSection}>
                    <AppText
                        text="No Account Found"
                        fontSize={32}
                        type="Bold"
                        color={Colors.BRUNSWICK_GREEN}
                        textAlign="center"
                    />
                </View>

                {/* Info Message Card */}
                <GradientBorder borderRadius={35} style={styles.infoCardWrapper}>
                    <View style={styles.infoCardInner}>
                        <View style={styles.row}>
                            <View style={styles.activeDot} />
                            <View style={styles.avatarContainer}>
                                <Image source={require('@/assets/img/img1.png')} style={styles.avatar} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 15 }}>
                                <View style={styles.rowBetween}>
                                    <AppText text="A.LI - Livedin" type="Bold" color={Colors.BRUNSWICK_GREEN} />
                                    <AppText text="9:36 AM" color="#999" fontSize={12} />
                                </View>
                                <AppText text={'Connect your Airbnb, Gathern, or other booking platforms to manage all your listings in one place.'} color={Colors.NIGHT_OPACITY} mt={5} lineHeight={20} />
                            </View>
                        </View>
                    </View>
                </GradientBorder>

                {/* Action Buttons */}
                <AppButton onPress={() => handleConnect('Airbnb')} title='Connect Airbnb' mb={8} />
                <AppButton onPress={() => handleConnect('Gathern')} title='Connect Gathern' />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },
    illustrationSection: { marginTop: 100, marginBottom: 50 },
    infoCard: {
        padding: 20,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        backgroundColor: Colors.WHITE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3
    },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
    avatarContainer: { position: 'relative', backgroundColor: Colors.ADRIANA, borderRadius: 100, width: Metrics.scale(72), height: Metrics.scale(72), justifyContent: 'center', alignItems: 'center' },
    avatar: { width: Metrics.scale(46), height: Metrics.verticalScale(54) },
    onlineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.BRUNSWICK_GREEN, position: 'absolute', left: -5, top: '50%', borderWidth: 2, borderColor: Colors.WHITE },
    headerText: { flex: 1, marginLeft: 15 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    timeRow: { flexDirection: 'row', alignItems: 'center' },
    btnContainer: { marginTop: 40 },
    outlineBtn: {
        height: 58,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    activeDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.BRUNSWICK_GREEN,
        marginRight: 8
    },
    infoCardInner: {
        padding: 20,
        borderRadius: 35,
        backgroundColor: Colors.WHITE,
    },
    infoCardWrapper: {
        marginBottom: Metrics.verticalScale(33)
    }
});

export default ManageBookingScreen;