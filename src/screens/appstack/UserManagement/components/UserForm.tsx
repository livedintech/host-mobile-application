import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import { useWatch, Controller } from 'react-hook-form';
import useUserManagementContainer from '../containers/UserManagementContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Checkbox from '@/components/molecules/Input/CheckBox';

const UserForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const {
    control, errors, handleSubmit, onFormSubmit, isSubmitting,
    listingOptions, rolesOptions, staffRoleTypeOptions, roles,
    permissionToEditPhoneNumber
  } = useUserManagementContainer(mode);

  const isEdit = mode === 'edit';
  const assignAll = useWatch({ control, name: 'assignAllProperties' });
  const selectedRoleId = useWatch({ control, name: 'role' });

  // Check if selected role is "Operator/Staff"
  const selectedRole = roles?.find((r: any) => String(r.id) === String(selectedRoleId));
  const isOperator = selectedRole?.role_type === 'operator';

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <AppText text={isEdit ? 'Edit User' : 'Create New User'} fontSize={28} type="Bold" />
          </View>

          <View style={styles.formContainer}>
            <InputField name="name" label="Name" control={control} errors={errors} placeholder="Ahmed" />
            
            <PhoneInputField
              label="Phone Number*"
              control={control}
              errors={errors}
              countryFieldName="country"
              phoneFieldName="phoneNumber"
              disabled={permissionToEditPhoneNumber}
            />

            <InputField name="email" label="Email" control={control} errors={errors} placeholder="ahmed@example.com" editable={!isEdit} />

            <DropdownField 
              name="role" 
              label="Role Assignment" 
              control={control} 
              errors={errors} 
              data={rolesOptions} 
              placeholder="Select Role" 
            />

            {/* NEW: Staff Role Type Dropdown - Only shows if role is Operator */}
            {isOperator && (
              <MultiSelectDropdownField 
                name="staffRoleType" 
                label="Staff Role Type" 
                control={control} 
                errors={errors} 
                data={staffRoleTypeOptions} 
                placeholder="Select Staff Type" 
              />
            )}

            {isOperator && (
              <InputField 
                name="password" 
                label="Password" 
                control={control} 
                errors={errors} 
                placeholder="********" 
                // secureTextEntry 
              />
            )}

            {!assignAll && (
              <MultiSelectDropdownField
                name="listings"
                label="Select Property"
                control={control}
                errors={errors}
                data={listingOptions}
                placeholder="Select Multiple Options"
              />
            )}

            <View style={styles.checkboxRow}>
              <Controller
                control={control}
                name="assignAllProperties"
                render={({ field: { value, onChange } }) => (
                  <Checkbox isChecked={value} onPress={() => onChange(!value)} />
                )}
              />
              <AppText text="Assign this user all properties" fontSize={14} ml={10} />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title={isEdit ? 'Save & Exit' : 'Create New User'}
            onPress={handleSubmit(onFormSubmit)}
            backgroundColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            loading={isSubmitting}
            style={{ height: 50 }}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 120 },
  header: { marginBottom: 30 },
  formContainer: { gap: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25 },
});

export default UserForm;