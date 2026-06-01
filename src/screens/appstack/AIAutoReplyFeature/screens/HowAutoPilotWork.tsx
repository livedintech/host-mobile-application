import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; // Added

// Shared Components
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';

// Theme & Utility
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { useAuthStore } from '@/store/useAuthStore';

const HowAutoPilotWork = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(); // Added
  const { user } = useAuthStore();
  console.log('user::', user);
  const HIDE_UPGRADE_PLAN_IDS = [
    'b0964a43-5ff2-49b4-be4e-d75afb665d41',
    '8b49aa16-cc53-4d16-b880-c008acc0ad3c',
  ];
  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText
          text={t('app.how_autopilot.title')}
          fontSize={32}
          type="Bold"
          mb={24}
        />

        {/* Section 1: Escalation & Responsibility */}
        <GlassCard style={styles.infoCard}>
          <AppText
            text={t('app.how_autopilot.escalation_title')}
            fontSize={18}
            type="Bold"
            mb={16}
            lineHeight={24}
          />
          <AppText
            fontSize={14}
            color={Colors.DARK_CHARCOAL}
            lineHeight={20}
            mb={16}
          >
            {t('app.how_autopilot.escalation_desc')}
          </AppText>

          <AppText
            fontSize={14}
            color={Colors.DARK_CHARCOAL}
            type="Bold"
            mb={4}
          >
            {t('app.how_autopilot.best_results')}
          </AppText>
          <AppText fontSize={14} color={Colors.DARK_CHARCOAL} mb={2}>
            {t('app.how_autopilot.tip_1')}
          </AppText>
          <AppText fontSize={14} color={Colors.DARK_CHARCOAL} mb={16}>
            {t('app.how_autopilot.tip_2')}
          </AppText>

          <AppText fontSize={14} color={Colors.DARK_CHARCOAL} lineHeight={20}>
            {t('app.how_autopilot.improvement_desc')}
          </AppText>
        </GlassCard>

        {/* Section 2: Grow Faster Card */}
        {!HIDE_UPGRADE_PLAN_IDS.includes(user?.sub_plan_id ?? '') && (
          <GlassCard style={styles.upgradeCard}>
            <AppText
              text={t('app.how_autopilot.upgrade_title')}
              fontSize={18}
              type="Bold"
              mb={12}
            />

            <AppText
              fontSize={14}
              color={Colors.DARK_CHARCOAL}
              lineHeight={20}
              mb={24}
            >
              {t('app.how_autopilot.upgrade_desc')}
            </AppText>

            <AppButton
              title={t('app.how_autopilot.btn_upgrade')}
              onPress={() => console.log('Upgrade Pressed')}
              variant="primary"
              backgroundColor={Colors.TEAL_PRIMARY_ALT}
              mt={50}
            />
          </GlassCard>
        )}
      </ScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.verticalScale(40),
  },
  scrollContent: {
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(40),
    paddingTop: Metrics.verticalScale(20),
  },
  infoCard: {
    padding: Metrics.scale(20),
    borderRadius: 20,
    width: '100%',
    marginBottom: Metrics.verticalScale(20),
  },
  upgradeCard: {
    padding: Metrics.scale(20),
    borderRadius: 20,
    width: '100%',
  },
});

export default HowAutoPilotWork;
