import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, SafeAreaView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import DropdownField from '@/components/molecules/Input/DropdownField';
import InputField from '@/components/molecules/Input/InputField'; // Aapka component
import PhoneInputField from '@/components/molecules/Input/PhoneInputField'; // Aapka component
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useProfileContainer from './ProfileContainer';
import Metrics from '@/utility/Metrics';
import AccountDeleteModal from '@/components/molecules/AccountDeleteModal/AccoutDeleteModal';
import { useAuthStore } from '@/store/useAuthStore';

const ProfileScreen = () => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const { logout } = useAuthStore();
  const { control, errors, handleSubmit, onSave,goToChangePassword, deleteAccount, isDeleting } = useProfileContainer();

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    console.log("Account Deleted");
    deleteAccount();
    // Trigger your delete API here
  };

  return (
    <View style={styles.container}>
      {/* Decorative Background */}
      <View style={styles.bgCircle} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Profile Image Placeholder */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarInner}>
            <View style={{
              borderWidth: 1,
              borderColor: Colors.HYPER_SILVER,
              width: 81,
              height: 81,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12

            }}>
              <Svgicons path="imageUploadIcon" size={40} />

            </View>
          </View>
        </View>

        {/* Form Fields using your Custom Components */}
        <View style={styles.form}>

          <InputField
            name="full_name"
            label="Full Name"
            control={control}
            errors={errors}
            placeholder="Tooba J"
          />

          <DropdownField
            name="gender"
            control={control}
            errors={errors}
            label="Gender"
            data={[{ label: 'Female', value: 'Female' }, { label: 'Male', value: 'Male' }]}
          />

          <DropdownField
            name="country"
            control={control}
            errors={errors}
            label="Country"
            data={[{ label: 'Saudi Arabia', value: 'Saudi Arabia' }]}
          />

          <DropdownField
            name="city"
            control={control}
            errors={errors}
            label="City"
            data={[{ label: 'Medina', value: 'Medina' }, { label: 'Riyadh', value: 'Riyadh' }]}
          />

          <InputField
            name="address"
            label="Permanent Address"
            control={control}
            errors={errors}
            placeholder="XYZ"
          />

          {/* Aapka Phone Input Component */}
          <PhoneInputField
            label="Phone Number"
            control={control}
            errors={errors}
            countryFieldName="phone_country"
            phoneFieldName="phone_number"
            disabled
          />

          {/* Secondary Action Buttons */}
          <View style={styles.rowButtons}>
            <AppButton title="Change Password" onPress={goToChangePassword} style={styles.halfBtn} />
            <AppButton title="Delete Account" loading={isDeleting} onPress={() => setDeleteModalVisible(true)} style={styles.halfBtn} />
          </View>

          <AppButton
            title="Save Changes"
            onPress={handleSubmit(onSave)}
            mt={20}
          />
        </View>
      </ScrollView>
      <AccountDeleteModal
        isVisible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title="Are you sure you want to delete your account?"
        description="This action is permanent and cannot be undone."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  bgCircle: { position: 'absolute', top: -150, alignSelf: 'center', width: 500, height: 500, borderRadius: 250, borderWidth: 1, borderColor: '#F5F5F5', zIndex: -1 },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },
  avatarContainer: { alignSelf: 'center', marginTop: 20, marginBottom: 30 },
  avatarInner: { width: Metrics.scale(160), height: Metrics.scale(160), borderRadius: 100, backgroundColor: Colors.RICH_WHITE, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EBEBEB' },
  form: { flex: 1 },
  rowButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  halfBtn: { width: '48%' }
});

export default ProfileScreen;