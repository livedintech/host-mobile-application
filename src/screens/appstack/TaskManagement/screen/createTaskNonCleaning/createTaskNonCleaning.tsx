import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import DropdownField from '@/components/molecules/Input/DropdownField';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { goBack, navigate } from '@/services/navigationService';
import Metrics from '@/utility/Metrics';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import CreateTaskContainer from '../../container/CreateTaskContainer/CreateTaskContainer';
import { useTranslation } from 'react-i18next';

const VALIDATION_RULES = {
  LISTING: { required: 'Please select a listing' },
  CATEGORY: { required: 'Please select a category' },
  DATE: { required: 'Please select a date' },
  START_TIME: { required: 'Start time is required' },
  END_TIME: { required: 'End time is required' },
  USER: { required: 'Please assign a user to this task' },
};

const CreateTaskNonCleaning = () => {
  const { t } = useTranslation();
  const {
    transformedListing,
    transformedVendor,
    transformedCategory,
    isLoading,
    onNextStep,
  } = CreateTaskContainer();


  const today = new Date();
    const minStartDate = today;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listing: '',
      category: '',
      date: '',
      startTime: '',
      endTime: '',
      assignUser: '',
    },
  });

  const calendarIcon = useMemo(
    () => <Svgicons path="taskCalendar" size={20} />,
    [],
  );
  const clockIcon = useMemo(
    () => <Svgicons path="taskStartDate" size={20} />,
    [],
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <AppText
            text={t('app.task_management.create_task_title')}
            fontSize={32}
            type="Bold"
            mb={12}
          />
          <AppText
            text={t('app.task_management.create_non_cleaning_desc')}
            fontSize={14}
            color={Colors.DARK_CHARCOAL_OPACITY}
            lineHeight={20}
            mb={24}
          />

          <View style={styles.formContainer}>
            <DropdownField
              label={t('app.task_management.listing_selection_label')}
              name="listing"
              control={control}
              data={transformedListing}
              placeholder={t('app.task_management.listing_placeholder')}
              errors={errors}
              rules={VALIDATION_RULES.LISTING}
            />

            <DropdownField
              label={t('app.task_management.category_label')}
              name="category"
              control={control}
              data={transformedCategory}
              placeholder={t('app.task_management.category_label')}
              errors={errors}
              rules={VALIDATION_RULES.CATEGORY}
            />

            <DateTimeInputField
              label={t('app.task_management.date_placeholder')}
              name="date"
              mode="date"
              control={control}
              errors={errors}
              placeholder="mm/dd/yy"
              rightIcon={calendarIcon}
              rules={VALIDATION_RULES.DATE}
              minimumDate={minStartDate}
            />

            <View style={{ flex: 1 }}>
              <DateTimeInputField
                label={t('app.task_management.start_time_label')}
                name="startTime"
                mode="time"
                control={control}
                errors={errors}
                placeholder="-- : --"
                rightIcon={clockIcon}
                rules={VALIDATION_RULES.START_TIME}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DateTimeInputField
                label={t('app.task_management.end_time_label')}
                name="endTime"
                mode="time"
                control={control}
                errors={errors}
                placeholder="-- : --"
                rightIcon={clockIcon}
                rules={VALIDATION_RULES.END_TIME}
              />
            </View>

            <DropdownField
              label={t('app.task_management.assign_user_label')}
              name="assignUser"
              control={control}
              data={transformedVendor}
              placeholder={t('app.task_management.select_user')}
              errors={errors}
              rules={VALIDATION_RULES.USER}
            />

            <View style={styles.hintContainer}>
              <AppText
                fontSize={12}
                color={Colors.DARK_CHARCOAL_OPACITY}
                lineHeight={18}
              >
                {t('app.task_management.select_user_hint_extended')}{' '}
                <AppText
                  text={t('app.task_management.user_management_link')}
                  fontSize={12}
                  color={Colors.PRIMARY_TEAL}
                  type="Bold"
                  onPress={() =>
                    navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT)
                  }
                />
              </AppText>
            </View>
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title={t('app.task_management.next')}
            backgroundColor={Colors.PRIMARY_TEAL}
            borderColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            onPress={handleSubmit(onNextStep)}
            loading={isLoading}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  scrollContent: { paddingHorizontal: 25, paddingTop: 10 },
  formContainer: { marginTop: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  hintContainer: { marginTop: -5 },
  footer: {
    position: 'absolute',
    bottom: Metrics.verticalScale(30),
    left: 25,
    right: 25,
    // backgroundColor:Colors.WHITE
  },
});

export default CreateTaskNonCleaning;
