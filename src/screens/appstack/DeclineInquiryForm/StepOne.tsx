import { useTranslation } from 'react-i18next';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import BGImage from '@/components/molecules/BGImage/BGImage';
import NavigationRoutes from '@/navigation/NavigationRoutes';

type ParamList = {
  StepOne: {
id: string | number;
    type: string;
    guestName?: string;
    start_date?: string; 
    end_date?: string;
  };
};

const StepOne = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<ParamList, 'StepOne'>>();
  const { guestName, id,  } = route.params || {};
  const navigation = useNavigation<any>();

  const options = [
    { label: t('app.decline_step1.option_dates'), value: 'dates_not_available' },
    { label: t('app.decline_step1.option_house_rules'), value: 'not_a_good_fit' },
    { label: t('app.decline_step1.option_better_reservation'), value: 'waiting_for_better_reservation' },
    { label: t('app.decline_step1.option_uncomfortable'), value: 'not_comfortabl' },
    { label: t('app.decline_step1.option_other'), value: 'other' },
  ];

  const handleReasonSelection = (reasonValue: string) => {
    navigation.navigate(
      NavigationRoutes.APP_STACK.DECLINE_INQUIRY_STEP2_SCREEN,
      {
        ...route.params,
        reason: reasonValue, 
      },
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.backgroundDecoration}>
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AppText
            text={t('app.shared.decline_step1_title', { name: guestName || 'Abdul' })}
            fontSize={28}
            type="Bold"
            lineHeight={36}
            mb={40}
            color={Colors.BLACK}
          />

          {options.map((item, index) => (
            <ButtonView
              key={index}
              activeOpacity={0.8}
              onPress={() => handleReasonSelection(item.value)}
            >
              <GlassCard width="100%" style={styles.cardAdjustment}>
                <AppText
                  text={item.label} 
                  fontSize={16}
                  type="Medium"
                  color={Colors.BLACK}
                  py={8}
                />
              </GlassCard>
            </ButtonView>
          ))}
        </ScrollView>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundDecoration: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  circleLarge: {
    width: Metrics.scale(400),
    height: Metrics.scale(400),
    borderRadius: Metrics.scale(200),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    position: 'absolute',
  },
  circleSmall: {
    width: Metrics.scale(250),
    height: Metrics.scale(250),
    borderRadius: Metrics.scale(125),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    position: 'absolute',
  },
  scrollContent: {
    paddingHorizontal: Metrics.scale(24),
    paddingTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(40),
  },
  cardAdjustment: {
    marginBottom: Metrics.verticalScale(12),
    paddingVertical: Metrics.verticalScale(20),
    justifyContent: 'center',
    backgroundColor: 'rgba(217, 217, 217, 0.2)', // Glass effect from screenshot
    width: '100%',
  },
});

export default StepOne;