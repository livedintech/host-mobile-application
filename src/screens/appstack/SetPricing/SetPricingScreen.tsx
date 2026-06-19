import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import usePricingContainer from './SetPricingContainer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import Metrics from '@/utility/Metrics';
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import FormFooterActions from '@/components/molecules/FormFooterActions/FormFooterActions';

const SetPricingScreen = () => {
  const { t } = useTranslation();
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isLoading,
    isEdit,
    bottomSheetVisible,
    handleExport,
    handleExportSubmit,
    handleOtaSubmit,
    isExporting,
    listingOptions,
    otaControl,
    otaErrors,
    setBottomSheetVisible,
  } = usePricingContainer();

  const currencyOptions = [
    { label: t('app.set_pricing.riyal_sar'), value: 'SAR' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <ButtonView onPress={() => goBack()}>
            <Svgicons path="back" size={40} />
          </ButtonView>
          {!isEdit && (
            <CircularProgress percentage={80} size={48} strokeWidth={4} />
          )}
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bottomOffset={0}
          automaticallyAdjustKeyboardInsets={false}
        >
          <AppText
            text={t('app.set_pricing.title')}
            fontSize={32}
            type="Bold"
            mt={30}
          />
          <AppText
            text={t('app.set_pricing.subtitle')}
            fontSize={14}
            color="#6B6B6B"
            mt={10}
          />

          <View style={styles.formGroup}>
            <DropdownField
              name="currency"
              label={t('app.set_pricing.currency_label')}
              control={control as any}
              errors={errors}
              data={currencyOptions}
              disabled
            />
            <View style={styles.fieldGap} />
            <InputField
              name="weekday_price"
              label={t('app.set_pricing.weekday_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.set_pricing.price_placeholder')}
              keyboardType="numeric"
            />
            <View style={styles.fieldGap} />
            <InputField
              name="weekend_price"
              label={t('app.set_pricing.weekend_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.set_pricing.price_placeholder')}
              keyboardType="numeric"
            />
            <View style={styles.fieldGap} />
            <InputField
              name="tax_vat"
              label={t('app.set_pricing.tax_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.set_pricing.percent_placeholder')}
              keyboardType="numeric"
            />
            <View style={styles.fieldGap} />
            <InputField
              name="airbnb_markup"
              label={t('app.set_pricing.airbnb_markup_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.set_pricing.percent_placeholder')}
              keyboardType="numeric"
            />
            <View style={styles.fieldGap} />
            <InputField
              name="gathern_markup"
              label={t('app.set_pricing.gathern_markup_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.set_pricing.percent_placeholder')}
              keyboardType="numeric"
            />
            <View style={styles.fieldGap} />
            <InputField
              name="booking_com_markup"
              label={t('app.set_pricing.bookingcom_markup_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.set_pricing.percent_placeholder')}
              keyboardType="numeric"
            />
            <View style={styles.fieldGap} />
            <InputField
              name="extra_guest_fee"
              label={t('app.set_pricing.extra_guest_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.set_pricing.extra_guest_placeholder')}
              keyboardType="numeric"
            />
            <View style={styles.fieldGap} />
            <InputField
              name="cleaning_fee"
              label={t('app.set_pricing.cleaning_fee_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.set_pricing.cleaning_fee_placeholder')}
              keyboardType="numeric"
            />
          </View>
        </KeyboardAwareScrollView>

     <FormFooterActions
          // Primary Action: Export if edit mode, Next if creation mode
          primaryTitle={isEdit ? t('app.set_pricing.export') : t('app.set_pricing.next')}
          onPrimaryPress={isEdit ? handleExport : handleSubmit(d => onSubmit(d, false))}
          isPrimaryLoading={isLoading}
          isPrimaryDisabled={isLoading}

          // Secondary Action: Save & Exit
          secondaryTitle={t('app.set_pricing.save_exit')}
          onSecondaryPress={handleSubmit(d => onSubmit(d, true))}
          isSecondaryLoading={isLoading}
          isSecondaryDisabled={isLoading}
          containerStyle={styles.footerOverride}
        />
      </View>
      <ExportOtaSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        title={t('app.set_pricing.select_ota')}
        placeholder={t('app.set_pricing.select_account')}
        buttonText={t('app.set_pricing.export')}
        otaControl={otaControl}
        otaErrors={otaErrors}
        handleOtaSubmit={handleOtaSubmit}
        handleExportSubmit={handleExportSubmit}
        listingOptions={listingOptions}
        isPending={isExporting}
      />
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: Metrics.verticalScale(60),
  }, // footer ke liye space
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
  backBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: { marginTop: 30 },
  fieldGap: { height: 20 },
footerOverride: {
    // position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 25,
    // backgroundColor: 'rgba(255,255,255,0.95)',
    paddingBottom: 40,
  },
});

export default SetPricingScreen;
