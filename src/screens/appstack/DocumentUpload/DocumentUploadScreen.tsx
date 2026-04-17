// DocumentUploadScreen.tsx
import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, TouchableOpacity, Modal } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
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
    isCreating,
  } = useCreateEditListingDocumentUploadContainer();

  const renderUploadButton = (
    label: string,
    fieldName: 'propertyOwnership' | 'authorityLicense' | 'nationalId',
    document: any,
  ) => (
    <View style={styles.uploadSection}>
      <AppText text={label} fontSize={16} type="SemiBold" mb={12} />

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickDocument(fieldName)}
        activeOpacity={0.7}
      >
        <Svgicons path="attachmentIcon" size={24} />
        <AppText text="Upload PDF" fontSize={16} />
      </TouchableOpacity>

      {document && (
        <View style={styles.uploadedFile}>
          <View style={styles.fileInfo}>
            <Svgicons path="checkCircleIcon" size={20} />
            <AppText
              text={document.name}
              fontSize={14}
              color={Colors.PINE_FOREST}
              ml={8}
              style={{ flex: 1 }}
            />
          </View>
          <TouchableOpacity onPress={() => removeDocument(fieldName)}>
            <Svgicons path="greenCross" size={15} />
          </TouchableOpacity>
        </View>
      )}

      {errors[fieldName] && (
        <AppText
          text={errors[fieldName]?.message as string}
          fontSize={13}
          color={Colors.INDIAN_RED}
          mt={5}
        />
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
            {!isEdit && <CircularProgress percentage={95} size={48} strokeWidth={4} />}
          </View>

          {/* Title */}
          <AppText
            text="Upload ownership licence documents"
            fontSize={26}
            type="SemiBold"
            mb={30}
            pr={80}
          />

          {/* Info */}
          <View style={styles.infoBox}>
            <AppText text="• Accepted formats: PDF." fontSize={12} color={Colors.DARK_CHARCOAL_OPACITY} mb={4} />
            <AppText text="• File size ≤ 10 MB per document." fontSize={12} color={Colors.DARK_CHARCOAL_OPACITY} />
          </View>

          {/* Upload Sections */}
          {renderUploadButton('Property Ownership / Rental Documents*', 'propertyOwnership', propertyOwnershipDoc)}
          {renderUploadButton('Authority license', 'authorityLicense', authorityLicenseDoc)}
          {renderUploadButton('Aqama / National ID', 'nationalId', nationalIdDoc)}

          {/* Footer */}
          <View style={styles.footer}>
            {/* ✅ Export sirf create mode mein show hoga */}
            {!isEdit && (
              <AppButton
                title="Export"
                variant="secondary"
                onPress={handleExport}
                disabled={isLoading}
              />
            )}
            <AppButton
              title="Save & Exit"
              mt={!isEdit ? 15 : 0}
              onPress={handleSubmit(onSaveExit)}
              loading={isLoading}
            />
          </View>

        </ScrollView>

        {/* Bottom Sheet Modal — sirf create mode mein */}
        {!isEdit && (
          <Modal
            visible={bottomSheetVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setBottomSheetVisible(false)}
          >
            <Pressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
              <Pressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>

                <View style={styles.handleBar} />

                <AppText
                  text="Select OTA Account"
                  fontSize={20}
                  type="SemiBold"
                  color={Colors.PINE_FOREST}
                  mb={20}
                />

                <View style={{ paddingBottom: Metrics.verticalScale(30) }}>
                  <DropdownField
                    name="ota_account"
                    control={otaControl}
                    errors={otaErrors}
                    label=""
                    data={listingOptions}
                    placeholder="Select Account"
                    dropdownPosition="top"
                  />
                </View>

                <AppButton
                  title="Export"
                  onPress={handleOtaSubmit(handleExportSubmit)}
                  mt={20}
                  loading={isLoadingChannelList || isCreating}
                />
              </Pressable>
            </Pressable>
          </Modal>
        )}

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
  infoBox: { marginBottom: 30 },
  uploadSection: { marginBottom: 25 },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    borderRadius: 18,
    gap: 10,
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
  footer: { marginTop: 10 },
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
});

export default DocumentUploadScreen;