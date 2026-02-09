import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import useUserManagementContainer from '../containers/UserManagementContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import { useWatch } from 'react-hook-form';
import PasswordField from '@/components/molecules/Input/PasswordField';
interface UserFormProps {
  mode: 'create' | 'edit';
}

const UserForm: React.FC<UserFormProps> = ({ mode }) => {


  const { control, errors, handleSubmit, onFormSubmit, isLoading, listingOptions, rolesOptions, roles } =
    useUserManagementContainer(mode);

  const selectedRoleId = useWatch({
    control,
    name: 'role',
  });

  const selectedRole = roles?.find(
    (item: { id: string }) => String(item.id) === String(selectedRoleId),
  );
  const isOperator = selectedRole?.role_type === 'operator';

  const isEdit = mode === 'edit';

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
            name="name"
            label="Name"
            control={control}
            errors={errors}
            placeholder="Ali Ahmed"
          />
          <InputField
            name="phone"
            label="Phone Number"
            control={control}
            errors={errors}
            placeholder="+966 501234 235"
            keyboardType="phone-pad"
            editable={!isEdit}
          />
          <InputField
            name="email"
            label="Email"
            control={control}
            errors={errors}
            placeholder="ali@example.com"
            keyboardType="email-address"
            editable={!isEdit}
          />
          {isOperator && (
            <PasswordField
              name="password"
              label="Password"
              control={control}
              errors={errors}
              placeholder="Enter password"
            />
          )}

          <DropdownField
            name="role"
            label="Role Assignment"
            control={control}
            errors={errors}
            data={rolesOptions}
            placeholder="Select Role"
          />
          <MultiSelectDropdownField
            dropdownPosition='top'
            name="listings"
            label="Listing Selection"
            control={control}
            errors={errors}
            data={listingOptions}
            placeholder="Select Multiple Options"
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
          loading={isLoading}
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
