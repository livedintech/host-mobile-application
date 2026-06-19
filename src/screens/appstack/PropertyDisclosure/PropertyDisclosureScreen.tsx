import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import usePropertyDisclosureContainer from './PropertyDisclosureContainer';
import { useTranslation } from 'react-i18next';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import FormFooterActions from '@/components/molecules/FormFooterActions/FormFooterActions';

const AddPropertyDisclosureScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading,
    isEdit,
    handleExport,
    handleExportSubmit,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting,
  } = usePropertyDisclosureContainer();
  const { t } = useTranslation();

  const options = [
    { label: t('common.yes'), value: 'Yes' },
    { label: t('common.no'), value: 'No' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <ButtonView onPress={() => goBack()}>
              <Svgicons path="back" size={40} />
            </ButtonView>
            {!isEdit && (
              <CircularProgress percentage={55} size={48} strokeWidth={4} />
            )}
          </View>

          <AppText
            text={
              isEdit
                ? t('app.property_disclosure.title_edit')
                : t('app.property_disclosure.title_new')
            }
            fontSize={28}
            type="SemiBold"
            mt={40}
            pr={40}
          />
          <AppText
            text={t('app.property_disclosure.subtitle')}
            fontSize={12}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mt={29}
          />

          <View style={styles.formGroup}>
            <DropdownField
              name="securityCameras"
              label={t('app.property_disclosure.cameras_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.property_disclosure.select_placeholder')}
              data={options}
            />
            <View style={styles.fieldGap} />
            <DropdownField
              name="noiseMonitor"
              label={t('app.property_disclosure.noise_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.property_disclosure.select_placeholder')}
              data={options}
            />
            <View style={styles.fieldGap} />
            <DropdownField
              name="weaponsOnProperty"
              label={t('app.property_disclosure.weapons_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.property_disclosure.select_placeholder')}
              data={options}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <FormFooterActions
          // Primary Action: Export if edit mode, Next if creation mode
          primaryTitle={
            isEdit
              ? t('app.property_disclosure.export')
              : t('app.property_disclosure.next')
          }
          onPrimaryPress={isEdit ? handleExport : handleSubmit(onNext)}
          isPrimaryLoading={isLoading}
          isPrimaryDisabled={isLoading}
          // Secondary Action
          secondaryTitle={t('app.property_disclosure.save_exit')}
          onSecondaryPress={handleSubmit(onSaveExit)}
          isSecondaryLoading={isLoading}
          isSecondaryDisabled={isLoading}
          containerStyle={styles.footerOverride}
        />
        {/* ✅ Export Modal */}
        <ExportOtaSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          title={t('app.property_disclosure.select_ota')}
          placeholder={t('app.property_disclosure.select_account')}
          buttonText={t('app.property_disclosure.export')}
          otaControl={otaControl}
          otaErrors={otaErrors}
          handleOtaSubmit={handleOtaSubmit}
          handleExportSubmit={handleExportSubmit}
          listingOptions={listingOptions}
          isPending={isPendingExporting}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 200 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backBtnWrapper: {
    width: 35,
    height: 35,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: { marginTop: 40 },
  fieldGap: { height: 25 },
  footerOverride: {
    // position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 25,
    paddingBottom: 40,
  },
});

export default AddPropertyDisclosureScreen;
