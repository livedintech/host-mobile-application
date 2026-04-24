import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useSubscriptionHistoryContainer from './SubscriptionHistoryContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import Metrics from '@/utility/Metrics';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const SubscriptionHistoryScreen = () => {
  const {
    listings,
    features,
    removeSheetRef,
    closeSheet,
    openSheet,
    isLoading,
    isLoadingGetSubscrptionUserPlan,
    refetch,
    getSubscrptionUserPlan,
  } = useSubscriptionHistoryContainer();
  const { t } = useTranslation();

  const pricePerListing = parseFloat(getSubscrptionUserPlan?.data?.subscription?.price ?? '0') || 0;
  const listingCount = listings?.length ?? 0;
  const totalAmount = listingCount * pricePerListing;

  const hasSubscription = getSubscrptionUserPlan?.success === true;
  const subscriptionPrice = hasSubscription
    ? getSubscrptionUserPlan?.data?.subscription?.price ?? '—'
    : '—';
  const nextRenewal = hasSubscription
    ? getSubscrptionUserPlan?.data?.next_renewal_at
    : null;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText
          text={t('app.subscription.title')}
          fontSize={24}
          type="Medium"
          color={Colors.BRUNSWICK_GREEN}
          mt={45}
          mb={15}
        />

        {/* Price Card */}
        <GradientBorder borderRadius={24} style={styles.cardWrapper}>
          <View style={styles.innerCard}>
            {isLoadingGetSubscrptionUserPlan ? (
              <ActivityIndicator color={Colors.BRUNSWICK_GREEN} />
            ) : hasSubscription ? (
              <>
                <AppText
                  text={t('app.subscription.monthly')}
                  fontSize={14}
                  color={Colors.BRUNSWICK_GREEN}
                  type="Bold"
                />
                <View style={styles.row}>
                  <AppText
                    text={`SAR ${subscriptionPrice}`}
                    fontSize={26}
                    type="Bold"
                    color={Colors.BRUNSWICK_GREEN}
                  />
                  <AppText
                    text={t('app.subscription.per_listing')}
                    fontSize={14}
                    color={Colors.BRUNSWICK_GREEN}
                  />
                </View>
              </>
            ) : (
              <View style={styles.emptyState}>
                <AppText
                  text={t('app.subscription.no_subscription')}
                  fontSize={14}
                  color={Colors.PINE_FOREST}
                  mt={8}
                  textAlign="center"
                />
              </View>
            )}
          </View>
        </GradientBorder>

        {/* Features Grid */}
        <GradientBorder borderRadius={24} style={styles.cardWrapper}>
          <View style={[styles.innerCard, styles.featuresContainer]}>
            {features.map((item) => (
              <View key={item.id} style={styles.featureItem}>
                <Svgicons path={item.icon} size={45} />
                <AppText
                  text={item.label}
                  fontSize={6}
                  textAlign="center"
                  color={Colors.PINE_FOREST}
                  mt={8}
                  type="Medium"
                />
              </View>
            ))}
          </View>
        </GradientBorder>

        <AppText
          text={t('app.subscription.your_listings')}
          fontSize={24}
          type="Medium"
          color={Colors.BRUNSWICK_GREEN}
          mt={30}
          mb={15}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.BRUNSWICK_GREEN} />
          </View>
        ) : listingCount === 0 ? (
          <GradientBorder borderRadius={24} style={styles.cardWrapper}>
            <View style={[styles.innerCard, styles.emptyListingsBox]}>
              <Svgicons path="listingIcon" size={48} />
              <AppText
                text={t('app.subscription.no_listings')}
                fontSize={16}
                type="Medium"
                color={Colors.BRUNSWICK_GREEN}
                mt={10}
              />
              <AppText
                text={t('app.subscription.no_listings_desc')}
                fontSize={12}
                color={Colors.PINE_FOREST}
                mt={4}
                textAlign="center"
              />
            </View>
          </GradientBorder>
        ) : (
          <FlatListSimpleHandler
            horizontal
            data={listings}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={({ item }) => (
              <GradientBorder borderRadius={24} style={styles.listingItem}>
                <View style={styles.innerCard}>
                  <Svgicons path="listingIcon" size={49} />
                  {/* FIX: Fallback text if both title and name are missing */}
                  <AppText
                    text={item.title || item.name || 'Untitled'}
                    fontSize={14}
                    color={Colors.PINE_FOREST}
                    mt={10}
                    numberOfLines={1}
                  />
                </View>
              </GradientBorder>
            )}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        )}

        {/* Footer: Renewal info — only show if subscription exists */}
        {hasSubscription && (
          <GradientBorder borderRadius={24} style={styles.cardWrapper}>
            <View style={[styles.innerCard, styles.renewalBox]}>
              <AppText
                text={
                  nextRenewal
                    ? `Renew ${dayjs(nextRenewal).format('DD MMMM YYYY')}`
                    : 'Renewal date unavailable'
                }
                fontSize={18}
                type="Medium"
                color={Colors.BRUNSWICK_GREEN}
              />
              {/* FIX: Only show total if listings exist */}
              <AppText
                text={listingCount > 0 ? `SAR ${totalAmount.toFixed(2)}` : 'SAR 0.00'}
                fontSize={14}
                color={Colors.PINE_FOREST}
              />
            </View>
          </GradientBorder>
        )}

        {/* Cancel Subscription — only show if subscription is active */}
        {hasSubscription && getSubscrptionUserPlan?.data?.status === 'active' && (
          <Pressable onPress={openSheet}>
            <GradientBorder borderRadius={24} style={styles.cancelBtnGradient}>
              <View style={[styles.innerCard, styles.cancelBtn]}>
                <AppText
                  text={t('app.subscription.cancel')}
                  fontSize={22}
                  type="Medium"
                  color={Colors.BRUNSWICK_GREEN}
                />
                <GradientBorder borderRadius={16} borderWidth={1}>
                  <View style={styles.arrowCircleInner}>
                    <Svgicons path="ArrowUpRightIcon" />
                  </View>
                </GradientBorder>
              </View>
            </GradientBorder>
          </Pressable>
        )}
      </ScrollView>

      {/* ConfirmAction sheet */}
      <ConfirmAction
        ref={removeSheetRef}
        title={t('app.subscription.cancel')}
        content={t('app.subscription.cancel_confirm')}
        confirmText={t('app.subscription.yes_cancel')}
        closeText={t('app.subscription.no')}
        onConfirm={closeSheet} // TODO: replace closeSheet with actual cancel API call
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'baseline', marginTop: 5 },
  innerCard: {
    borderRadius: 23,
    backgroundColor: Colors.WHITE,
    paddingVertical: Metrics.scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(16),
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: { alignItems: 'center', flex: 1 },
  renewalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(10),
  },
  cancelBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  cardWrapper: { marginBottom: 15 },
  cancelBtnGradient: { marginTop: 15 },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingItem: {
    width: Metrics.scale(105),
    marginRight: Metrics.scale(13),
    marginBottom: Metrics.verticalScale(46),
  },
  // FIX: New styles for empty/loading states
  emptyState: {
    alignItems: 'center',
    paddingVertical: Metrics.scale(10),
  },
  emptyListingsBox: {
    paddingVertical: Metrics.scale(30),
  },
  loadingContainer: {
    height: Metrics.scale(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SubscriptionHistoryScreen;