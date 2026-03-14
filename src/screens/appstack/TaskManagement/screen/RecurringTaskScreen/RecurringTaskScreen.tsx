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
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import CreateTaskContainer from '../../container/CreateTaskContainer/CreateTaskContainer';

const RecurringTaskScreen = () => {
  // isLoading comes from useQuery in your container
  const { transformedListing, transformedVendor, onNextStep, isLoading } =
    CreateTaskContainer();

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
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <AppText
              text="Set up Recurring Cleaning Schedule"
              fontSize={28}
              type="Bold"
              lineHeight={32}
              mb={16}
              color={Colors.BLACK}
            />
            <AppText
              text="Select the listing and assign a team member. This cleaning task is set up once and will automatically appear in task management for every new booking."
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
              label="Listing Selection"
              data={transformedListing}
              placeholder="Select Listing"
              rules={{ required: 'Please select a listing' }}
            />

            <DropdownField
              name="assignUser"
              label="Assign User"
              control={control}
              errors={errors}
              data={transformedVendor}
              placeholder="Select User"
              rules={{ required: 'Assigning a user is required' }}
              disabled={isLoading}
            />

            <View style={styles.infoContainer}>
              <AppText
                fontSize={13}
                color={Colors.DARK_CHARCOAL_OPACITY_80}
                lineHeight={18}
              >
                Select a user to continue. If you can’t find the user, create
                one in More →{' '}
                <AppText
                  text="User Management."
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
              title="Next"
              loading={isLoading}
              backgroundColor={Colors.PRIMARY_TEAL}
              borderColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              fontSize={16}
              type="Regular"
              onPress={handleSubmit(onNextStep)}
            />
          </View>
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Metrics.scale(25),
    paddingTop: Metrics.verticalScale(50),
  },
  titleContainer: { marginBottom: Metrics.verticalScale(10) },
  formContainer: { flex: 1 },
  infoContainer: {
    marginTop: Metrics.verticalScale(-8),
    paddingRight: Metrics.scale(20),
  },
  footer: { marginBottom: Metrics.verticalScale(30) },
});

export default RecurringTaskScreen;
