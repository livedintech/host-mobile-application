import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator, FlatList } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useManageBookingContainer from './ManageBookingContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import Metrics from '@/utility/Metrics';

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS = ['Airbnb', 'Gathern', 'Bookings.com'] as const;
type TabType = (typeof TABS)[number];

const TAB_ICON_MAP: Record<TabType, string> = {
    Airbnb: 'airbnb',
    Gathern: 'gathern',
    'Bookings.com': 'bookingCom',
};


// ─── Sub-components ──────────────────────────────────────────────────────────

interface ConnectedAccountCardProps {
    account: any;
    selectedTab: TabType;
    userName: string;
    onExport: (account: any) => void;
}

const ConnectedAccountCard: React.FC<ConnectedAccountCardProps> = ({
    account,
    selectedTab,
    userName,
    onExport,
}) => (
    <GlassCard width="100%" style={styles.connectedCard}>
        <View style={styles.cardHeader}>
            <AppText
                text={`${userName}'s ${selectedTab}`}
                type="Bold"
                color={Colors.BLACK}
                fontSize={18}
            />
        </View>

        <InfoRow
            icon={TAB_ICON_MAP[selectedTab]}
            label={`${selectedTab} ID`}
            value={account?.id?.toString() ?? 'N/A'}
            valueColor={Colors.BLACK}
        />
        <InfoRow
            icon="database_check"
            label="Connection Status"
            value="Active"
            valueColor={Colors.TEAL_PRIMARY_ALT}
        />

        <View style={styles.exportBtnContainer}>
            <AppButton
                title="Exports"
                onPress={() => onExport(account)}
                borderColor="rgba(255, 255, 255, 0.9)"
                fontSize={14}
                style={styles.exportBtn}
                variant="secondary"
            />
        </View>
    </GlassCard>
);

interface InfoRowProps {
    icon: string;
    label: string;
    value: string;
    valueColor: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, valueColor }) => (
    <View style={styles.cardRow}>
        <View style={styles.iconCircle}>
            <Svgicons path={icon} size={20} />
        </View>
        <View>
            <AppText text={label} type="Regular" color={Colors.BLACK} fontSize={14} />
            <AppText text={value} type="Medium" color={valueColor} fontSize={14} mt={2} />
        </View>
    </View>
);

interface EmptyStateProps {
    selectedTab: TabType;
}

const EmptyState: React.FC<EmptyStateProps> = ({ selectedTab }) => (
    <View style={styles.emptyStateContainer}>
        <View style={styles.circleBg} />
        <AppText
            text={`This property isn't\nlisted on ${selectedTab}.`}
            fontSize={24}
            type="Bold"
            color={Colors.BLACK}
            textAlign="center"
            lineHeight={32}
        />
        <AppText
            text={`Only properties connected and\nactive on ${selectedTab} will appear here.`}
            fontSize={14}
            color={Colors.DARK_CHARCOAL_OPACITY}
            textAlign="center"
            mt={15}
            lineHeight={22}
        />
    </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

const ManageBookingScreen = () => {
    const {
        user,
        handleConnect,
        isLoading,
        isPending,
        refetch,
        goToListing,
        connectedAccounts,
    } = useManageBookingContainer();

    const [selectedTab, setSelectedTab] = useState<TabType>('Airbnb');

    // All accounts matching the currently selected tab (supports multiple)
    const currentTabAccounts: any[] = connectedAccounts?.filter(
        (acc: any) => acc.connection_type === selectedTab
    ) ?? [];

    const hasAccounts = currentTabAccounts.length > 0;

    return (
        <BGImage
            source={require('@/assets/img/background/linearBG.png')}
            style={styles.bgContainer}
        >
            <View style={styles.container}>

                {/* ── Header ── */}
                <View style={styles.header}>
                    <AppText
                        text="Channel Manager"
                        fontSize={28}
                        type="Bold"
                        color={Colors.BLACK}
                        mt={20}
                    />
                </View>

                {/* ── Tabs ── */}
                <View style={styles.tabsContainer}>
                    {TABS.map((tab) => {
                        const isSelected = selectedTab === tab;
                        return (
                            <AppButton borderRadius={20} key={tab} title={tab} onPress={() => setSelectedTab(tab)} color={isSelected ? Colors.WHITE : Colors.DARK_CHARCOAL} style={[styles.tabBtn, isSelected && styles.activeTabBtn]} variant='secondary' fontSize={12}/>
                        );
                    })}
                </View>

                {/* ── Content ── */}
                <RefreshableScrollView
                    isLoading={isLoading}
                    onRefresh={refetch}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color={Colors.TEAL_PRIMARY_ALT}
                            style={styles.loader}
                        />
                    ) : hasAccounts ? (
                        currentTabAccounts.map((account, index) => (
                            <View
                                key={account?.id ?? index}
                                style={index > 0 && styles.cardSpacing}
                            >
                                <ConnectedAccountCard
                                    account={account}
                                    selectedTab={selectedTab}
                                    userName={user?.name ?? 'User'}
                                    onExport={goToListing}
                                />
                            </View>
                        ))
                    ) : (
                        <EmptyState selectedTab={selectedTab} />
                    )}
                </RefreshableScrollView>

                {/* ── Footer: always fixed at bottom, title changes based on state ── */}
                <View style={styles.footer}>
                    <AppButton
                        title={
                            hasAccounts
                                ? `+ Add Another ${selectedTab} Account`
                                : `Connect ${selectedTab} Account`
                        }
                        onPress={() => handleConnect(selectedTab)}
                        loading={isPending}
                        backgroundColor={Colors.TEAL_PRIMARY_ALT}
                        borderColor="transparent"
                        color={Colors.WHITE}
                        fontSize={16}
                    />
                </View>

            </View>
        </BGImage>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    bgContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 25,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal:  Metrics.baseMargin,
        marginBottom: Metrics.verticalScale(30),
        gap: Metrics.scale(10),
        justifyContent:'space-between'
    },
    tabBtn: {
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: Metrics.scale(125)
    },
    activeTabBtn: {
        backgroundColor: Colors.TEAL_PRIMARY_ALT,
        borderColor: Colors.TEAL_PRIMARY_ALT,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        flexGrow: 1,
    },
    loader: {
        marginTop: 50,
    },
    connectedCard: {
        padding: 24,
        borderRadius: 24,
    },
    cardHeader: {
        marginBottom: 25,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.9)',
    },
    exportBtnContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
    },
    exportBtn: {
        paddingHorizontal: 30,
        height: 38,
        minWidth: 120,
        paddingVertical: 0,
    },
    cardSpacing: {
        marginTop: 16,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
        position: 'relative',
    },
    circleBg: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -125 }, { translateY: -125 }],
        zIndex: -1,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 10,
        backgroundColor: 'transparent',
    },
});

export default ManageBookingScreen;