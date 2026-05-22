import { Image, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import ButtonView from '../AppButton/ButtonView';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { useTranslation } from 'react-i18next';
import i18n, { changeLanguage } from '@/locales/i18n/i18n';
import GlassCard from '../GlassCard/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import { useQuery } from '@tanstack/react-query';
import STORAGE_CONST from '@/constants/storage';
import { getMobileNotificationsCount } from '@/services/mobileNotificationsApi';
import { useNotificationStore } from '@/store/useNotificationStore';
import { UpdateLanguageApi } from '@/services/ChangeLanguageApi';

interface HeaderApp {
  isGoBack?: boolean;
  isGoBackAfterLogo?: boolean;
  isGetStarted?: boolean;
  isLogo?: boolean;
  isLang?: boolean;
  addIconAfterisGoBack?: string;
  isShowProfile?: boolean;
  isNotification?: boolean;
}

const HeaderApp = ({
  isGoBack,
  isGetStarted,
  isLogo,
  isLang,
  isGoBackAfterLogo,
  addIconAfterisGoBack,
  isShowProfile,
  isNotification,
}: HeaderApp) => {
  const getStarted = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
  }, []);
  const { user } = useAuthStore();
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const { data: notifCountData } = useQuery({
    queryKey: [STORAGE_CONST.GET_MOBILE_NOTIFICATIONS_COUNT],
    queryFn: getMobileNotificationsCount,
    enabled: !!isNotification,
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (notifCountData?.data?.unread !== undefined) {
      setUnreadCount(notifCountData.data.unread);
    }
  }, [notifCountData?.data?.unread]);

  const { t } = useTranslation();

  const handleLanguageToggle = async () => {
    try {
      const newLang = i18n.language === 'en' ? 'ar' : 'en';

      if (user?.id) {
        await UpdateLanguageApi({
          language: newLang,
        });
      }

      // changeLanguage already handles forceRTL + restart internally
      await changeLanguage(newLang);
    } catch (error) {
      console.log('Language update failed:', error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {isLogo && (
          <AppText
            text={t('app.header.brand')}
            fontSize={32}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
        )}
        {isGoBack && (
          <ButtonView
            onPress={() => goBack()}
            style={i18n.language === 'ar' ? { transform: [{ scaleX: -1 }] } : undefined}
          >
            <Svgicons path="back" size={40} />
          </ButtonView>
        )}
        {isShowProfile && (
          <GlassCard width="auto" style={styles.profilePill} onPress={() => navigate(NavigationRoutes.APP_STACK.PROFILE_SETTING)}>
            {user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderIcon}>
                <Svgicons path="imageUploadIcon" size={25} />
              </View>
            )}
            <View>
              <AppText
                text={t('app.home.hello', { name: user?.name })}
                fontSize={12}
                color={Colors.PINE_FOREST}
              />
              <AppText
                text={t('app.home.good_morning')}
                fontSize={14}
                type="SemiBold"
                color={Colors.BLACK}
              />
            </View>
          </GlassCard>
        )}

        <View style={styles.headerRight}>
          {isLang && (
            <>
              {/* <GradientBorder
                borderRadius={16}
                borderWidth={1}
                style={[styles.langBtn, { marginRight: Metrics.scale(5) }]}
              >
                <Pressable style={styles.langBtn} onPress={handleLanguageToggle}>
                  <AppText text={t('common.lang_switch')} fontSize={12} type="Medium" />
                </Pressable>
              </GradientBorder> */}

              <ButtonView
                onPress={handleLanguageToggle}
                style={[styles.langBtn, { marginRight: Metrics.scale(5) }]}
              >
                {i18n.language === 'ar' ? (
                  <Svgicons path="enLang" size={65} />
                ) : (
                  <Svgicons path="arLang" size={60} />
                )}
              </ButtonView>
            </>
          )}
          {isNotification && (
            <AppPressable
              style={{
                marginLeft: Metrics.scale(5),
                alignSelf: 'center',
              }}
              onPress={() => {
                navigate(NavigationRoutes.APP_STACK.NOTIFIATION);
              }}
            >
              <View style={styles.bellWrapper}>
                <Svgicons path="bell" size={25} />
                {unreadCount > 0 && <View style={styles.unreadDot} />}
              </View>
            </AppPressable>
          )}
          {isGetStarted && (
            <GradientBorder style={styles.getStartedBtn} borderRadius={20}>
              <AppPressable style={styles.getStartedBtn} onPress={getStarted}>
                <AppText
                  text={t('app.header.get_started')}
                  fontSize={12}
                  type="Medium"
                />
              </AppPressable>
            </GradientBorder>
          )}
        </View>
      </View>
      {isGoBackAfterLogo && (
        <View style={styles.headerRow}>
          <View style={styles.arrowCircleInner}>
            <AppPressable
              style={styles.arrowCircleInner}
              onPress={() => goBack()}
            >
              <Svgicons path={i18n.language === 'ar' ? 'arrowRightIcon' : 'arrowLeftIcon'} size={24} />
            </AppPressable>
          </View>
          {addIconAfterisGoBack && <Svgicons path="mapIcon" size={35} />}
        </View>
      )}
    </View>
  );
};

export default HeaderApp;

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: Metrics.baseMargin,
    backgroundColor: Colors.WHITE,
    paddingTop: Metrics.verticalScale(15),
  },
  langBtn: {
    width: Metrics.scale(60),
    height: Metrics.scale(36),
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedBtn: {
    width: Metrics.scale(110),
    height: Metrics.scale(36),
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowCircleInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 0,
    borderRadius: 30,
    backgroundColor: Colors.TRANSPARENT,
  },
  profileImage: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  placeholderIcon: {
    width: 36,
    height: 36,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellWrapper: {
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
});
