import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import MenuSection from '@/components/molecules/MenuSection/MenuSection';
import { useAuthStore } from '@/store/useAuthStore';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

const MoreScreen = () => {
  const { user, logout } = useAuthStore();
  return (
    <ImageBackground
      source={require('@/assets/img/background/moreScreenBG.png')}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <Pressable
          onPress={() => navigate(NavigationRoutes.APP_STACK.PROFILE_SETTING)}
        >
          <GlassCard width="auto" style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Image
                source={require('@/assets/img/profile.png')}
                style={styles.avatar}
              />
              <View>
                <AppText
                  text={user?.name ?? 'User Name'}
                  type="Bold"
                  fontSize={16}
                />
                <AppText
                  text={user?.phone ?? 'No Phone'}
                  fontSize={12}
                  color="grey"
                />
              </View>
            </View>
          </GlassCard>
        </Pressable>

        {/* Account Section */}
        <MenuSection
          title="Account"
          headerIcon="userOutline"
          items={[
            {
              title: 'Listing Management',
              icon: 'direct',
              onPress: () => {
                navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
              },
            },
            {
              title: 'Booking Platform Management',
              icon: 'bookingIcon',
              onPress: () => {
                navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
              },
            },
            {
              title: 'User Management',
              icon: 'userManagementIconNew',
              onPress: () => {
                navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT);
              },
            },
            { title: 'Review Management', icon: 'reviewManagementIcon', onPress: () => {navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT)} },
            {
              title: 'Smart Lock Management',
              icon: 'lockIcon',
              onPress: () => {
                navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS);
              },
            },
          ]}
        />

        {/* Analytics Section */}
        <MenuSection
          title="Analytics"
          headerIcon="analyticsOutline"
          items={[
            {
              title: 'Statistics',
              icon: 'statsIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.STATISTICS_SCREEN),
            },
            {
              title: 'Listing Performance',
              icon: 'performanceIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.LISTING_PERFORMANCE),
            },
            {
              title: 'Channel Performance',
              icon: 'performanceIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.CHANNEL_PERFORMANCE),
            },
          ]}
        />

        {/* Billing Section */}
        <MenuSection
          title="Billing"
          headerIcon="cardOutline"
          items={[
            { title: 'Payment Methods', icon: 'paymentIcon', onPress: () => {navigate(NavigationRoutes.APP_STACK.PAYMENT_METHOD_LIST)} },
            { title: 'Subscription', icon: 'subscriptionIcon', onPress: () => {navigate(NavigationRoutes.APP_STACK.SUBSCRIPTION_HISTORY)} },
            {
              title: 'Transaction History',
              icon: 'transactionIcon',
              onPress: () => {navigate(NavigationRoutes.APP_STACK.TRANSACTION_HISTORY)},
            },
          ]}
        />

        {/* Logout at the bottom */}
        <Pressable onPress={() => logout()}>
          <GlassCard width="100%" style={styles.logoutCard}>
            <View style={styles.logoutContent}>
              <AppText text="Logout" type="Medium" fontSize={16} />

              <GlassCard width={36} style={styles.logoutIconGlass}>
                <Svgicons path="logoutIcon" size={18} />
              </GlassCard>
            </View>
          </GlassCard>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(20),
  },
  profileCard: {
    alignSelf: 'flex-start',
    padding: Metrics.scale(8),
    paddingRight: Metrics.scale(30),
    borderRadius: 100,
    backgroundColor: '#D9D9D933',
    marginBottom: Metrics.verticalScale(30),
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  logoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    paddingVertical: Metrics.verticalScale(10),
    paddingHorizontal: Metrics.scale(16),
    marginBottom: Metrics.verticalScale(20),
  },
  logoutContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutIconGlass: {
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginBottom: 0,
  },
  iconCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MoreScreen;
