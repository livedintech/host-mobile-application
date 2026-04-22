import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import useBookingRulesContainer from './BookingRulesContainer';
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

const AddBookingRulesScreen = () => {
  const {
    control, errors, handleSubmit, onNext, onSaveExit, isLoading, isEdit,
    handleExport, handleExportSubmit, bottomSheetVisible, setBottomSheetVisible,
    otaControl, otaErrors, handleOtaSubmit, listingOptions, isPendingExporting,
  } = useBookingRulesContainer();

  const yesNoOptions = [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }];
  const numberOptions = Array.from({ length: 365 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }));
  const gapNightOptions = Array.from({ length: 30 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }));

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
            {!isEdit && <CircularProgress percentage={65} size={48} strokeWidth={4} />}
          </View>

          <AppText text={isEdit ? "Booking rules" : "Add booking rules"} fontSize={28} type="Bold" mt={30} />

          <View style={styles.formGroup}>
            <DropdownField name="long_term_stay" label="Long term Stay" control={control as any} errors={errors} data={yesNoOptions} />
            <View style={styles.fieldGap} />
            <DropdownField name="min_gap_night" label="Minimum Gap Night" control={control as any} errors={errors} data={gapNightOptions} placeholder="1" />
            <View style={styles.fieldGap} />
            <DropdownField name="min_night_stay" label="Minimum Night Stay" control={control as any} errors={errors} data={numberOptions} placeholder="2" />
            <View style={styles.fieldGap} />
            <DropdownField name="max_night_stay" label="Maximum Night Stay" control={control as any} errors={errors} data={numberOptions} placeholder="2" />
          </View>
        </ScrollView>

      

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
              <AppText text="Select OTA Account" fontSize={20} type="SemiBold" color={Colors.PINE_FOREST} mb={20} />
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
                loading={isPendingExporting}
                backgroundColor="#00A68A"
                borderColor="transparent"
                color={Colors.WHITE}
              />
            </Pressable>
          </Pressable>
        </Modal>

      </View>
        {/* Footer */}
        <View style={styles.footer}>
          {/* ✅ Export — sirf edit mode mein */}
          {isEdit && (
            <AppButton
              title="Export"
              onPress={handleExport}
              variant='secondary'
              mb={12}
            />
          )}
          {!isEdit && (
            <AppButton
              title="Next"
              variant="secondary"
              onPress={handleSubmit(onNext)}
              loading={isLoading}
              backgroundColor={Colors.WHITE}
            />
          )}
          <AppButton
            title="Save & Exit"
            mt={12}
            onPress={handleSubmit(onSaveExit)}
            disabled={isLoading}
          />
        </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container:      { flex: 1, paddingHorizontal: Metrics.baseMargin, paddingTop: 10 },
  content:        { paddingBottom: Metrics.verticalScale(50) },
  headerRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  formGroup:      { marginTop: 40 },
  fieldGap:       { height: 25 },
  footer:         { width: '100%', padding: Metrics.baseMargin, paddingBottom: 40 },
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

export default AddBookingRulesScreen;