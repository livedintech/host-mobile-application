import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useWatch } from 'react-hook-form'; // Add this import
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import useUserManagementContainer, {
  ROLE_OPTIONS,
  LISTING_OPTIONS,
  STAFF_TYPE_OPTIONS,
} from '../containers/UserManagementContainer';
import { goBack } from '@/services/navigationService';

interface UserFormProps {
  mode: 'create' | 'edit';
  userId?: string;
}

const UserForm: React.FC<UserFormProps> = ({ mode, userId }) => {
  const { control, errors, handleSubmit, onFormSubmit } =
    useUserManagementContainer(mode, userId);

  // WATCH HERE: MultiSelect returns an array, so we check if 'owner' is IN the array
  const selectedRoles = useWatch({
    control,
    name: 'role',
  });

  // Check if selectedRoles is an array and contains 'owner'
  const showStaffRoleType =
    Array.isArray(selectedRoles) && selectedRoles.includes('owner');

  const isEdit = mode === 'edit';

  console.log('Current Selected Roles:', selectedRoles);
  console.log('showStaffRoleType:', showStaffRoleType);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <AppText
            text={isEdit ? 'Edit User Management' : 'Create User Management'}
            fontSize={23}
            type="Bold"
            color={Colors.PINE_FOREST}
            mr={10}
          />
          <Svgicons path="userManagementIcon" size={30} />
        </View>

        <View style={styles.formContainer}>
          <InputField
            name="username"
            label="Username"
            control={control}
            errors={errors}
            placeholder="Ali Ahmed"
            rules={{ required: 'Username is required' }}
          />
          <InputField
            name="phoneNumber"
            label="Phone Number"
            control={control}
            errors={errors}
            placeholder="+966 501234 235"
            keyboardType="phone-pad"
            rules={{ required: 'Phone number is required' }}
          />
          <InputField
            name="email"
            label="Email"
            control={control}
            errors={errors}
            placeholder="ali@example.com"
            keyboardType="email-address"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
          />

          <MultiSelectDropdownField
            name="role"
            label="Role Assignment"
            control={control}
            errors={errors}
            data={ROLE_OPTIONS}
            placeholder="Select Role"
            rules={{ required: 'Please select a role' }}
          />

          {showStaffRoleType && (
            <MultiSelectDropdownField
              name="staffRoleType"
              label="Staff Role Type"
              control={control}
              errors={errors}
              data={STAFF_TYPE_OPTIONS}
              placeholder="Select Staff Roles"
              rules={{ required: 'Please select at least one staff type' }}
            />
          )}

          <MultiSelectDropdownField
            name="listings"
            label="Listing Selection"
            control={control}
            errors={errors}
            data={LISTING_OPTIONS}
            placeholder="Select Multiple Options"
            rules={{ required: 'Please select at least one listing' }}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title={isEdit ? 'Update User' : 'Create New User'}
          onPress={handleSubmit(onFormSubmit)}
          backgroundColor={Colors.WHITE}
          borderColor={Colors.ARGENT}
          color={Colors.PINE_FOREST}
        />
      </View>
    </View>
  );
};

export default UserForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 120 },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  formContainer: { marginTop: 10 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingBottom: 40,
    backgroundColor: Colors.WHITE,
  },
});
