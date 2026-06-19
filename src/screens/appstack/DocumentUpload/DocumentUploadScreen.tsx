import AppPressable from '@/components/atoms/AppPressable/AppPressable';
// DocumentUploadScreen.tsx
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack, navigateToRoot } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';
import useDocumentUploadContainer from './DocumentUploadContainer';
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
import { useTranslation } from 'react-i18next';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import FormFooterActions from '@/components/molecules/FormFooterActions/FormFooterActions';

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
  } = useDocumentUploadContainer();
  const { t } = useTranslation();

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
        <AppText text={t('app.document_upload.upload_pdf')} fontSize={16} />
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
        <View style={styles.headerRow}>
          <ButtonView onPress={() => goBack()}>
            <Svgicons path="back" size={40} />
          </ButtonView>
          {!isEdit && (
            <CircularProgress percentage={95} size={48} strokeWidth={4} />
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}

          {/* Title */}
          <AppText
            text={t('app.document_upload.title')}
            fontSize={26}
            type="SemiBold"
            mb={30}
            pr={80}
          />

          {/* Info */}
          <View style={styles.infoBox}>
            <AppText
              text={t('app.document_upload.format_hint')}
              fontSize={12}
              color={Colors.DARK_CHARCOAL_OPACITY}
              mb={4}
            />
            <AppText
              text={t('app.document_upload.size_hint')}
              fontSize={12}
              color={Colors.DARK_CHARCOAL_OPACITY}
            />
          </View>

          {/* Upload Sections */}
          {renderUploadButton(
            t('app.document_upload.property_ownership_label'),
            'propertyOwnership',
            propertyOwnershipDoc,
          )}
          {renderUploadButton(
            t('app.document_upload.authority_label'),
            'authorityLicense',
            authorityLicenseDoc,
          )}
          {renderUploadButton(
            t('app.document_upload.national_id_label'),
            'nationalId',
            nationalIdDoc,
          )}

   
        </ScrollView>

        <FormFooterActions
          // Primary Action: Export is always primary here per requirement
          primaryTitle={t('app.document_upload.export')}
          onPrimaryPress={handleExport}
          isPrimaryLoading={isLoading}
          isPrimaryDisabled={isLoading}

          // Secondary Action: Save & Exit
          secondaryTitle={t('app.document_upload.save_exit')}
          onSecondaryPress={handleSubmit(onSaveExit)}
          isSecondaryLoading={isLoading}
          isSecondaryDisabled={isLoading}
          containerStyle={styles.footerOverride}
        />

        {/* Bottom Sheet Modal — sirf create mode mein */}
        <ExportOtaSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          title={t('app.document_upload.select_ota')}
          placeholder={t('app.document_upload.select_account')}
          buttonText={t('app.document_upload.export')}
          otaControl={otaControl}
          otaErrors={otaErrors}
          handleOtaSubmit={handleOtaSubmit}
          handleExportSubmit={handleExportSubmit}
          listingOptions={listingOptions}
          isPending={isLoadingChannelList || isCreating}
        />
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
    paddingHorizontal: 25,
    paddingTop: 10,
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
footerOverride: {
    // position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 25,
    // backgroundColor: 'white',
    paddingBottom: 40,
  },});

export default DocumentUploadScreen;
