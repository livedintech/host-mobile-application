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

const VALIDATION_RULES = {
  REQUIRED: { required: 'Required' },
};

const CreateTaskNonCleaning = () => {
  const {
    transformedListing,
    transformedVendor,
    transformedCategory,
    isLoading,
    onNextStep,
  } = CreateTaskContainer();

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
          <AppText text="Create New Task" fontSize={32} type="Bold" mb={12} />
          <AppText
            text="Create a task for your property. Cleaning tasks are recurring by default. For other tasks, select a date and set the start and end time."
            fontSize={14}
            color={Colors.DARK_CHARCOAL_OPACITY}
            lineHeight={20}
            mb={24}
          />

          <View style={styles.formContainer}>
            <DropdownField
              label="Listing Selection"
              name="listing"
              control={control}
              data={transformedListing}
              placeholder="Select Listing"
              errors={errors}
              rules={VALIDATION_RULES.REQUIRED}
            />

            <DropdownField
              label="Category"
              name="category"
              control={control}
              data={transformedCategory}
              placeholder="Select Category"
              errors={errors}
              rules={VALIDATION_RULES.REQUIRED}
            />

            <DateTimeInputField
              label="Select Date"
              name="date"
              mode="date"
              control={control}
              errors={errors}
              placeholder="mm/dd/yy"
              rightIcon={calendarIcon}
              rules={VALIDATION_RULES.REQUIRED}
            />

            <View style={{ flex: 1 }}>
              <DateTimeInputField
                label="Select Start Time"
                name="startTime"
                mode="time"
                control={control}
                errors={errors}
                placeholder="-- : --"
                rightIcon={clockIcon}
                rules={VALIDATION_RULES.REQUIRED}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DateTimeInputField
                label="Select End Time"
                name="endTime"
                mode="time"
                control={control}
                errors={errors}
                placeholder="-- : --"
                rightIcon={clockIcon}
                rules={VALIDATION_RULES.REQUIRED}
              />
            </View>

            <DropdownField
              label="Assign User"
              name="assignUser"
              control={control}
              data={transformedVendor}
              placeholder="Select User"
              errors={errors}
              rules={VALIDATION_RULES.REQUIRED}
            />

            <View style={styles.hintContainer}>
              <AppText
                fontSize={12}
                color={Colors.DARK_CHARCOAL_OPACITY}
                lineHeight={18}
              >
                Select a user to continue. If you can't find the user, either
                create one or assign property to an existing user in More →{' '}
                <AppText
                  text="User Management."
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
            title="Next"
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
