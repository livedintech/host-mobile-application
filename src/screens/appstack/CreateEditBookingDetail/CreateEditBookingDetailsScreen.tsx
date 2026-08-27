import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
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
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
import { useTranslation } from 'react-i18next';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import FormFooterActions from '@/components/molecules/FormFooterActions/FormFooterActions';

const AddBookingDetailsScreen = () => {
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
  } = useBookingDetailsContainer();
  const { t } = useTranslation();

  const yesNoOptions = [
    { label: t('common.yes'), value: 'Yes' },
    { label: t('common.no'), value: 'No' },
  ];
  const bookingTypeOptions = [
    { label: t('app.booking_details_edit.instant'), value: 'everyone' },
    { label: t('app.booking_details_edit.manual'), value: 'off' },
  ];
  const cleanlinessOptions = [
    { label: t('app.booking_details_edit.clean'), value: 'Clean' },
    { label: t('app.booking_details_edit.dirty'), value: 'Dirty' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <ButtonView onPress={() => goBack()}>
            <Svgicons path="back" size={40} />
          </ButtonView>
          {!isEdit && (
            <CircularProgress percentage={60} size={48} strokeWidth={4} />
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {isEdit ? (
            <AppText
              text={t('app.booking_details_edit.title_edit')}
              fontSize={32}
              type="Bold"
              mt={20}
              pr={80}
            />
          ) : (
            <>
              <AppText
                text={t('app.booking_details_edit.title_new')}
                fontSize={32}
                type="Bold"
                mt={5}
                pr={80}
                mt={20}
              />
            </>
          )}

          <View style={styles.formGroup}>
            <DropdownField
              name="booking_type"
              label={t('app.booking_details_edit.booking_type')}
              control={control as any}
              errors={errors}
              data={bookingTypeOptions}
            />
            <View style={styles.fieldGap} />
            <DropdownField
              name="guest_eligibility"
              label={t('app.booking_details_edit.guest_eligibility')}
              control={control as any}
              errors={errors}
              data={yesNoOptions}
            />
            <View style={styles.fieldGap} />
            <DateTimeInputField
              name="check_in_time"
              label={t('app.booking_details_edit.checkin_label')}
              control={control as any}
              errors={errors}
              mode="time"
              placeholder="09:00"
              hourOnly
            />
            <DateTimeInputField
              name="check_in_time_end"
              label={t('app.booking_details_edit.checkin_end_label')}
              control={control as any}
              errors={errors}
              mode="time"
              placeholder="12:00"
              hourOnly
            />
            <DateTimeInputField
              name="check_out_time"
              label={t('app.booking_details_edit.checkout_label')}
              control={control as any}
              errors={errors}
              mode="time"
              placeholder="23:00"
              hourOnly
            />
            <DropdownField
              name="allow_same_day"
              label={t('app.booking_details_edit.same_day_label')}
              control={control as any}
              errors={errors}
              data={yesNoOptions}
            />
            <View style={styles.fieldGap} />
            <DropdownField
              name="cleanliness_status"
              label={t('app.booking_details_edit.cleanliness_label')}
              control={control as any}
              errors={errors}
              data={cleanlinessOptions}
              placeholder={t(
                'app.booking_details_edit.cleanliness_placeholder',
              )}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <FormFooterActions
          // Primary: Export if Edit, otherwise Next
          primaryTitle={
            isEdit
              ? t('app.booking_details_edit.export')
              : t('app.booking_details_edit.next')
          }
          onPrimaryPress={isEdit ? handleExport : handleSubmit(onNext)}
          isPrimaryLoading={isLoading}
          isPrimaryDisabled={isLoading}
          // Secondary: Save & Exit
          secondaryTitle={t('app.booking_details_edit.save_exit')}
          onSecondaryPress={handleSubmit(onSaveExit)}
          isSecondaryLoading={isLoading}
          isSecondaryDisabled={isLoading}
          containerStyle={styles.footerOverride}
        />
        {/* ✅ Export Modal */}
        <ExportOtaSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          title={t('app.booking_details_edit.select_ota')}
          placeholder={t('app.booking_details_edit.select_account')}
          buttonText={t('app.booking_details_edit.export')}
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
  content: {
    paddingHorizontal: Metrics.baseMargin,
    paddingTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(200),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  backBtnWrapper: {
    width: 35,
    height: 35,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: { marginTop: 30 },
  fieldGap: { height: 20 },
  footerOverride: {
    // position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: Metrics.baseMargin,
    paddingBottom: 40,
  },
});

export default AddBookingDetailsScreen;
