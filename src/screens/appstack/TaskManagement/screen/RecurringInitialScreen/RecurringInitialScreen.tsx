import { useTranslation } from 'react-i18next';
import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { navigate, goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useTaskStore } from '@/store/taskStore';

const RecurringInitialScreen = () => {
  const { resetTaskStore } = useTaskStore();
  const { t } = useTranslation();
  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <View style={styles.content}>
          {/* Illustration Section */}
          <View style={styles.illustrationContainer}>
            <Svgicons path="recurringImg" size={Metrics.scale(300)} />
          </View>

          {/* Text Content Section */}
          <View style={styles.textContent}>
            <AppText
              text={t('app.task_management.recurring_desc')}
              fontSize={28}
              type="Bold"
              lineHeight={33}
              mb={24}
              color={Colors.BLACK}
            />

            <AppText
              fontSize={14}
              color={Colors.DARK_CHARCOAL_OPACITY}
              lineHeight={20}
            >
              You only need to{' '}
              <AppText
                text="create it once"
                fontSize={16}
                color={Colors.PRIMARY_TEAL}
                type="Bold"
              />
              , every time there is a new booking, the cleaning task will
              automatically appear in your task management for the assigned team
              member.
            </AppText>
          </View>

          {/* Action Button */}
          <View style={styles.footer}>
            <AppButton
              title={t('app.task_management.next')}
              backgroundColor={Colors.PRIMARY_TEAL}
              borderColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              fontSize={16}
              type="Regular"
              onPress={() => {
                resetTaskStore();
                navigate(NavigationRoutes.APP_STACK.RECURRING_TASK_SCREEN);
              }}
            />
          </View>
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: Metrics.scale(25),
  },
  illustrationContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  footer: {
    marginBottom: Metrics.verticalScale(30),
  },
});

export default RecurringInitialScreen;
