import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import useBookingCancelPoliciesContainer from './BookingCancelPoliciesContainer';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const AddBookingCancelPoliciesScreen = () => {
  const {
    control, errors, handleSubmit, onNext, onSaveExit, isLoading, isEdit,
    handleExport, handleExportSubmit, bottomSheetVisible, setBottomSheetVisible,
    otaControl, otaErrors, handleOtaSubmit, listingOptions, isPendingExporting,
  } = useBookingCancelPoliciesContainer();
  const { t } = useTranslation();

  const policyOptions = [
    { label: 'Flexible - Guests can cancel at least 24 hours before check-in', value: 'flexible' },
    { label: 'Moderate - Guests can cancel at least 5 days before check-in',   value: 'moderate' },
    { label: 'Strict - No refunds for cancellations',                           value: 'strict'   },
  ];
  const AirbnbOptions = [
  {
    label: 'Flexible - Full refund at least 1 day before check-in, partial refund within 1 day',
    value: 'flexible',
  },
  {
    label: 'Moderate - Full refund at least 5 days before check-in, partial refund within 5 days',
    value: 'moderate',
  },
  {
    label: 'Limited - Full refund at least 14 days before check-in, partial refund 7–14 days before check-in',
    value: 'strict_14_with_grace_period',
  },
  {
    label: 'Firm - Full refund at least 30 days before check-in, partial refund 7–30 days before check-in',
    value: 'better_strict_with_grace_period',
  },
  {
    label: 'Super Strict 30 Days - No full refund, partial refund 30+ days before check-in',
    value: 'super_strict_30',
  },
  {
    label: 'Super Strict 60 Days - No full refund, partial refund 60+ days before check-in',
    value: 'super_strict_60',
  },
];

const AirbnblongTermOptions = [
  {
    label: 'Firm Long Term - Full refund up to 30 days before check-in, after that first 30 days non-refundable',
    value: 'CANCEL_LONG_TERM_FAIR',
  },
  {
    label: 'Strict Long Term - Full refund within 48 hours of booking (if 28+ days before check-in), after that first 30 days non-refundable',
    value: 'CANCEL_LONG_TERM_WITH_GRACE_PERIOD',
  },
];
  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.headerRow}>
            <ButtonView onPress={() => goBack()}>
                       <Svgicons path="back" size={40} />
                     </ButtonView>
            {!isEdit && <CircularProgress percentage={70} size={48} strokeWidth={4} />}
          </View>

          <AppText
            text={isEdit ? t('app.booking_cancel_policies.title_edit') : t('app.booking_cancel_policies.title_new')}
            fontSize={28}
            type="Bold"
            mt={30}
            pr={100}
          />

          <View style={styles.formGroup}>
            <DropdownField name="airbnb_policy" label="Airbnb" control={control as any} errors={errors} data={AirbnbOptions} placeholder={t('app.booking_cancel_policies.flexible_placeholder')} />
            <View style={styles.fieldGap} />
            <DropdownField name="airbnb_longterm_policy" label="Airbnb Long-term" control={control as any} errors={errors} data={AirbnblongTermOptions} placeholder={t('app.booking_cancel_policies.longterm_placeholder')} />
            <View style={styles.fieldGap} />
            <DropdownField name="gathern_policy" label="Gathern" control={control as any} errors={errors} data={policyOptions} placeholder={t('app.booking_cancel_policies.flexible_placeholder')} />
            <View style={styles.fieldGap} />
            <DropdownField name="booking_com_policy" label="Booking.com" control={control as any} errors={errors} data={policyOptions} placeholder={t('app.booking_cancel_policies.flexible_placeholder')} />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {/* ✅ Export — sirf edit mode mein */}
          {isEdit && (
            <AppButton
              title={t('app.booking_cancel_policies.export')}
              onPress={handleExport}
              variant='secondary'
              mb={12}
            />
          )}
          {!isEdit && (
            <AppButton
              backgroundColor={Colors.WHITE}
              title={t('app.booking_cancel_policies.next')}
              variant="secondary"
              onPress={handleSubmit(onNext)}
              loading={isLoading}
            />
          )}
          <AppButton
            title={t('app.booking_cancel_policies.save_exit')}
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
          <AppPressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
            <AppPressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.handleBar} />
              <AppText text={t('app.booking_cancel_policies.select_ota')} fontSize={20} type="SemiBold" color={Colors.PINE_FOREST} mb={20} />
              <View style={{ paddingBottom: Metrics.verticalScale(30) }}>
                <DropdownField
                  name="ota_account"
                  control={otaControl}
                  errors={otaErrors}
                  label=""
                  data={listingOptions}
                  placeholder={t('app.booking_cancel_policies.select_account')}
                  dropdownPosition="top"
                />
              </View>
              <AppButton
                title={t('app.booking_cancel_policies.export')}
                onPress={handleOtaSubmit(handleExportSubmit)}
                mt={20}
                loading={isPendingExporting}
                backgroundColor="#00A68A"
                borderColor="transparent"
                color={Colors.WHITE}
              />
            </AppPressable>
          </AppPressable>
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

export default AddBookingCancelPoliciesScreen;