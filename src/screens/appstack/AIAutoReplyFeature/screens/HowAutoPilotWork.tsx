import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; // Added

// Shared Components
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import BGImage from '@/components/molecules/BGImage/BGImage';

// Theme & Utility
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

const HowAutoPilotWork = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(); // Added
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
});

export default HowAutoPilotWork;
