import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
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
import Metrics from '@/utility/Metrics';

const AddPropertyDisclosureScreen = () => {
  const {
    control, errors, handleSubmit, onNext, onSaveExit, isLoading, isEdit,
    handleExport, handleExportSubmit, bottomSheetVisible, setBottomSheetVisible,
    otaControl, otaErrors, handleOtaSubmit, listingOptions, isPendingExporting,
  } = usePropertyDisclosureContainer();
  const { t } = useTranslation();

  const options = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No',  value: 'No'  },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <TouchableOpacity style={styles.backBtnWrapper} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </TouchableOpacity>
            </GradientBorder>
            {!isEdit && <CircularProgress percentage={55} size={48} strokeWidth={4} />}
          </View>

          <AppText
            text={isEdit ? t('app.property_disclosure.title_edit') : t('app.property_disclosure.title_new')}
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
            <DropdownField name="securityCameras" label={t('app.property_disclosure.cameras_label')} control={control as any} errors={errors} placeholder={t('app.property_disclosure.select_placeholder')} data={options} />
            <View style={styles.fieldGap} />
            <DropdownField name="noiseMonitor" label={t('app.property_disclosure.noise_label')} control={control as any} errors={errors} placeholder={t('app.property_disclosure.select_placeholder')} data={options} />
            <View style={styles.fieldGap} />
            <DropdownField name="weaponsOnProperty" label={t('app.property_disclosure.weapons_label')} control={control as any} errors={errors} placeholder={t('app.property_disclosure.select_placeholder')} data={options} />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {isEdit && (
            <AppButton
              title={t('app.property_disclosure.export')}
              onPress={handleExport}
              variant='secondary'
              mb={12}
            />
          )}
          {!isEdit && (
            <AppButton
              title={t('app.property_disclosure.next')}
              variant="secondary"
              onPress={handleSubmit(onNext)}
              loading={isLoading}
              backgroundColor={Colors.WHITE}
            />
          )}
          <AppButton
            title={t('app.property_disclosure.save_exit')}
            mt={12}
            onPress={handleSubmit(onSaveExit)}
            disabled={isLoading}
          />
        </View>

        {/* ✅ Export Modal */}
        <Modal
          visible={bottomSheetVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setBottomSheetVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
            <Pressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.handleBar} />
              <AppText text={t('app.property_disclosure.select_ota')} fontSize={20} type="SemiBold" color={Colors.PINE_FOREST} mb={20} />
              <View style={{ paddingBottom: Metrics.verticalScale(30) }}>
                <DropdownField
                  name="ota_account"
                  control={otaControl}
                  errors={otaErrors}
                  label=""
                  data={listingOptions}
                  placeholder={t('app.property_disclosure.select_account')}
                  dropdownPosition="top"
                />
              </View>
              <AppButton
                title={t('app.property_disclosure.export')}
                onPress={handleOtaSubmit(handleExportSubmit)}
                mt={20}
                loading={isPendingExporting}
                backgroundColor="#00A68A"
                borderColor="transparent"
                color={Colors.WHITE}
              />
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container:      { flex: 1 },
  content:        { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 200 },
  headerRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  formGroup:      { marginTop: 40 },
  fieldGap:       { height: 25 },
  footer:         { position: 'absolute', bottom: 0, width: '100%', padding: 25, paddingBottom: 40 },
  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: {
    backgroundColor:      Colors.WHITE,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingHorizontal:    24,
    paddingTop:           12,
    paddingBottom:        40,
  },
  handleBar: {
    width:           40,
    height:          5,
    backgroundColor: '#D4D4D4',
    borderRadius:    3,
    alignSelf:       'center',
    marginBottom:    25,
  },
});

export default AddPropertyDisclosureScreen;