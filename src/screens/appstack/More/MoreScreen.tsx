import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ImageBackground,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AppImage from '@/components/atoms/AppImage/AppImage';
import AppText from '@/components/molecules/AppText/AppText';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import MenuSection from '@/components/molecules/MenuSection/MenuSection';
import { useAuthStore } from '@/store/useAuthStore';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import { logoutApi, deleteAccountApi } from '@/services/authApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storage } from '@/storage/mmkv';
import i18n, { saveLanguage } from '@/locales/i18n/i18n';
import Toast from 'react-native-toast-message';
import AccountDeleteModal from '@/components/molecules/AccountDeleteModal/AccoutDeleteModal';

import { NotificationService } from '@/services/notification.service';
import { useFocusEffect } from '@react-navigation/native';
import { getUser } from '@/services/UserPermission';
import { CrashlyticsService } from '@/services/crashlytics.service';

const MoreScreen = () => {
  const { t } = useTranslation();
  const { user, logout, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Always refresh user data on focus
      getUser()
        .then(data => {
          if (data) setUser(data);
        })
        .catch(() => {});
    }, []),
  );

  const toggleModal = () => setModalVisible(!isModalVisible);

  const performLocalLogout = useCallback(() => {
    CrashlyticsService.setUserId('');
    CrashlyticsService.log('User logged out');
    setModalVisible(false);
    const currentLang = i18n.language || 'ar';
    const rememberMeData = storage.getString('remember-me-storage');
    logout();
    storage.clearAll();
    saveLanguage(currentLang);
    if (rememberMeData) storage.set('remember-me-storage', rememberMeData);
    queryClient.clear();
  }, [logout, queryClient]);

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      const fcm_token = await NotificationService.getToken().catch(() => '');
      return logoutApi({ user_id: user?.id ?? '', fcm_token });
    },
    onSuccess: () => {
      performLocalLogout();
    },
    onError: () => {
      performLocalLogout();
    },
  });

  const toggleDeleteModal = () => setDeleteModalVisible(!isDeleteModalVisible);

  const { mutate: handleDeleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      setDeleteModalVisible(false);
      Toast.show({ type: 'success', text1: i18n.t('common.toast.account_deleted') });
      performLocalLogout();
    },
    onError: (error: any) => {
      setDeleteModalVisible(false);
      Toast.show({ type: 'error', text1: error?.message || i18n.t('common.toast.failed_delete_account') });
    },
  });

  const displayPhone =
    user?.phone_with_code && user?.phone
      ? `+${user.phone_with_code} ${user.phone}`
      : user?.phone_with_code || user?.phone || '******';

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
        <AppPressable
          onPress={() => navigate(NavigationRoutes.APP_STACK.PROFILE_SETTING)}
        >
          <GlassCard width="auto" style={styles.profileCard}>
            <View style={styles.profileInfo}>
              {user?.profile_picture ? (
                <AppImage
                  source={{ uri: user.profile_picture }}
                  style={styles.avatar}
                />
              ) : (
                <Svgicons path="imageUploadIcon" size={25} />
              )}
              <View>
                <AppText
                  text={user?.name ?? 'User Name'}
                  type="Bold"
                  fontSize={16}
                />
                <AppText text={displayPhone} fontSize={12} color="grey" />
              </View>
            </View>
          </GlassCard>
        </AppPressable>

        {/* Sections (Account & Analytics) */}
        <MenuSection
          title={t('app.more.account_section')}
          headerIcon="userOutline"
          items={[
            {
              title: t('app.more.listing_management'),
              icon: 'direct',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
            },
            {
              title: t('app.more.booking_platform'),
              icon: 'bookingIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING),
            },
            {
              title: t('app.more.user_management'),
              icon: 'userManagementIconNew',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT),
            },
            {
              title: t('app.more.review_management'),
              icon: 'reviewManagementIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT),
            },
            {
              title: t('app.more.smart_lock'),
              icon: 'lockIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS),
            },
          ]}
        />

        <MenuSection
          title={t('app.more.analytics_section')}
          headerIcon="analyticsOutline"
          items={[
            {
              title: t('app.more.statistics'),
              icon: 'statsIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.STATISTICS_SCREEN),
            },
            {
              title: t('app.more.listing_performance'),
              icon: 'performanceIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.LISTING_PERFORMANCE),
            },
            {
              title: t('app.more.channel_performance'),
              icon: 'performanceIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.CHANNEL_PERFORMANCE),
            },
          ]}
        />

        <MenuSection
          title={t('app.more.chat_settings_section')}
          headerIcon="aiSetting"
          items={[
            {
              title: t('app.more.ai_autopilot'),
              icon: 'aiAutoReplyMoreScreenIcon',
              onPress: () => navigate(NavigationRoutes.APP_STACK.AI_AUTOPILOT),
            },
            {
              title: t('app.more.escalation_settings'),
              icon: 'escalationIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.ESCALATION_SETTINGS),
            },
            {
              title: t('app.more.message_categories'),
              icon: 'messageCategoriesIcon',
              onPress: () =>
                navigate(NavigationRoutes.APP_STACK.MESSAGE_CATEGORIES),
            },
          ]}
        />
        {/* Logout Trigger */}
        <AppPressable onPress={toggleModal}>
          <GlassCard width="100%" style={styles.logoutCard}>
            <View style={styles.logoutContent}>
              <AppText
                text={t('app.more.logout')}
                type="Medium"
                fontSize={16}
              />
              <GlassCard width={36} style={styles.logoutIconGlass}>
                <Svgicons path="logoutIcon" size={18} />
              </GlassCard>
            </View>
          </GlassCard>
        </AppPressable>

        {/* Delete Account Trigger */}
        <AppPressable onPress={toggleDeleteModal}>
          <GlassCard width="100%" style={styles.logoutCard}>
            <View style={styles.logoutContent}>
              <AppText
                text={t('app.more.delete_account')}
                type="Medium"
                fontSize={16}
                color={Colors.INDIAN_RED}
              />
              <GlassCard width={36} style={styles.logoutIconGlass}>
                <Svgicons path="TrashFull" size={18} />
              </GlassCard>
            </View>
          </GlassCard>
        </AppPressable>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <AppText
              text={t('app.more.logout_confirm')}
              type="Bold"
              fontSize={18}
              style={styles.modalTitle}
            />

            <AppText
              text={t('app.more.logout_subtitle')}
              fontSize={14}
              color="grey"
              style={styles.modalSubTitle}
            />

            <View style={styles.modalButtonContainer}>
              <AppPressable style={styles.cancelButton} onPress={toggleModal}>
                <AppText
                  text={t('app.more.cancel')}
                  type="Medium"
                  fontSize={16}
                  color="black"
                />
              </AppPressable>

              <AppPressable
                style={styles.confirmButton}
                onPress={() => handleLogout()}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <AppText
                    text={t('app.more.confirm')}
                    type="Medium"
                    fontSize={16}
                    color="white"
                  />
                )}
              </AppPressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <AccountDeleteModal
        isVisible={isDeleteModalVisible}
        onClose={toggleDeleteModal}
        onConfirm={() => handleDeleteAccount()}
        isLoading={isDeleting}
        title={t('app.more.delete_account_confirm')}
        description={t('app.more.delete_account_subtitle')}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(100),
  },
  // ... (existing styles remain the same)
  profileCard: {
    alignSelf: 'flex-start',
    padding: Metrics.scale(8),
    paddingRight: Metrics.scale(30),
    borderRadius: 100,
    backgroundColor: '#D9D9D933',
    marginBottom: Metrics.verticalScale(30),
  },
  profileInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 45, height: 45, borderRadius: 22.5 },
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

  // NEW MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#F2F2F2', // Light grey/white like the screenshot
    borderRadius: 35,
    padding: Metrics.scale(25),
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  modalSubTitle: {
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY_TEAL, // The teal/green color from your screenshot
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MoreScreen;
