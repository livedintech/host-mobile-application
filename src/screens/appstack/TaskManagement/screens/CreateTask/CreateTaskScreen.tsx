import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import InputField from '@/components/molecules/Input/InputField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import AppButton from '@/components/molecules/AppButton/AppButton';

import CreateTaskContainer from '../../containers/CreateTask/CreateTaskContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const CreateTaskScreen = () => {
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
  } = CreateTaskContainer();

  const handleAddVendor = () => {
    navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, { mode: 'create' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText
            text="Create New Task"
            fontSize={24}
            type="Bold"
            color={Colors.PINE_FOREST}
          />
          <Svgicons path="File_Document" size={30} />
        </View>

        {/* Task Name Field */}
        <InputField
          name="title"
          control={control}
          errors={errors}
          label="Task Name:"
          placeholder="Enter task name"
          rules={{
            required: 'Task name is required',
            minLength: {
              value: 3,
              message: 'Task name must be at least 3 characters',
            },
          }}
        />

        {/* Task Description Field */}
        <TextareaField
          name="description"
          control={control}
          errors={errors}
          label="Task Description"
          placeholder="Enter task description"
          multiline
          descriptionLength={wordCount}
          wordLimit={250}
          rules={{
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters',
            },
          }}
        />

        {/* Category Dropdown */}
        <DropdownField
          name="task_type_id"
          control={control}
          errors={errors}
          label="Category"
          data={categoryOptions}
          placeholder="Select Category"
          rules={{ required: 'Category is required' }}
        />

        {/* Listing Selection Dropdown */}
        <DropdownField
          name="listing_id"
          control={control}
          errors={errors}
          label="Listing Selection"
          data={listingOptions}
          placeholder="Select Listing"
          rules={{ required: 'Listing selection is required' }}
        />

        {/* Conditional Fields - Only show if NOT cleaning */}
        {!isCleaningCategory && (
          <>
            {/* Select Date Field */}
            <DateTimeInputField
              name="start_date"
              control={control}
              errors={errors}
              label="Select Date"
              placeholder="mm/dd/yy"
              mode="date"
              leftIcon={
                <Svgicons
                  path="Calendar_Days"
                  width={16}
                  height={16}
                  color={Colors.BRUNSWICK_GREEN}
                />
              }
              rules={{ required: 'Date is required' }}
            />

            {/* Select Start Time Field */}
            <DateTimeInputField
              name="start_time"
              control={control}
              errors={errors}
              label="Select Start Time"
              placeholder="--:--"
              mode="time"
              leftIcon={
                <Svgicons
                  path="Clock"
                  width={16}
                  height={16}
                  color={Colors.BRUNSWICK_GREEN}
                />
              }
              rules={{ required: 'Start time is required' }}
            />

            {/* Select End Time Field */}
            <DateTimeInputField
              name="end_time"
              control={control}
              errors={errors}
              label="Select End Time"
              placeholder="--:--"
              mode="time"
              leftIcon={
                <Svgicons
                  path="Clock"
                  width={16}
                  height={16}
                  color={Colors.BRUNSWICK_GREEN}
                />
              }
              rules={{ required: 'End time is required' }}
            />
          </>
        )}

        {/* Assign Task Section */}
        <View style={styles.dropdownSection}>
          <DropdownField
            name="vendor_id"
            control={control}
            errors={errors}
            label="Assign Task"
            data={userOptions}
            placeholder="Select User"
            rules={{ required: 'User assignment is required' }}
          />

          {userOptions.length === 0 && (
            <ButtonView
              onPress={handleAddVendor}
              style={styles.emptyVendorAction}
            >
              <View style={styles.actionContent}>
                <Svgicons path="plusIcon" size={12} color={Colors.PINE_FOREST} />
                <AppText
                  text="No User found. Add a User here."
                  fontSize={13}
                  color={Colors.PINE_FOREST}
                  type="Bold"
                  ml={8}
                />
              </View>
            </ButtonView>
          )}
        </View>

        {/* Next Button */}
        <AppButton
          title="Next"
          onPress={onSubmitForm}
          backgroundColor={Colors.WHITE}
          borderColor={Colors.ARGENT}
          color={Colors.PINE_FOREST}
          style={styles.nextButton}
          loading={isPending}
          disabled={isPending}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollContent: {
    paddingHorizontal: Metrics.scale(16),
    paddingVertical: Metrics.verticalScale(16),
    paddingBottom: Metrics.verticalScale(24),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Metrics.verticalScale(24),
    gap: 8,
  },
  nextButton: {
    marginTop: Metrics.verticalScale(24),
    marginBottom: Metrics.verticalScale(8),
  },
  dropdownSection: {
    marginBottom: Metrics.verticalScale(18),
  },
  emptyVendorAction: {
    backgroundColor: '#F0F7F4', // A very light green/mint to match PINE_FOREST theme
    borderWidth: 1,
    borderTopWidth: 0, // Removes top border so it merges with dropdown
    borderColor: Colors.SMOOTH_GREY,
    marginTop: Metrics.verticalScale(-19), // Pulls it up to sit flush against the dropdown
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: Metrics.verticalScale(12),
    paddingHorizontal: Metrics.scale(16),
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreateTaskScreen;
