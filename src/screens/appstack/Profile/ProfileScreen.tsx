import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Colors } from '@/theme/colors';
import DropdownField from '@/components/molecules/Input/DropdownField';
import InputField from '@/components/molecules/Input/InputField';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useProfileContainer from './ProfileContainer';
import Metrics from '@/utility/Metrics';
import AccountDeleteModal from '@/components/molecules/AccountDeleteModal/AccoutDeleteModal';
import { useAuthStore } from '@/store/useAuthStore';

const ProfileScreen = () => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const { user } = useAuthStore();
  
  const { 
    control, 
    errors, 
    handleSubmit, 
    onSave,
    goToChangePassword, 
    deleteAccount, 
    isDeleting, 
    countryOptions, 
    isCountriesLoading,
    onCountryChange,
    isCitiesLoading,
    cityOptions,
    selectedCountryId,
    watch,
    setValue
  } = useProfileContainer();

  // Watch profile_picture for real-time UI preview
  const profilePic = watch('profile_picture');

  const handlePickImage = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    }).then(image => {
      // Manually setting the object to match our schema
      setValue('profile_picture', {
        uri: image.path,
        name: image.filename || `profile_${Date.now()}.jpg`,
        type: image.mime,
      });
    }).catch(e => {
      if (e.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Failed to pick image');
      }
    });
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    deleteAccount();
  };

  return (
    <View style={styles.container}>
      {/* Decorative Background */}
      <View style={styles.bgCircle} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Image Section */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickImage} style={styles.avatarInner}>
            {profilePic?.uri || user?.profile_picture ? (
              <Image 
                source={{ uri: profilePic?.uri || user?.profile_picture }} 
                style={styles.avatarImage} 
              />
            ) : (
              <View style={styles.placeholderBox}>
                <Svgicons path="imageUploadIcon" size={40} />
              </View>
            )}
          </TouchableOpacity>
        </View>

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
            placeholder={isCountriesLoading ? "Fetching countries..." : "Select Country"}
            data={countryOptions}
            onSelect={onCountryChange}
          />

          <DropdownField
            name="city"
            control={control}
            errors={errors}
            label="City"
            placeholder={isCitiesLoading ? "Loading cities..." : "Select City"}
            data={cityOptions}
            disabled={!selectedCountryId || isCitiesLoading}
          />

          <InputField
            name="address"
            label="Permanent Address"
            control={control}
            errors={errors}
            placeholder="XYZ"
          />

          <PhoneInputField
            label="Phone Number"
            control={control}
            errors={errors}
            countryFieldName="phone_country"
            phoneFieldName="phone_number"
            disabled
          />

          {/* Action Buttons */}
          <View style={styles.rowButtons}>
            <AppButton title="Change Password" onPress={goToChangePassword} style={styles.halfBtn} />
            <AppButton title="Delete Account" loading={isDeleting} onPress={() => setDeleteModalVisible(true)} style={styles.halfBtn} />
          </View>

          <AppButton
            title="Save Changes"
            onPress={handleSubmit(onSave as any)}
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
  bgCircle: { 
    position: 'absolute', 
    top: -150, 
    alignSelf: 'center', 
    width: 500, 
    height: 500, 
    borderRadius: 250, 
    borderWidth: 1, 
    borderColor: '#F5F5F5', 
    zIndex: -1 
  },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },
  avatarContainer: { alignSelf: 'center', marginTop: 20, marginBottom: 30 },
  avatarInner: { 
    width: Metrics.scale(160), 
    height: Metrics.scale(160), 
    borderRadius: 100, 
    backgroundColor: Colors.RICH_WHITE, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#EBEBEB',
    overflow: 'hidden' 
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderBox: {
    // This centers the icon inside the avatar circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: { flex: 1, zIndex: 1 },
  rowButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  halfBtn: { width: '48%' },
});

export default ProfileScreen;