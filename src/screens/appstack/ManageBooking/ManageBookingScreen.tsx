import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import AccountDeleteModal from '@/components/molecules/AccountDeleteModal/AccoutDeleteModal';
import useManageBookingContainer from './ManageBookingContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import Metrics from '@/utility/Metrics';
import DropdownField from '@/components/molecules/Input/DropdownField';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/useAuthStore';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ManageBookingSkeleton from '@/components/Skeletons/ManageBookingSkeleton';

const TABS = ['Airbnb', 'Gathern', 'Booking.com'] as const;
type TabType = typeof TABS[number];

const TAB_ICON_MAP: Record<TabType, string> = {
  Airbnb: 'airbnb',
  Gathern: 'gathern',
  'Booking.com': 'bookingCom',
};

const normalizeType = (type: string) =>
  type === 'Bookings.com' ? 'Booking.com' : type;

const InfoRow = ({ icon, label, value, valueColor, valueStyle }: any) => (
  <View style={styles.cardRow}>
    <View style={styles.iconCircle}>
      <Svgicons path={icon} size={20} />
    </View>
    <View style={{ flex: 1 }}>
      <AppText text={label} type="Regular" color={Colors.BLACK} fontSize={14} />
      <AppText text={value} type="Medium" color={valueColor} fontSize={14} mt={2} style={valueStyle} />
    </View>
  </View>
);

const ConnectedAccountCard = ({ user, account, selectedTab, onExport, listingOptions, t, onDeactivate }: any) => {
  const { control, formState: { errors }, setValue } = useForm();
  useEffect(() => {
    const airbnbId = account?.listings?.[0]?.listing_relation?.listing_id_airbnb;
    if (airbnbId) {
      setValue('listing_id', String(airbnbId));
    }
  }, [account]);


  const formatStatus = (status?: string) => {
    if (!status || status === 'unknown') return 'Disconnect';

    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <GlassCard width="100%" style={styles.connectedCard} onPress={() => onExport(account)}>
      <View style={styles.cardHeader}>
        <AppText text={selectedTab} type="Bold" color={Colors.BLACK} fontSize={18} />
        {account?.channel_status === 'active' && (
          <TouchableOpacity onPress={() => onDeactivate(account?.id)} style={styles.trashBtn}>
            <Svgicons path="trashIcon" size={22} />
          </TouchableOpacity>
        )}
      </View>
      <InfoRow
        icon={TAB_ICON_MAP[selectedTab as TabType]}
        label={`${selectedTab} ID`}
        value={account?.id?.toString() ?? 'N/A'}
        valueColor={Colors.BLACK}
      />
      <InfoRow
        icon="businessCard"
        label={t('app.manage_booking.livedin_name')}
        value={account?.channel_name || user?.name}
        valueColor={Colors.BLACK}
      />
      {selectedTab !== 'Booking.com' && (
        <View>
          <InfoRow
            icon="towerBuilding"
            label={t('app.manage_booking.total_property')}
            value={account?.properties_sync_all_count}
            valueColor={Colors.BLACK}
          />
          <InfoRow
            icon="database_check"
            label={t('app.manage_booking.connection_status')}
            value={formatStatus(account?.channel_status)}
            valueColor={account?.channel_status === 'unknown' ? Colors.ALERT_RED : Colors.TEAL_PRIMARY_ALT}
          />
        </View>
      )}

      {selectedTab === 'Booking.com' && (
        <View>
          {/* <InfoRow
            icon="towerBuilding"
            label={t('app.manage_booking.total_property')}
            value={'1'}
            valueColor={Colors.BLACK}
          /> */}
          <InfoRow
            icon={TAB_ICON_MAP[selectedTab as TabType]}
            label={t('app.manage_booking.property_name')}
            value={account?.listings?.[0]?.title || account?.channel_name}
            valueColor={Colors.BLACK}
            valueStyle={{ textTransform: 'capitalize' }}
          />
          <InfoRow
            icon="database_check"
            label={t('app.manage_booking.connection_status')}
            value={formatStatus(account?.channel_status)}
            // value={account?.channel_status === 'unknown' ? 'Disconnect' :  account?.channel_status}
            valueColor={account?.channel_status === 'unknown' ? Colors.ALERT_RED : Colors.TEAL_PRIMARY_ALT}
          />
          {account?.listings?.[0]?.listing_relation && (
            <DropdownField
              name="listing_id"
              control={control}
              errors={errors}
              label={t('app.manage_booking.existing_listing')}
              data={listingOptions}
              placeholder={t('app.manage_booking.none_placeholder')}
              disabled={true}
            />
          )}
        </View>
      )}
    </GlassCard>
  );
};

