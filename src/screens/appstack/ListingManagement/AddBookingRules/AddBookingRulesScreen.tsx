import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
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
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
import { useTranslation } from 'react-i18next';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import FormFooterActions from '@/components/molecules/FormFooterActions/FormFooterActions';

const AddBookingRulesScreen = () => {
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
  } = useBookingRulesContainer();
  const { t } = useTranslation();

  const yesNoOptions = [
    { label: t('common.yes'), value: 1 },
    { label: t('common.no'), value: 0 },
  ];
  const numberOptions = Array.from({ length: 365 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));
  const gapNightOptions = Array.from({ length: 30 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <ButtonView onPress={() => goBack()}>
            <Svgicons path="back" size={40} />
          </ButtonView>
          {!isEdit && (
            <CircularProgress percentage={65} size={48} strokeWidth={4} />
          )}
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <AppText
            text={
              isEdit
                ? t('app.booking_rules.title_edit')
                : t('app.booking_rules.title_new')
            }
            fontSize={28}
            type="Bold"
            mt={30}
          />

          <View style={styles.formGroup}>
            <DropdownField
              name="long_term_stay"
              label={t('app.booking_rules.long_term_label')}
              control={control as any}
              errors={errors}
              data={yesNoOptions}
            />
            <View style={styles.fieldGap} />
            <DropdownField
              name="min_gap_night"
              label={t('app.booking_rules.min_gap_label')}
              control={control as any}
              errors={errors}
              data={gapNightOptions}
              placeholder={t('app.booking_rules.placeholder_1')}
            />
            <View style={styles.fieldGap} />
            <DropdownField
              name="min_night_stay"
              label={t('app.booking_rules.min_night_label')}
              control={control as any}
              errors={errors}
              data={numberOptions}
              placeholder={t('app.booking_rules.placeholder_2')}
            />
            <View style={styles.fieldGap} />
            <DropdownField
              name="max_night_stay"
              label={t('app.booking_rules.max_night_label')}
              control={control as any}
              errors={errors}
              data={numberOptions}
              placeholder={t('app.booking_rules.placeholder_2')}
            />
          </View>
        </ScrollView>

        {/* ✅ Export Modal */}
        <ExportOtaSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          title={t('app.booking_rules.select_ota')}
          placeholder={t('app.booking_rules.select_account')}
          buttonText={t('app.booking_rules.export')}
          otaControl={otaControl}
          otaErrors={otaErrors}
          handleOtaSubmit={handleOtaSubmit}
          handleExportSubmit={handleExportSubmit}
          listingOptions={listingOptions}
          isPending={isPendingExporting}
        />
      </View>
      {/* Footer */}
      <FormFooterActions
        // Primary Action: Export if edit mode, Next if creation mode
        primaryTitle={
          isEdit ? t('app.booking_rules.export') : t('app.booking_rules.next')
        }
        onPrimaryPress={isEdit ? handleExport : handleSubmit(onNext)}
        isPrimaryLoading={isLoading}
        isPrimaryDisabled={isLoading}
        // Secondary Action
        secondaryTitle={t('app.booking_rules.save_exit')}
        onSecondaryPress={handleSubmit(onSaveExit)}
        isSecondaryLoading={isLoading}
        isSecondaryDisabled={isLoading}
        containerStyle={styles.footerOverride}
      />
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
  formGroup: { marginTop: 40 },
  fieldGap: { height: 25 },
  footerOverride: {
    width: '100%',
    padding: Metrics.baseMargin,
    paddingBottom: 40,
  },
});

export default AddBookingRulesScreen;
