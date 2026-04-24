import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import useBookingDetailsContainer from './CreateEditBookingDetailsContainer';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';

const AddBookingDetailsScreen = () => {
  const {
    control, errors, handleSubmit, onNext, onSaveExit, isLoading, isEdit,
    handleExport, handleExportSubmit, bottomSheetVisible, setBottomSheetVisible,
    otaControl, otaErrors, handleOtaSubmit, listingOptions, isPendingExporting,
  } = useBookingDetailsContainer();
  const { t } = useTranslation();

  const yesNoOptions      = [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }];
  const bookingTypeOptions = [{ label: 'Instant', value: 'Instant' }, { label: 'Manual', value: 'Manual' }];
  const cleanlinessOptions = [{ label: 'Clean', value: 'Clean' }, { label: 'Dirty', value: 'Dirty' }];

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
            {!isEdit && <CircularProgress percentage={60} size={48} strokeWidth={4} />}
          </View>

          {isEdit ? (
            <AppText text={t('app.booking_details_edit.title_edit')} fontSize={32} type="Bold" mt={20} pr={80} />
          ) : (
            <>
              <AppText text={t('app.booking_details_edit.step_label')} fontSize={18} type="Medium" mt={20} />
              <AppText text={t('app.booking_details_edit.title_new')} fontSize={32} type="Bold" mt={5} pr={80} />
            </>
          )}

          <View style={styles.formGroup}>
            <DropdownField name="booking_type" label={t('app.booking_details_edit.booking_type')} control={control as any} errors={errors} data={bookingTypeOptions} />
            <View style={styles.fieldGap} />
            <DropdownField name="guest_eligibility" label={t('app.booking_details_edit.guest_eligibility')} control={control as any} errors={errors} data={yesNoOptions} />
            <View style={styles.fieldGap} />
            <DateTimeInputField name="check_in_time" label={t('app.booking_details_edit.checkin_label')} control={control as any} errors={errors} mode="time" placeholder="09:00" />
            <DateTimeInputField name="check_out_time" label={t('app.booking_details_edit.checkout_label')} control={control as any} errors={errors} mode="time" placeholder="23:00" />
            <DropdownField name="allow_same_day" label={t('app.booking_details_edit.same_day_label')} control={control as any} errors={errors} data={yesNoOptions} />
            <View style={styles.fieldGap} />
            <DropdownField name="cleanliness_status" label={t('app.booking_details_edit.cleanliness_label')} control={control as any} errors={errors} data={cleanlinessOptions} placeholder={t('app.booking_details_edit.cleanliness_placeholder')} />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {/* ✅ Export — sirf edit mode mein */}
          {isEdit && (
            <AppButton
              title={t('app.booking_details_edit.export')}
              onPress={handleExport}
              variant='secondary'
              mb={12}
              backgroundColor={Colors.WHITE}
            />
          )}
          {!isEdit && (
            <AppButton
              title={t('app.booking_details_edit.next')}
              variant="secondary"
              backgroundColor={Colors.WHITE}
              onPress={handleSubmit(onNext)}
              loading={isLoading}
            />
          )}
          <AppButton
            title={t('app.booking_details_edit.save_exit')}
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
              <AppText text={t('app.booking_details_edit.select_ota')} fontSize={20} type="SemiBold" color={Colors.PINE_FOREST} mb={20} />
              <View style={{ paddingBottom: Metrics.verticalScale(30) }}>
                <DropdownField
                  name="ota_account"
                  control={otaControl}
                  errors={otaErrors}
                  label=""
                  data={listingOptions}
                  placeholder={t('app.booking_details_edit.select_account')}
                  dropdownPosition="top"
                />
              </View>
              <AppButton
                title={t('app.booking_details_edit.export')}
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
  content:        { paddingHorizontal: Metrics.baseMargin, paddingTop: Metrics.verticalScale(20), paddingBottom: Metrics.verticalScale(200) },
  headerRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  formGroup:      { marginTop: 30 },
  fieldGap:       { height: 20 },
  footer:         { position: 'absolute', bottom: 0, width: '100%', padding: Metrics.baseMargin, paddingBottom: 40 },
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

export default AddBookingDetailsScreen;