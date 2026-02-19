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

const CreateTaskScreen = () => {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText
            text="Create New Task"
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
          label="Task Name:"
          placeholder="Enter task name"
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
          label="Task Description"
          descriptionLength={wordCount}
          wordLimit={250}
          sparkleIcon
          multiline
          rules={{
            required: 'Please provide a task description',
            maxLength: {
              value: 250,
              message: 'Description cannot exceed 250 words',
            },
          }}
        />

        <DropdownField
          name="task_type_id"
          control={control}
          errors={errors}
          label="Category"
          data={categoryOptions}
          rules={{ required: 'Please select a task category' }}
        />

        {/* This Dropdown will now auto-fill because listing_id is set in the Container's useEffect */}
        <DropdownField
          name="listing_id"
          control={control}
          errors={errors}
          label="Listing Selection"
          data={listingOptions}
          placeholder="Select Listing"
          rules={{ required: 'Please select a listing' }}
        />

        {!isCleaningCategory && (
          <>
            <DateTimeInputField
              name="start_date"
              control={control}
              errors={errors}
              label="Select Date"
              placeholder="Select Date"
              mode="date"
              rules={{ required: 'Date is required' }}
            />
            <DateTimeInputField
              name="start_time"
              control={control}
              errors={errors}
              label="Select Start Time"
              placeholder="Select Start Time"
              mode="time"
              rules={{ required: 'Start time is required' }}
            />
            <DateTimeInputField
              name="end_time"
              control={control}
              errors={errors}
              label="Select End Time"
              placeholder="Select End Time"
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
            label="Assign Task"
            placeholder="Select User"
            data={userOptions}
            rules={{ required: 'Please assign this task to a vendor' }}
          />
        </View>

        <AppButton
          title="Next"
          onPress={onSubmitForm}
          loading={isPending}
          disabled={isPending}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
