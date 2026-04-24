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
import { useTranslation } from 'react-i18next';

const UserForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const {
    control, errors, handleSubmit, onFormSubmit, isSubmitting,
    listingOptions, rolesOptions, staffRoleTypeOptions, roles,
    permissionToEditPhoneNumber
  } = useUserManagementContainer(mode);

  const { t } = useTranslation();
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
            <AppText text={isEdit ? t('app.user_form.title_edit') : t('app.user_form.title_create')} fontSize={28} type="Bold" />
          </View>
            <AppText text={isEdit ? '' : t('app.user_form.subtitle_create')} fontSize={12} color={"#333333A6"} type="Regular" mb={40}/>

          <View style={styles.formContainer}>
            <InputField name="name" label={t('app.user_form.name_label')} control={control} errors={errors} placeholder={t('app.user_form.name_placeholder')} />
            
            <PhoneInputField
              label={t('app.user_form.phone_label')}
              control={control}
              errors={errors}
              countryFieldName="country"
              phoneFieldName="phoneNumber"
              disabled={permissionToEditPhoneNumber}
            />

            <InputField name="email" label={t('app.user_form.email_label')} control={control} errors={errors} placeholder={t('app.user_form.email_placeholder')}
            // editable={!isEdit} 
            />

            <DropdownField 
              name="role" 
              label={t('app.user_form.role_label')}
              control={control}
              errors={errors}
              data={rolesOptions}
              placeholder={t('app.user_form.role_placeholder')}
            />

            {/* NEW: Staff Role Type Dropdown - Only shows if role is Operator */}
            {isOperator && (
              <MultiSelectDropdownField 
                name="staffRoleType" 
                label={t('app.user_form.staff_type_label')}
                control={control}
                errors={errors}
                data={staffRoleTypeOptions}
                placeholder={t('app.user_form.staff_type_placeholder')}
              />
            )}

            {isOperator && (
              <InputField 
                name="password" 
                label={t('app.user_form.password_label')}
                control={control}
                errors={errors}
                placeholder="********"
                // secureTextEntry 
              />
            )}

            {!assignAll && (
              <MultiSelectDropdownField
                name="listings"
                label={t('app.user_form.property_label')}
                control={control}
                errors={errors}
                data={listingOptions}
                placeholder={t('app.user_form.property_placeholder')}
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
              <AppText text={t('app.user_form.assign_all')} fontSize={14} ml={10} />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title={isEdit ? t('app.user_form.save_exit') : t('app.user_form.title_create')}
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
  header: { marginBottom: 10 },
  formContainer: { gap: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25 },
});

export default UserForm;