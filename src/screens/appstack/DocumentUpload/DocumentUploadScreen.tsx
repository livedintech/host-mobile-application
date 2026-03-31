import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, TouchableOpacity, Modal } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack } from '@/services/navigationService';
import useCreateEditListingDocumentUploadContainer from './DocumentUploadContainerNew';
import Metrics from '@/utility/Metrics';
import BGImage from '@/components/molecules/BGImage/BGImage';

const DocumentUploadScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onSaveExit,
    isEdit,
    isLoading,
    propertyOwnershipDoc,
    authorityLicenseDoc,
    nationalIdDoc,
    pickDocument,
    removeDocument,
    handleExport,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    handleExportSubmit,
    listingOptions,
    isLoadingChannelList,
    isCreating
  } = useCreateEditListingDocumentUploadContainer();

  const renderUploadButton = (
    label: string,
    fieldName: 'propertyOwnership' | 'authorityLicense' | 'nationalId',
    document: any
  ) => (
    <View style={styles.uploadSection}>
      <AppText text={label} fontSize={16} type="SemiBold" color={Colors.PINE_FOREST} mb={12} />

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickDocument(fieldName)}
        activeOpacity={0.7}
      >
        <AppText text="Upload Pdf" fontSize={16} color={Colors.PINE_FOREST} />
        <Svgicons path="attachmentIcon" size={24} />
      </TouchableOpacity>

      {document && (
        <View style={styles.uploadedFile}>
          <View style={styles.fileInfo}>
            <Svgicons path="checkCircleIcon" size={20} />
            <AppText text={document.name} fontSize={14} color={Colors.PINE_FOREST} ml={8} style={{ flex: 1 }} />
          </View>
          <TouchableOpacity onPress={() => removeDocument(fieldName)}>
            <Svgicons path="closeCircleIcon" size={20} />
          </TouchableOpacity>
        </View>
      )}

      {errors[fieldName] && (
        <AppText text={errors[fieldName]?.message as string} fontSize={13} color={Colors.INDIAN_RED} mt={5} />
      )}
    </View>
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
              <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
                <Svgicons path="arrowLeftIcon" size={24} />
              </Pressable>
            </GradientBorder>
            <View style={styles.wavyCheck}>
              <Svgicons path='wavy_check' size={20} />
            </View>
          </View>

          {/* Title */}
          <AppText
            text="Upload Ownership Licence Documents"
            fontSize={26}
            type="SemiBold"
            color={Colors.BRUNSWICK_GREEN}
            textAlign="center"
            mb={30}
          />

          {/* Info */}
          <View style={styles.infoBox}>
            <AppText text="• Accepted formats: PDF." fontSize={13} color={Colors.SUPER_GREY} mb={4} />
            <AppText text="• File size ≤ 10 MB per document." fontSize={13} color={Colors.SUPER_GREY} />
          </View>

          {/* Upload Sections */}
          {renderUploadButton('Property Ownership / Rental Documents*', 'propertyOwnership', propertyOwnershipDoc)}
          {renderUploadButton('Authority license', 'authorityLicense', authorityLicenseDoc)}
          {renderUploadButton('Aqama / National ID', 'nationalId', nationalIdDoc)}
          <View style={styles.footer}>
            {/* <AppButton title="Export" onPress={handleExport} /> */}
            <AppButton
              title="Save & Exit"
              onPress={handleSubmit(onSaveExit)}
              loading={isLoading}
            // mt={15}
            />
          </View>
        </ScrollView>

        {/* Bottom Sheet Modal */}
        <Modal
          visible={bottomSheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setBottomSheetVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
            <Pressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>

              {/* Handle Bar */}
              <View style={styles.handleBar} />

              <AppText text="Select OTA Account" fontSize={20} type="SemiBold" color={Colors.PINE_FOREST} mb={20} />

              {/* OTA Account Dropdown */}
              <View style={{
                paddingBottom: Metrics.verticalScale(30)
              }}>
                <DropdownField
                  name="ota_account"
                  control={otaControl}
                  errors={otaErrors}
                  label=""
                  data={listingOptions}
                  placeholder="Select Account"
                  dropdownPosition='top'
                />
              </View>
              {/* Export Button */}
              <AppButton title="Export" onPress={handleOtaSubmit(handleExportSubmit)} mt={20} loading={isLoadingChannelList || isCreating} />

            </Pressable>
          </Pressable>
        </Modal>

      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    marginBottom: 30,
  },
  uploadSection: {
    marginBottom: 25,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    borderRadius: 30,
    backgroundColor: Colors.WHITE,
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // footer: { marginTop: 30 },

  // Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.SMOOTH_GREY,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  wavyCheck: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    width: Metrics.scale(48),
    height: Metrics.scale(48),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default DocumentUploadScreen;