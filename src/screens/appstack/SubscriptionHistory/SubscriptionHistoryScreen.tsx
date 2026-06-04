import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import BGImage from '@/components/molecules/BGImage/BGImage';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useSubscriptionHistoryContainer from './SubscriptionHistoryContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Metrics from '@/utility/Metrics';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { ManageListingItem } from '@/types/api/createListingTypes';

const SubscriptionHistoryScreen = () => {
  const {
    listings,
    removeSheetRef,
    closeSheet,
    openSheet,
    isLoading,
    isLoadingGetSubscrptionUserPlan,
    getSubscrptionUserPlan,
    isCheckingEligibility,
  } = useSubscriptionHistoryContainer();
  const { t } = useTranslation();

  const pricePerListing =
    parseFloat(getSubscrptionUserPlan?.data?.subscription?.price ?? '0') || 0;
  const listingCount = listings?.length ?? 0;
  const totalAmount = listingCount * pricePerListing;

  const hasSubscription = getSubscrptionUserPlan?.success === true;
  const subscriptionPrice = hasSubscription
    ? getSubscrptionUserPlan?.data?.subscription?.price ?? '—'
    : '—';
  const subscriptionCurrency = hasSubscription
    ? getSubscrptionUserPlan?.data?.subscription?.currency ?? 'SAR'
    : 'SAR';
  const nextRenewal = hasSubscription
    ? getSubscrptionUserPlan?.data?.next_renewal_at
    : null;
  const isActive = hasSubscription && getSubscrptionUserPlan?.data?.status === 'active';
  const isTrial = hasSubscription && getSubscrptionUserPlan?.data?.status === 'trial';

  const channelFeatures = [
    t('auth.payment.starter_features.channel_sync.airbnb'),
    t('auth.payment.starter_features.channel_sync.booking'),
    t('auth.payment.starter_features.channel_sync.gathern'),
    t('auth.payment.starter_features.channel_sync.create_export'),
    t('auth.payment.starter_features.channel_sync.reservation_details'),
  ];

  const aiFeatures = [
    t('auth.payment.starter_features.ai_limited.ai_reply'),
    t('auth.payment.starter_features.ai_limited.ai_pricing'),
  ];

  const getListingAddress = (item: ManageListingItem): string =>
    [item.street, item.city?.name].filter(Boolean).join(', ');

  const renderPropertyRow = (item: ManageListingItem, index: number) => {
    const address = getListingAddress(item);
    const isLast = index === listingCount - 1;

    return (
      <View
        key={`${index}-${item.id}`}
        style={[styles.propertyRow, !isLast && styles.propertyDivider]}
      >
        <GlassCard width={THUMB_SIZE} style={styles.propertyThumb}>
          <Svgicons path="direct" size={26} />
        </GlassCard>
        <View style={styles.propertyInfo}>
          <AppText
            text={item.name || item.title || 'Untitled'}
            fontSize={14}
            type="Medium"
            color={Colors.BRUNSWICK_GREEN}
            numberOfLines={1}
          />
          {address ? (
            <AppText
              text={address}
              fontSize={12}
              type="Bold"
              color={Colors.BRUNSWICK_GREEN}
              mt={2}
              numberOfLines={1}
            />
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Title */}
        <AppText
          text={t('app.subscription.title')}
          fontSize={28}
          type="Bold"
          color={Colors.BRUNSWICK_GREEN}
          mb={20}
        />

        {/* Monthly Price Card */}
        <GlassCard width="100%" style={styles.card}>
          {isLoadingGetSubscrptionUserPlan ? (
            <ActivityIndicator color={Colors.MEDIUM_JUNGLE_GREEN} />
          ) : hasSubscription ? (
            <>
              <AppText
                text={t('app.subscription.monthly')}
                fontSize={14}
                type="Medium"
                color={Colors.BRUNSWICK_GREEN}
              />
              <View style={styles.priceRow}>
                <AppText
                  text={`${subscriptionCurrency} ${subscriptionPrice}`}
                  fontSize={30}
                  type="Bold"
                  color={Colors.BRUNSWICK_GREEN}
                />
                <AppText
                  text={t('app.subscription.per_listing')}
                  fontSize={14}
                  color={Colors.GREY_SHADOW}
                  ml={5}
                />
              </View>
            </>
          ) : (
            <AppText
              text={t('app.subscription.no_subscription')}
              fontSize={14}
              color={Colors.GREY_SHADOW}
              textAlign="center"
            />
          )}
        </GlassCard>

        {/* Your Properties Card */}
        <GlassCard width="100%" style={styles.card}>
          <AppText
            text={t('app.subscription.your_properties')}
            fontSize={17}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
            mb={12}
          />
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={Colors.MEDIUM_JUNGLE_GREEN} />
            </View>
          ) : listingCount === 0 ? (
            <View style={styles.emptyRow}>
              <Svgicons path="listingIcon" size={36} />
              <AppText
                text={t('app.subscription.no_listings')}
                fontSize={14}
                color={Colors.GREY_SHADOW}
                ml={10}
              />
            </View>
          ) : (
            listings.map((item, index) => renderPropertyRow(item, index))
          )}
        </GlassCard>

        {/* Your Plan Includes Card */}
        {hasSubscription && (
          <GlassCard width="100%" style={styles.card}>
            <View style={styles.planHeader}>
              <AppText
                text={t('app.subscription.plan_includes')}
                fontSize={17}
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
              />
              <AppPressable style={styles.viewMoreBtn}>
                <AppText
                  text={t('app.subscription.view_more')}
                  fontSize={13}
                  type="Medium"
                  color={Colors.BRUNSWICK_GREEN}
                />
              </AppPressable>
            </View>

            <AppText
              text={t('auth.payment.starter_features.channel_sync.title')}
              fontSize={14}
              type="Bold"
              color={Colors.BRUNSWICK_GREEN}
              mt={14}
              mb={6}
            />
            {channelFeatures.map((f, i) => (
              <View key={i} style={styles.bulletRow}>
                <AppText text="•" fontSize={13} color={Colors.GREY_SHADOW} mr={6} />
                <AppText
                  text={f}
                  fontSize={13}
                  color={Colors.GREY_SHADOW}
                  style={styles.bulletText}
                />
              </View>
            ))}

            <AppText
              text={t('auth.payment.starter_features.ai_limited.title')}
              fontSize={14}
              type="Bold"
              color={Colors.BRUNSWICK_GREEN}
              mt={14}
              mb={6}
            />
            {aiFeatures.map((f, i) => (
              <View key={i} style={styles.bulletRow}>
                <AppText text="•" fontSize={13} color={Colors.GREY_SHADOW} mr={6} />
                <AppText
                  text={f}
                  fontSize={13}
                  color={Colors.GREY_SHADOW}
                  style={styles.bulletText}
                />
              </View>
            ))}
          </GlassCard>
        )}

        {/* Renewal Card */}
        {hasSubscription && (
          <GlassCard width="100%" style={styles.card}>
            <View style={styles.actionRow}>
              <GlassCard width={46} style={styles.actionIconBg}>
                <Svgicons path="arrowReload" size={26} />
              </GlassCard>
              <View style={styles.actionInfo}>
                <AppText
                  text={
                    nextRenewal
                      ? `${t('app.subscription.renews')} ${dayjs(nextRenewal).format('DD MMMM YYYY')}`
                      : t('app.subscription.renews')
                  }
                  fontSize={16}
                  type="Bold"
                  color={Colors.BRUNSWICK_GREEN}
                />
                <AppText
                  text={`${t('app.subscription.next_payment')} - ${subscriptionCurrency} ${
                    listingCount > 0 ? totalAmount.toFixed(2) : '0.00'
                  }`}
                  fontSize={13}
                  color={Colors.GREY_SHADOW}
                  mt={3}
                />
              </View>
            </View>
          </GlassCard>
        )}

        {/* Change Plan */}
        {hasSubscription && (
          <GlassCard
            width="100%"
            style={styles.card}
            onPress={() => navigate(NavigationRoutes.APP_STACK.SELECT_PAYMENT_METHOD)}
          >
            <View style={styles.actionRow}>
              <GlassCard width={46} style={styles.actionIconBg}>
                <Svgicons path="cloudRefresh" size={26} />
              </GlassCard>
              <AppText
                text={t('app.subscription.change_plan')}
                fontSize={16}
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
                ml={14}
              />
            </View>
          </GlassCard>
        )}

        {/* Cancel Subscription */}
        {(isActive || isTrial) && (
          <GlassCard width="100%" style={styles.card} onPress={openSheet}>
            <View style={styles.actionRow}>
              <GlassCard width={46} style={styles.actionIconBg}>
                <Svgicons path="cloudCross" size={26} />
              </GlassCard>
              <AppText
                text={t('app.subscription.cancel')}
                fontSize={16}
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
                ml={14}
              />
            </View>
          </GlassCard>
        )}
      </ScrollView>

      <ConfirmAction
        ref={removeSheetRef}
        title={t('app.subscription.cancel')}
        content={t('app.subscription.cancel_confirm')}
        confirmText={t('app.subscription.yes_cancel')}
        closeText={t('app.subscription.no')}
        onConfirm={closeSheet}
      />

      {isCheckingEligibility && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={Colors.MEDIUM_JUNGLE_GREEN} />
        </View>
      )}
    </BGImage>
  );
};

const THUMB_SIZE = Metrics.scale(46);

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: Metrics.verticalScale(37) },
  backBtnWrapper: { width: 40, height: 40, alignSelf: 'flex-start' },
  backBtnInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: { marginBottom: 14 },
  priceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planNameBadge: {
    backgroundColor: Colors.TEAL_20_OPACITY,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6 },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: Colors.ADRIANA,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusBadgeTrial: { backgroundColor: '#FFF3CD' },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  propertyDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  propertyThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 12,
    backgroundColor: Colors.ANTI_FLASH_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 0,
    padding: 0,
  },
  propertyImage: { width: THUMB_SIZE, height: THUMB_SIZE },
  propertyInfo: { marginLeft: 12, flex: 1 },
  emptyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  loadingBox: { paddingVertical: Metrics.scale(20), alignItems: 'center' },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewMoreBtn: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletText: { flex: 1 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:0,
    marginBottom:0
  },
  actionInfo: { marginLeft: 14, flex: 1 },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
});

export default SubscriptionHistoryScreen;