const ManageBookingScreen = ({ route }: any) => {
  const {
    handleConnect,
    isLoading,
    refetch,
    goToListing,
    connectedAccounts,
    listingOptions,
    deactivateChannel,
    isDeactivating,
  } = useManageBookingContainer();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const initialTab = (TABS as readonly string[]).includes(route?.params?.initialTab)
    ? (route.params.initialTab as TabType)
    : 'Airbnb';
  const [selectedTab, setSelectedTab] = useState<TabType>(initialTab);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [pendingChannelId, setPendingChannelId] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!isDeactivating && isConfirmed) {
      setDeactivateModalVisible(false);
      setPendingChannelId(null);
      setIsConfirmed(false);
    }
  }, [isDeactivating, isConfirmed]);
  const totalAccounts = connectedAccounts?.length ?? 0;

  const currentTabAccounts = useMemo(() => {
    return connectedAccounts?.filter(
      (acc: any) => normalizeType(acc.connection_type) === selectedTab
    ) ?? [];
  }, [connectedAccounts, selectedTab]);

  const hasAccounts = currentTabAccounts.length > 0;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  // ✅ Koi account nahi — No Account Found screen
  if (!isLoading && totalAccounts === 0) {
    return (
      <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AppText
              text={t('app.manage_booking.page_title')}
              fontSize={28}
              type="Bold"
              color={Colors.BLACK}
              mt={20}
            />
          </View>

          <View style={styles.noAccountContainer}>
            <Svgicons path="noAccountFound" size={Metrics.scale(320)} />
            <AppText
              text={t('app.manage_booking.no_account_title')}
              fontSize={28}
              type="SemiBold"
              color={Colors.BLACK}
              textAlign="center"
              mt={15}
            />
            <AppText
              text={t('app.manage_booking.no_account_desc')}
              fontSize={12}
              type="Regular"
              color={Colors.DIM_GREY}
              textAlign="center"
              mt={8}
              px={60}
            />
          </View>

          <View style={styles.footer}>
            <AppButton
              title={t('app.manage_booking.connect_accounts')}
              onPress={() => navigate(NavigationRoutes.APP_STACK.CONNECT_OTA_PLATFORMS)}
              backgroundColor={Colors.TEAL_PRIMARY_ALT}
              borderColor="transparent"
              // color={Colors.WHITE}
              fontSize={16}
            />
          </View>
        </View>
      </BGImage>
    );
  }

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <AppText
            text={t('app.manage_booking.page_title')}
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
                color={isSelected ? Colors.WHITE : Colors.DARK_CHARCOAL}
                style={[styles.tabBtn, isSelected && styles.activeTabBtn]}
                variant="secondary"
                fontSize={12}
                borderRadius={16}
              />
            );
          })}
        </View>

        {/* CONTENT */}
        <RefreshableScrollView
          isLoading={isLoading}
          skeletonComponent={<ManageBookingSkeleton />}
          onRefresh={refetch}
          contentContainerStyle={styles.scrollContent}
        >
          {hasAccounts ? (
            <FlatList
              data={currentTabAccounts}
              keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.cardSpacing}>
                  <ConnectedAccountCard
                    account={item}
                    selectedTab={selectedTab}
                    onExport={goToListing}
                    listingOptions={listingOptions}
                    user={user}
                    t={t}
                    onDeactivate={(channelId: number) => {
                      setPendingChannelId(channelId);
                      setDeactivateModalVisible(true);
                    }}
                  />
                </View>
              )}
            />
          ) : (
            // ✅ Yeh tab k liye account nahi
            <View style={styles.tabEmptyContainer}>
              <Svgicons path="noAccountFound" size={Metrics.scale(320)} />
              <AppText
                text={selectedTab === 'Gathern' ? t('app.shared.coming_soon') : t('app.manage_booking.no_account_title')}
                fontSize={28}
                type="SemiBold"
                color={Colors.BLACK}
                textAlign="center"
                mt={15}
              />
              <AppText
                text={t('app.manage_booking.no_account_desc')}
                fontSize={12}
                type="Regular"
                color={Colors.DIM_GREY}
                textAlign="center"
                mt={8}
                px={60}
              />
            </View>
          )}
        </RefreshableScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <AppButton
            title={hasAccounts ? t('app.manage_booking.add_account', { tab: selectedTab }) : t('app.manage_booking.connect_account', { tab: selectedTab })}
            onPress={() => handleConnect(selectedTab)}
            loading={false}
            disabled={selectedTab === 'Gathern'}
            backgroundColor={selectedTab === 'Gathern' ? Colors.DIM_GREY : Colors.TEAL_PRIMARY_ALT}
            borderColor="transparent"
            // color={Colors.WHITE}
            fontSize={16}
          />
        </View>
      </View>
      <AccountDeleteModal
        isVisible={deactivateModalVisible}
        onClose={() => {
          if (!isDeactivating) {
            setDeactivateModalVisible(false);
            setPendingChannelId(null);
          }
        }}
        onConfirm={() => {
          if (pendingChannelId !== null) {
            deactivateChannel(pendingChannelId);
            setIsConfirmed(true);
          }
        }}
        isLoading={isDeactivating}
        title={t('app.manage_booking.deactivate_title')}
        description={t('app.manage_booking.deactivate_desc')}
      />
    </BGImage>
  );
};

export default ManageBookingScreen;

const styles = StyleSheet.create({
  bgContainer: { flex: 1 },
  container: { flex: 1 },
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
  activeTabBtn: { backgroundColor: Colors.TEAL_PRIMARY_ALT },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  connectedCard: { padding: 24, borderRadius: 24 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  trashBtn: {
    padding: 6,
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
  cardSpacing: { marginTop: 16 },
  noAccountContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tabEmptyContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 60,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
});