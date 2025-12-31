import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const MoreScreen = () => {
    const goToBilling = useCallback(() => {
        navigate(NavigationRoutes.APP_STACK.BILLING)
    }, []);

    const MenuCard = ({ title, items, icon, onPress }: any) => (
        <GradientBorder borderRadius={20} style={styles.menuCardWrapper}>
            <Pressable style={styles.menuCardInner} onPress={onPress}>
                <View style={styles.rowBetween}>
                    <AppText text={title} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
                        <Pressable onPress={onPress} style={styles.arrowCircleInner}>
                            <Svgicons path='ArrowUpRightIcon' size={21} />
                        </Pressable>
                    </GradientBorder>
                </View>
                <Svgicons path={icon} style={styles.centerIcon} size={59} />
                <AppText text={items.join('\n')} fontSize={13} color="#666" lineHeight={20} />
            </Pressable>
        </GradientBorder>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <View style={styles.profileRow}>
                <View style={styles.avatarCircle} />
                <View style={{ marginLeft: 15 }}>
                    <AppText text="Tooba J" fontSize={18} type="Bold" />
                    <AppText text="(+966) 5XX XXX XXX" color="#999" />
                </View>
            </View>

            <View style={styles.grid}>
                <MenuCard title="Account" items={['Profile Settings', 'Manage Listings', 'User Management']} icon={'userIcon'} />
                <MenuCard title="Refer App" items={['Refer App', 'To Another', 'Host']} icon={'heartIcon'} />
                <MenuCard title="Billing" items={['Payment Method', 'Subscription', 'Transaction History']} icon={'cardIcon'} onPress={goToBilling} />
                <MenuCard title="General" items={['Privacy Policy', 'Terms & Conditions', 'FAQ']} icon={'starIcon'} />
            </View>

            <GradientBorder borderRadius={20} style={styles.logoutWrapper}>
                <Pressable style={styles.logoutBtn}>
                    <AppText text="Logout" fontSize={24} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <Svgicons path='ArrowUpRightIcon' />
                </Pressable>
            </GradientBorder>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#CCC' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

    menuCardWrapper: { width: '48%', marginBottom: 15 },
    menuCardInner: {
        padding: 15,
        borderRadius: 20,
        backgroundColor: Colors.WHITE
    },
    centerIcon: { width: 50, height: 50, alignSelf: 'center', marginVertical: 15 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    smallIcon: {
        borderRadius: 100,
        height: Metrics.scale(32),
        width: Metrics.scale(32),
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center'
    },

    logoutWrapper: { marginTop: 10 },
    logoutBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        backgroundColor: Colors.WHITE
    },
    arrowCircleInner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },

});

export default MoreScreen;
