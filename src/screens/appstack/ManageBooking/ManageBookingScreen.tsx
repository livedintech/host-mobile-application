import React, { useEffect, useMemo, useState } from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    FlatList,
} from 'react-native';

import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useManageBookingContainer from './ManageBookingContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import Metrics from '@/utility/Metrics';
import DropdownField from '@/components/molecules/Input/DropdownField';
import { useForm } from 'react-hook-form';

// ─── TYPES ─────────────────────────────────────────────────────────────

const TABS = ['Airbnb', 'Gathern', 'Booking.com'] as const;
type TabType = typeof TABS[number];

const TAB_ICON_MAP: Record<TabType, string> = {
    Airbnb: 'airbnb',
    Gathern: 'gathern',
    'Booking.com': 'bookingCom',
};

const normalizeType = (type: string) =>
    type === 'Bookings.com' ? 'Booking.com' : type;

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value, valueColor }: any) => (
    <View style={styles.cardRow}>
        <View style={styles.iconCircle}>
            <Svgicons path={icon} size={20} />
        </View>
        <View>
            <AppText text={label} type="Regular" color={Colors.BLACK} fontSize={14} />
            <AppText
                text={value}
                type="Medium"
                color={valueColor}
                fontSize={14}
                mt={2}
            />
        </View>
    </View>
);

const ConnectedAccountCard = ({ account, selectedTab, onExport,listingOptions }: any) => {
        const { control, formState: { errors }, setValue } = useForm();
      useEffect(() => {
        if (account?.listings?.[0]?.id) {
            setValue('listing_id', String(account.listings[0].listing_id));
        }
    }, [account]);
    return (
        <GlassCard width="100%" style={styles.connectedCard}>
            <View style={styles.cardHeader}>
                <AppText
                    text={selectedTab}
                    type="Bold"
                    color={Colors.BLACK}
                    fontSize={18}
                />
            </View>

            <InfoRow
                icon={TAB_ICON_MAP[selectedTab as TabType]}
                label={`${selectedTab} ID`}
                value={account?.id?.toString() ?? 'N/A'}
                valueColor={Colors.BLACK}
            />



            {selectedTab !== 'Booking.com' && (
                <View>
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
                </View>
            )}
            {selectedTab == 'Booking.com' && (
                <View>
                    <InfoRow
                        icon={TAB_ICON_MAP[selectedTab as TabType]}
                        label={'Property Name'}
                        value={account?.listings?.[0]?.title}
                        valueColor={Colors.BLACK}
                    />
                    <InfoRow
                        icon={TAB_ICON_MAP[selectedTab as TabType]}
                        label={'Total Property Count'}
                        value={'01'}
                        valueColor={Colors.BLACK}
                    />
                    <InfoRow
                        icon="database_check"
                        label="Connection Status"
                        value="Active"
                        valueColor={Colors.TEAL_PRIMARY_ALT}
                    />
                    {account?.listings?.[0]?.listing_relation && (
                        <DropdownField
                        name={'listing_id'}
                        control={control}
                        errors={errors}
                        label="Existing Listing:"
                        data={listingOptions}
                        placeholder="None"
                        disabled={true}
                    />
                    )} 
                    
                </View>
            )}
        </GlassCard>
    )
}

    ;

const EmptyState = ({ selectedTab }: { selectedTab: TabType }) => (
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

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

const ManageBookingScreen = () => {
    const {
        handleConnect,
        isLoading,
        isPending,
        refetch,
        goToListing,
        connectedAccounts,
        listingOptions,
    } = useManageBookingContainer();

    const [selectedTab, setSelectedTab] = useState<TabType>('Airbnb');
    const currentTabAccounts = useMemo(() => {
        return (
            connectedAccounts?.filter(
                (acc: any) =>
                    normalizeType(acc.connection_type) === selectedTab
            ) ?? []
        );
    }, [connectedAccounts, selectedTab]);

    const hasAccounts = currentTabAccounts.length > 0;

    return (
        <BGImage
            source={require('@/assets/img/background/linearBG.png')}
            style={styles.bgContainer}
        >
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <AppText
                        text="Channel Manager"
                        fontSize={28}
                        type="Bold"
                        color={Colors.BLACK}
                        mt={20}
                    />
                </View>

                {/* TABS */}
                <View style={styles.tabsContainer}>
                    {TABS.map((tab) => {
                        const isSelected = selectedTab === tab;

                        return (
                            <AppButton
                                key={tab}
                                title={tab}
                                onPress={() => setSelectedTab(tab)}
                                color={
                                    isSelected ? Colors.WHITE : Colors.DARK_CHARCOAL
                                }
                                style={[
                                    styles.tabBtn,
                                    isSelected && styles.activeTabBtn,
                                ]}
                                variant="secondary"
                                fontSize={12}
                                borderRadius={20}
                            />
                        );
                    })}
                </View>

                {/* CONTENT */}
                <RefreshableScrollView
                    isLoading={isLoading}
                    onRefresh={refetch}
                    contentContainerStyle={styles.scrollContent}
                >
                    {isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color={Colors.TEAL_PRIMARY_ALT}
                            style={styles.loader}
                        />
                    ) : hasAccounts ? (
                        <FlatList
                            data={currentTabAccounts}
                            keyExtractor={(item, index) =>
                                item?.id?.toString() || index.toString()
                            }
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View style={styles.cardSpacing}>
                                    <ConnectedAccountCard
                                        account={item}
                                        selectedTab={selectedTab}
                                        onExport={goToListing}
                                        listingOptions={listingOptions}
                                    />
                                </View>
                            )}
                        />
                    ) : (
                        <EmptyState selectedTab={selectedTab} />
                    )}
                </RefreshableScrollView>

                {/* FOOTER */}
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

export default ManageBookingScreen;

// ─── STYLES ─────────────────────────────────────────────────────────────

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
        paddingHorizontal: Metrics.baseMargin,
        marginBottom: Metrics.verticalScale(30),
        justifyContent: 'space-between',
        gap: Metrics.scale(10),
    },

    tabBtn: {
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.4)',
        width: Metrics.scale(125),
    },

    activeTabBtn: {
        backgroundColor: Colors.TEAL_PRIMARY_ALT,
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
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.9)',
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
        backgroundColor: 'rgba(255,255,255,0.2)',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -125 }, { translateY: -125 }],
        zIndex: -1,
    },

    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 10,
    },
});