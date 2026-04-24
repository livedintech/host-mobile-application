import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const MoreScreen = () => {

  const { t } = useTranslation();
  const { logout,user } = useAuthStore();
  const goToBilling = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.BILLING);
  }, []);
  const goToAccount = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.ACCOUNT);
  }, []);
  const goToAnalytics = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.LISTING_PERFORMANCE);
  }, []);
  const goToProfile = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.PROFILE_SETTING);
  }, []);

  const referComingSoon = () => {
    Toast.show({
      type: 'success',
      text1: 'Coming soon',
    });
  };


  const MenuCard = ({ title, items, icon, onPress }: any) => (
    <GradientBorder borderRadius={20} style={styles.menuCardWrapper}>
      <Pressable style={styles.menuCardInner} onPress={onPress}>
        <View style={styles.rowBetween}>
          <AppText text={title} type="Bold" color={Colors.BRUNSWICK_GREEN} />
          <GradientBorder
            borderRadius={16}
            borderWidth={1}
            style={styles.arrowCircleInner}
          >
            <Pressable onPress={onPress} style={styles.arrowCircleInner}>
              <Svgicons path="ArrowUpRightIcon" size={21} />
            </Pressable>
          </GradientBorder>
        </View>
        <Svgicons path={icon} style={styles.centerIcon} size={59} />
        <AppText
          text={items.join('\n')}
          fontSize={13}
          color="#666"
          lineHeight={20}
        />
      </Pressable>
    </GradientBorder>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <ButtonView style={styles.profileRow} onPress={goToProfile}>
        <View style={styles.avatarCircle} />
        <View style={{ marginLeft: 15 }}>
          <AppText text={user?.name || ''} fontSize={18} type="Bold" />
          <AppText text={user?.phone || ''} color="#999" />
        </View>
      </ButtonView>

      <View style={styles.grid}>
        <MenuCard
          title={t('app.more.account_section')}
          items={['Profile Settings', 'Manage Listings', 'User Management']}
          icon={'userIcon'}
          onPress={goToAccount}
        />
        <MenuCard
          title={t('app.more.analytics_section')}
          items={['Statistics', 'Listing Performance', 'Channel Performance']}
          icon={'analyticsIcon'}
          onPress={goToAnalytics}
        />
        <MenuCard title={t('app.more_legacy.billing_section')} items={['Payment Method', 'Subscription', 'Transaction History']} icon={'cardIcon'} onPress={goToBilling} />
       
        <MenuCard
          title={t('app.more_legacy.refer_section')}
          items={['Refer App', 'To Another', 'Host']}
          icon={'heartIcon'}
          onPress={referComingSoon}
        />
      </View>
      <GradientBorder borderRadius={20} style={styles.logoutWrapper}>
        <Pressable style={styles.logoutBtn} onPress={() => null}>
          <AppText
            text={t('app.more_legacy.general_section')}
            fontSize={24}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
          <GradientBorder
            borderRadius={16}
            borderWidth={1}
            style={styles.arrowCircleInner}
          >
            <View style={styles.arrowCircleInner}>
              <Svgicons path="ArrowUpRightIcon" size={21} />
            </View>
          </GradientBorder>
        </Pressable>
      </GradientBorder>
      <GradientBorder borderRadius={20} style={styles.logoutWrapper}>
        <Pressable style={styles.logoutBtn} onPress={() => logout()}>
          <AppText
            text={t('app.more.logout')}
            fontSize={24}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
          <GradientBorder
            borderRadius={16}
            borderWidth={1}
            style={styles.arrowCircleInner}
          >
            <View style={styles.arrowCircleInner}>
              <Svgicons path="ArrowUpRightIcon" size={21} />
            </View>
          </GradientBorder>
        </Pressable>
      </GradientBorder>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 , alignSelf:'flex-start'},
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CCC',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  menuCardWrapper: { width: '48%', marginBottom: 15 },
  menuCardInner: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
    height:240
  },
  centerIcon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallIcon: {
    borderRadius: 100,
    height: Metrics.scale(32),
    width: Metrics.scale(32),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutWrapper: { marginTop: 10 },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MoreScreen;
