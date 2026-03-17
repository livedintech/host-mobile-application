import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Image, Modal, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import DropdownField from '@/components/molecules/Input/DropdownField';
import InputField from '@/components/molecules/Input/InputField';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useProfileContainer from './ProfileContainer';
import Metrics from '@/utility/Metrics';
import AccountDeleteModal from '@/components/molecules/AccountDeleteModal/AccoutDeleteModal';
import ImageCropPicker from 'react-native-image-crop-picker';

const ProfileScreen = () => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const {
    control, errors, handleSubmit, onSave,
    goToChangePassword, deleteAccount, isDeleting,
    isLoading, currentProfilePic, onImageSelect,
  } = useProfileContainer();

  const displayImage = localImage || currentProfilePic || null;

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    deleteAccount();
  };

  // ✅ Common image handler
  const handleImageResult = (image: any) => {
    setLocalImage(image.path);
    onImageSelect({
      uri: image.path,
      type: image.mime || 'image/jpeg',
      name: `profile_${Date.now()}.jpg`,
    });
    setImageModalVisible(false);
  };

  // ✅ Gallery se
  const handleOpenGallery = () => {
    ImageCropPicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
      compressImageQuality: 0.8,
    }).then(handleImageResult).catch(() => setImageModalVisible(false));
  };

  // ✅ Camera se
  const handleOpenCamera = () => {
    ImageCropPicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
      compressImageQuality: 0.8,
    }).then(handleImageResult).catch(() => setImageModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Avatar */}
        <Pressable onPress={() => setImageModalVisible(true)} style={styles.avatarContainer}>
          <View style={styles.avatarInner}>
            {displayImage ? (
              <Image
                source={{ uri: displayImage }}
                style={{ width: '100%', height: '100%', borderRadius: 100 }}
              />
            ) : (
              <View style={styles.placeholderBox}>
                <Svgicons path="imageUploadIcon" size={40} />
              </View>
            )}
            {/* Edit Badge */}
            <View style={styles.editBadge}>
              <Svgicons path="editIcon" size={12} />
            </View>
          </View>
        </Pressable>

        {/* Form */}
        <View style={styles.form}>
          <InputField name="full_name" label="Full Name" control={control} errors={errors} placeholder="Tooba J" />
          <DropdownField name="gender" control={control} errors={errors} label="Gender" data={[{ label: 'Female', value: 'Female' }, { label: 'Male', value: 'Male' }]} />
          <DropdownField name="country" control={control} errors={errors} label="Country" data={[{ label: 'Saudi Arabia', value: 'Saudi Arabia' }]} />
          <DropdownField name="city" control={control} errors={errors} label="City" data={[{ label: 'Medina', value: 'Medina' }, { label: 'Riyadh', value: 'Riyadh' }]} />
          <InputField name="address" label="Permanent Address" control={control} errors={errors} placeholder="XYZ" />
          <PhoneInputField label="Phone Number" control={control} errors={errors} countryFieldName="phone_country" phoneFieldName="phone_number" disabled />

          <View style={styles.rowButtons}>
            <AppButton title="Change Password" onPress={goToChangePassword} style={styles.halfBtn} />
            <AppButton title="Delete Account" loading={isDeleting} onPress={() => setDeleteModalVisible(true)} style={styles.halfBtn} />
          </View>

          <AppButton title="Save Changes" onPress={handleSubmit(onSave)} mt={20} loading={isLoading} />
        </View>
      </ScrollView>

      {/* ✅ Image Picker Bottom Sheet */}
      <Modal
        visible={isImageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setImageModalVisible(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />

            <AppText text="Upload Photo" type="SemiBold" fontSize={16} mb={20} />
            {/* Gallery Button */}
            <AppButton onPress={handleOpenGallery} title="Choose from Gallery" mb={10}/>

            {/* Camera Button */}
            <AppButton onPress={handleOpenCamera} title="Take a Photo" mb={10}/>

            {/* Cancel */}
            <AppButton
              title="Cancel"
              onPress={() => setImageModalVisible(false)}
              mt={10}
              backgroundColor={Colors.BRUNSWICK_GREEN}
              color={Colors.WHITE}
            />
          </View>
        </TouchableOpacity>
      </Modal>

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
  placeholderBox: { borderWidth: 1, borderColor: Colors.HYPER_SILVER, width: 81, height: 81, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  editBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: Colors.WHITE, borderRadius: 20, padding: 5, borderWidth: 1, borderColor: '#EBEBEB', elevation: 2 },
  form: { flex: 1 },
  rowButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  halfBtn: { width: '48%' },

  // ✅ Bottom Sheet styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: Colors.WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  optionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cancelBtn: { backgroundColor: '#F5F5F5' },
});

export default ProfileScreen;