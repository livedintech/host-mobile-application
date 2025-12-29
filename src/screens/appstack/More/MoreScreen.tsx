import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const MoreScreen = () => {
    const MenuCard = ({ title, items, icon }: any) => (
        <ButtonView style={styles.menuCard}>
            <View style={styles.rowBetween}>
                <AppText text={title} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                <View style={styles.smallIcon}>
                    <Svgicons path='ArrowUpRightIcon' size={21} />
                </View>
            </View>
            <Svgicons path={icon} style={styles.centerIcon} size={59} />
            <AppText text={items.join('\n')} fontSize={13} color="#666" lineHeight={20} />
        </ButtonView>
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
                <MenuCard title="Billing" items={['Payment Method', 'Subscription', 'Transaction History']} icon={'cardIcon'} />
                <MenuCard title="General" items={['Privacy Policy', 'Terms & Conditions', 'FAQ']} icon={'starIcon'} />
            </View>

            <ButtonView style={styles.logoutBtn}>
                <AppText text="Logout" fontSize={24} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                {/* <Image source={require('@/assets/img/arrow_up_right.png')} style={styles.smallIcon} /> */}
                <Svgicons path='ArrowUpRightIcon' />
            </ButtonView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#CCC' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    menuCard: { width: '48%', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 15 },
    centerIcon: { width: 50, height: 50, alignSelf: 'center', marginVertical: 15 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
    smallIcon: { borderRadius: 100, height: Metrics.scale(32), width: Metrics.scale(32), borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
    logoutBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', marginTop: 10 }
});
export default MoreScreen;