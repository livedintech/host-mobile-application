import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import DropdownField from '@/components/molecules/Input/DropdownField';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import CreateTaskContainer from '../../container/CreateTaskContainer/CreateTaskContainer';
import { useTranslation } from 'react-i18next';

const RecurringTaskScreen = () => {
  const { t } = useTranslation();
  const {
    transformedListingCleaning,
    transformedVendor,
    onNextStep,
    isLoadingCleaning,
    isRefreshingCleaning,
    onRefresh
  } = CreateTaskContainer();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listing: '',
      assignUser: '',
    },
  });

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <RefreshableScrollView
          contentContainerStyle={styles.scrollContent}
          onRefresh={onRefresh}
          refreshing={isRefreshingCleaning}
        >
          <View style={styles.titleContainer}>
            <AppText
              text={t('app.task_management.recurring_title')}
              fontSize={28}
              type="Bold"
              lineHeight={32}
              mb={16}
              color={Colors.BLACK}
            />
            <AppText
              text={t('app.task_management.recurring_body')}
              fontSize={14}
              color={Colors.DARK_CHARCOAL_OPACITY_80}
              lineHeight={20}
              mb={32}
            />
          </View>

          <View style={styles.formContainer}>
            <DropdownField
              name="listing"
              control={control}
              errors={errors}
              label={t('app.task_management.listing_selection_label')}
              data={transformedListingCleaning}
              placeholder={t('app.task_management.listing_placeholder')}
              rules={{ required: 'Please select a listing' }}
            />

            <DropdownField
              name="assignUser"
              label={t('app.task_management.assign_user_label')}
              control={control}
              errors={errors}
              data={transformedVendor}
              placeholder={t('app.task_management.select_user')}
              rules={{ required: 'Assigning a user is required' }}
              disabled={isLoadingCleaning}
            />

            <View style={styles.infoContainer}>
              <AppText
                fontSize={13}
                color={Colors.DARK_CHARCOAL_OPACITY_80}
                lineHeight={18}
              >
                {t('app.task_management.select_user_hint')}{' '}
                <AppText
                  text={t('app.task_management.user_management_link')}
                  fontSize={13}
                  color={Colors.PRIMARY_TEAL}
                  type="Bold"
                  textDecorationLine="underline"
                  onPress={() =>
                    navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT)
                  }
                />
              </AppText>
            </View>
          </View>

          <View style={styles.footer}>
            <AppButton
              title={t('app.task_management.next')}
              loading={isLoadingCleaning}
              backgroundColor={Colors.PRIMARY_TEAL}
              borderColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              fontSize={16}
              type="Regular"
              onPress={handleSubmit(onNextStep)}
            />
          </View>
        </RefreshableScrollView>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Metrics.scale(25),
    paddingTop: Metrics.verticalScale(50),
    paddingBottom: Metrics.verticalScale(20),
    flexGrow: 1, // Ensures content stretches to fill screen so pull-to-refresh works
  },
  titleContainer: { marginBottom: Metrics.verticalScale(10) },
  formContainer: { flex: 1 },
  infoContainer: {
    marginTop: Metrics.verticalScale(-8),
    paddingRight: Metrics.scale(20),
  },
  footer: { marginTop: Metrics.verticalScale(20), marginBottom: Metrics.verticalScale(10) },
});

export default RecurringTaskScreen;