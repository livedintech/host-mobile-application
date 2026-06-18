import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { useTaskStore } from '@/store/taskStore';
import { useTranslation } from 'react-i18next';

interface NoTaskProps {
  activeTab?: string;
  hasListings: boolean;
}

const NoTaskScreen = ({ activeTab, hasListings }: NoTaskProps) => {
  const { t } = useTranslation();
  const emptyText =
    activeTab === 'complete' ? t('app.no_task.completed') : t('app.no_task.available');
  const { resetTaskStore } = useTaskStore();
  return (
    // <BGImage source={require('@/assets/img/background/linearBG.png')}>
    <View style={styles.safeArea}>
      <View style={styles.content}>
        {/* Header */}
        {/* <View style={styles.header}>
            <AppText
              text={t('app.task_management.title')}
              fontSize={24}
              type="Medium"
              color={Colors.BLACK}
            />
          </View> */}

        {/* Center Illustration and Message */}
        <View style={styles.centerContent}>
          <View style={styles.iconContainer}>
            <Svgicons path="noTaskAvailable" size={Metrics.scale(320)} />
          </View>

          <AppText
            text={emptyText}
            fontSize={28}
            type="Bold"
            textAlign="center"
            mb={12}
          />

          {!hasListings && (
            <AppText
              text={t('app.no_task.no_listings_desc')}
              fontSize={16}
              textAlign="center"
              color={Colors.DARK_CHARCOAL_OPACITY}
              px={40}
              lineHeight={20}
            />
          )}
        </View>

        {/* Action Buttons */}
        {/* <View style={styles.footer}>
            <LinearGradient
              colors={[
                'rgba(128, 128, 128, 0.66)',
                'rgba(255, 255, 255, 0.66)',
                'rgba(128, 128, 128, 0.66)',
              ]}
              locations={[0, 0.5356, 1]}
              style={styles.gradientWrapper}
            >
              <AppButton
                title="Setup Cleaning Schedule"
                backgroundColor={Colors.WHITE}
                borderColor="transparent"
                color={Colors.BLACK}
                fontSize={16}
                style={styles.buttonReset}
                onPress={() => {
                   resetTaskStore();
                  navigate(NavigationRoutes.APP_STACK.RECURRING_INITIAL_SCREEN);
                }}
              />
            </LinearGradient>

            <AppButton
              title="Create Task"
              backgroundColor={Colors.PRIMARY_TEAL}
              borderColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              fontSize={16}
              onPress={() => {
                 resetTaskStore();
                navigate(NavigationRoutes.APP_STACK.CREATE_TASK_NON_CLEANING);
              }}
            />
          </View> */}
      </View>
    </View>
    // </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Metrics.scale(20),
  },
  header: {
    marginTop: Metrics.verticalScale(20), // Adjusted for SafeAreaView
    marginBottom: Metrics.verticalScale(40),
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: Metrics.verticalScale(30),
  },
  footer: {
    marginBottom: Metrics.verticalScale(30),
  },
  gradientWrapper: {
    borderRadius: 100,
    padding: 1, // The 1px border thickness
    marginBottom: Metrics.verticalScale(16),
  },
  buttonReset: {
    margin: 0,
  },
});

export default NoTaskScreen;
