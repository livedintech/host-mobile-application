import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Metrics from '@/utility/Metrics';
import { goBack } from '@/services/navigationService';
import { useTranslation } from 'react-i18next';

interface NoAutomationProps {
  onCreatePress: () => void;
}

const NoAutomationScreen = ({ onCreatePress }: NoAutomationProps) => {
  const { t } = useTranslation();
  return (
      <View style={styles.container}>
        {/* Centered Content Area */}
        <View style={styles.content}>
          {/* Fallback Illustration using Svgicons */}
          <Svgicons
            path="noAutomationScreen"
            size={280}
            mb={Metrics.verticalScale(30)}
          />
          <View style={styles.textContent}>
          {/* Title - Increased size for Bold Fallback style */}
          <AppText
            text={t('app.no_automation.title')}
            fontSize={28}
            type="SemiBold"
            textAlign="center"
            color={Colors.BLACK}
            mb={15}
          />

          {/* Description */}
          <AppText
            text={t('app.no_automation.description')}
            fontSize={12}
            textAlign="center"
            color={Colors.DARK_CHARCOAL_OPACITY}
          />
          </View>
        </View>

        {/* Footer Fixed Action Button */}
        {/* <View style={styles.footer}>
          <AppButton
            title="Create New Template"
            backgroundColor={Colors.TEAL_PRIMARY_ALT}
            borderColor={Colors.TEAL_PRIMARY_ALT}
            onPress={onCreatePress}
          />
        </View> */}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.verticalScale(40),
  },
  header: {
    paddingHorizontal: Metrics.scale(22),
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Push the content slightly up for better optical centering
    paddingBottom: Metrics.verticalScale(60),
  },
  footer: {
    paddingHorizontal: Metrics.scale(22),
    paddingBottom: Metrics.verticalScale(40),
  },
  textContent:{
    paddingHorizontal: Metrics.scale(40)
  }
});

export default NoAutomationScreen;
