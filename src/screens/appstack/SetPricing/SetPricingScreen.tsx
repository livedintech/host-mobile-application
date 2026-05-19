import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
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
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const SetPricingScreen = () => {
  const { t } = useTranslation();
  const { control, errors, handleSubmit, onSubmit, isLoading, isEdit, bottomSheetVisible, handleExport, handleExportSubmit, handleOtaSubmit, isExporting, listingOptions, otaControl, otaErrors, setBottomSheetVisible, } = usePricingContainer();

  const currencyOptions = [
    { label: t('app.set_pricing.riyal_sar'), value: 'SAR' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bottomOffset={0}
          automaticallyAdjustKeyboardInsets={false}
        >
          <View style={styles.headerRow}>
            <ButtonView onPress={() => goBack()}>
              <Svgicons path="back" size={40} />
            </ButtonView>
            {!isEdit && <CircularProgress percentage={80} size={48} strokeWidth={4} />}
          </View>

          <AppText text={t('app.set_pricing.title')} fontSize={32} type="Bold" mt={30} />
          <AppText
            text={t('app.set_pricing.subtitle')}
            fontSize={14}
            color="#6B6B6B"
            mt={10}
          />

          <View style={styles.formGroup}>
            <DropdownField name="currency" label={t('app.set_pricing.currency_label')} control={control as any} errors={errors} data={currencyOptions} disabled />
            <View style={styles.fieldGap} />
            <InputField name="weekday_price" label={t('app.set_pricing.weekday_label')} control={control as any} errors={errors} placeholder={t('app.set_pricing.price_placeholder')} keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="weekend_price" label={t('app.set_pricing.weekend_label')} control={control as any} errors={errors} placeholder={t('app.set_pricing.price_placeholder')} keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="tax_vat" label={t('app.set_pricing.tax_label')} control={control as any} errors={errors} placeholder={t('app.set_pricing.percent_placeholder')} keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="airbnb_markup" label={t('app.set_pricing.airbnb_markup_label')} control={control as any} errors={errors} placeholder={t('app.set_pricing.percent_placeholder')} keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="gathern_markup" label={t('app.set_pricing.gathern_markup_label')} control={control as any} errors={errors} placeholder={t('app.set_pricing.percent_placeholder')} keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="booking_com_markup" label={t('app.set_pricing.bookingcom_markup_label')} control={control as any} errors={errors} placeholder={t('app.set_pricing.percent_placeholder')} keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="extra_guest_fee" label={t('app.set_pricing.extra_guest_label')} control={control as any} errors={errors} placeholder={t('app.set_pricing.extra_guest_placeholder')} keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="cleaning_fee" label={t('app.set_pricing.cleaning_fee_label')} control={control as any} errors={errors} placeholder={t('app.set_pricing.cleaning_fee_placeholder')} keyboardType="numeric" />
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.footer}>
          {isEdit && (
            <AppButton
              title={t('app.set_pricing.export')}
              onPress={handleExport}
              variant='secondary'
              mb={12}
            />
          )}
          {!isEdit && ( // ✅ create mode mein Next show hoga
            <AppButton
              title={t('app.set_pricing.next')}
              variant="secondary"
              onPress={handleSubmit((d) => onSubmit(d, false))}
              loading={isLoading}
            />
          )}
          <AppButton
            title={t('app.set_pricing.save_exit')}
            mt={!isEdit ? 12 : 0}
            onPress={handleSubmit((d) => onSubmit(d, true))}
            disabled={isLoading}
          />
        </View>
      </View>
      <Modal
        visible={bottomSheetVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setBottomSheetVisible(false)}
      >
        <AppPressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
          <AppPressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
            <AppText text={t('app.set_pricing.select_ota')} fontSize={18} type="SemiBold" mb={20} />
            <DropdownField
              name="ota_account"
              control={otaControl}
              errors={otaErrors}
              data={listingOptions}
              placeholder={t('app.set_pricing.select_account')}
              dropdownPosition='top'
            />

            <AppButton
              title={t('app.set_pricing.export')}
              onPress={handleOtaSubmit(handleExportSubmit)}
              loading={isExporting}
              mt={20}
            />

          </AppPressable>
        </AppPressable>
      </Modal>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: Metrics.verticalScale(60) }, // footer ke liye space
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  formGroup: { marginTop: 30 },
  fieldGap: { height: 20 },
  footer: {
    width: '100%',
    padding: 25,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingBottom: 40
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },

  bottomSheet: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,        // ✅ yahi left/right space ka issue tha
  },
});

export default SetPricingScreen;