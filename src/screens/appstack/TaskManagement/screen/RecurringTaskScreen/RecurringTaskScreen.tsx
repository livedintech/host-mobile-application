import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { navigate, goBack } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import DropdownField from '@/components/molecules/Input/DropdownField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';

const RecurringTaskScreen = () => {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listing: [],
      assignUser: '',
    },
  });

  // Mock data - replace with your actual data
  const listingData = [
    { label: 'Airbnb - Apartment 101', value: '1' },
    { label: 'Gathern - Villa 402', value: '2' },
  ];

  const userData = [
    { label: 'John Doe', value: 'u1' },
    { label: 'Jane Smith', value: 'u2' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <View style={styles.content}>
          {/* Title Section */}
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
              color={Colors.DARK_CHARCOAL_OPACITY}
              lineHeight={20}
              mb={32}
            />
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <MultiSelectDropdownField
              name="listing"
              label="Listing Selection"
              control={control}
              errors={errors}
              data={listingData}
              placeholder="Select Listing"
            />

            <DropdownField
              name="assignUser"
              label="Assign User"
              control={control}
              errors={errors}
              data={userData}
              placeholder="Select User"
            />

            {/* User Management Link */}
            <View style={styles.infoContainer}>
              <AppText
                fontSize={13}
                color={Colors.DARK_CHARCOAL_OPACITY}
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

          {/* Footer Section */}
          <View style={styles.footer}>
            <AppButton
              title="Next"
              backgroundColor={Colors.PRIMARY_TEAL}
              borderColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              fontSize={16}
              type="Regular"
              onPress={() => {
                navigate(NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL);
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
  header: {
    paddingHorizontal: Metrics.scale(20),
    marginTop: Metrics.verticalScale(10),
  },
  backButton: {
    width: Metrics.scale(44),
    height: Metrics.scale(44),
    borderRadius: 22,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: Metrics.scale(25),
    paddingTop: Metrics.verticalScale(20),
  },
  titleContainer: {
    marginBottom: Metrics.verticalScale(10),
  },
  formContainer: {
    flex: 1,
  },
  infoContainer: {
    marginTop: Metrics.verticalScale(-8),
    paddingRight: Metrics.scale(20),
  },
  footer: {
    marginBottom: Metrics.verticalScale(30),
  },
});

export default RecurringTaskScreen;
