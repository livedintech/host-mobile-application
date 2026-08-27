import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import InputField from '@/components/molecules/Input/InputField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import CreateTaskContainer from '../../containers/CreateTask/CreateTaskContainer';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';

const CreateTaskScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  // Extract the listing_id from the navigation params
  const preSelectedListingId = route.params?.listing_id;

  const {
    control,
    errors,
    onSubmitForm,
    categoryOptions,
    listingOptions,
    userOptions,
    isCleaningCategory,
    wordCount,
    isPending,
  } = CreateTaskContainer(preSelectedListingId, route.params);

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <AppText
          text={t('app.task_management.create_task_title')}
          fontSize={24}
          type="Bold"
          color={Colors.PINE_FOREST}
        />
        <Svgicons path="File_Document" size={30} />
      </View>

      <InputField
        name="title"
        control={control}
        errors={errors}
        label={t('app.task_management.task_name_label')}
        placeholder={t('app.task_management.task_name_placeholder')}
        rules={{
          required: 'Task name is required', // This is your appropriate error message
          minLength: {
            value: 3,
            message: 'Title must be at least 3 characters long',
          },
        }}
      />

      <TextareaField
        name="description"
        control={control}
        errors={errors}
        label={t('app.task_management.task_desc_label')}
        descriptionLength={wordCount}
        wordLimit={250}
        sparkleIcon
        multiline
        rules={{
          required: 'Please provide a task description',
          maxLength: {
            value: 500,
            message: 'Description cannot exceed 250 words',
          },
        }}
      />

      <DropdownField
        name="task_type_id"
        control={control}
        errors={errors}
        label={t('app.task_management.category_label')}
        data={categoryOptions}
        rules={{ required: 'Please select a task category' }}
      />

      {/* This Dropdown will now auto-fill because listing_id is set in the Container's useEffect */}
      <DropdownField
        name="listing_id"
        control={control}
        errors={errors}
        label={t('app.task_management.listing_label')}
        data={listingOptions}
        placeholder={t('app.task_management.listing_placeholder')}
        rules={{ required: 'Please select a listing' }}
      />

      {!isCleaningCategory && (
        <>
          <DateTimeInputField
            name="start_date"
            control={control}
            errors={errors}
            label={t('app.task_management.date_label')}
            placeholder={t('app.task_management.date_placeholder')}
            mode="date"
            rules={{ required: 'Date is required' }}
          />
          <DateTimeInputField
            name="start_time"
            control={control}
            errors={errors}
            label={t('app.task_management.start_time_label')}
            placeholder={t('app.task_management.start_time_placeholder')}
            mode="time"
            rules={{ required: 'Start time is required' }}
          />
          <DateTimeInputField
            name="end_time"
            control={control}
            errors={errors}
            label={t('app.task_management.end_time_label')}
            placeholder={t('app.task_management.end_time_placeholder')}
            mode="time"
            rules={{ required: 'End time is required' }}
          />
        </>
      )}

      <View style={styles.dropdownSection}>
        <DropdownField
          name="vendor_id"
          control={control}
          errors={errors}
          label={t('app.task_management.assign_task_label')}
          placeholder={t('app.task_management.select_user')}
          data={userOptions}
          rules={{ required: 'Please assign this task to a vendor' }}
        />
      </View>

      <AppButton
        title={t('app.task_management.next')}
        onPress={onSubmitForm}
        loading={isPending}
        disabled={isPending}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: {
    paddingHorizontal: Metrics.scale(16),
    paddingVertical: Metrics.verticalScale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Metrics.verticalScale(24),
    gap: 8,
  },
  dropdownSection: { marginBottom: Metrics.verticalScale(18) },
});

export default CreateTaskScreen;
