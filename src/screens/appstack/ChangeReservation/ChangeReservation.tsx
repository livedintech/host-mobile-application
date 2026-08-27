import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Colors } from '@/theme/colors';
import { vs, s } from 'react-native-size-matters';
import DropdownField from '@/components/molecules/Input/DropdownField';
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ChangeReservationContainer from './ChangeReservationContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import InputField from '@/components/molecules/Input/InputField';
import { useTranslation } from 'react-i18next';

const ChangeReservation = () => {
  const {
    listingOptions,
    control,
    errors,
    watch,
    setValue,
    handleSubmit,
    isUpdating,
  } = ChangeReservationContainer();
  const { t } = useTranslation();

  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [showPriceSheet, setShowPriceSheet] = useState(false);

  // 1. Local state for the date validation error
  const [dateError, setDateError] = useState<string | null>(null);

  const currentDates = watch('dates');
  const currentPrice = watch('basePrice');

  // 2. Updated logic to check if dates are identical
  const handleSaveDetails = () => {
    const start = watch('start_date');
    const end = watch('end_date');

    if (!start || !end) return;

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Same date validation
    if (startDate.getTime() === endDate.getTime()) {
      setDateError(t('app.change_reservation.date_error'));
      return;
    }

    // End date cannot be before start date
    if (endDate < startDate) {
      setDateError(t('app.change_reservation.end_date_before_start_error'));
      return;
    }

    setValue('dates', `${start} - ${end}`);
    setDateError(null);
    setShowDetailsSheet(false);
  };

  // Reset error when opening the sheet
  const openDetailsSheet = () => {
    setDateError(null);
    setShowDetailsSheet(true);
  };

  const today = new Date();
  const minStartDate = today;
  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <AppText
            text={t('app.change_reservation.page_title')}
            type="Bold"
            fontSize={28}
            mb={vs(30)}
          />

          <DropdownField
            name="listing_id"
            label={t('app.change_reservation.change_listing')}
            control={control as any}
            errors={errors}
            data={listingOptions}
          />

          <GlassCard width="100%" style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <AppText
                text={t('app.change_reservation.reservation_details')}
                type="Bold"
                fontSize={16}
              />
              <ButtonView onPress={openDetailsSheet}>
                <Svgicons path="pencil" size={20} />
              </ButtonView>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <AppText
                  text={t('app.change_reservation.dates')}
                  fontSize={12}
                  color={Colors.BLACK}
                />
                <AppText
                  text={currentDates}
                  fontSize={14}
                  type="Medium"
                  color="#333333F0"
                />
              </View>
            </View>
          </GlassCard>

          <GlassCard width="100%" style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <AppText
                text={t('app.change_reservation.guest_charges')}
                type="Bold"
                fontSize={16}
              />
              <ButtonView onPress={() => setShowPriceSheet(true)}>
                <Svgicons path="pencil" size={20} />
              </ButtonView>
            </View>
            <AppText
              text={t('app.change_reservation.base_price')}
              fontSize={12}
              color={Colors.BLACK}
            />
            <AppText
              text={`SR${currentPrice}`}
              fontSize={14}
              type="Medium"
              color="#333333F0"
            />
          </GlassCard>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title={t('app.change_reservation.send_request')}
            backgroundColor={Colors.PRIMARY_TEAL}
            borderRadius={25}
            onPress={handleSubmit}
            loading={isUpdating}
            disabled={isUpdating}
          />
        </View>

        {/* ─── Edit Reservation Details Bottom Sheet ─── */}
        <Modal visible={showDetailsSheet} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHeader}>
                <AppText
                  text={t('app.change_reservation.edit_details_title')}
                  type="Medium"
                  fontSize={20}
                />
                <TouchableOpacity onPress={() => setShowDetailsSheet(false)}>
                  <Svgicons path="crossIcon" size={30} />
                </TouchableOpacity>
              </View>

              <DateTimeInputField
                name="start_date"
                label={t('app.change_reservation.start_date')}
                mode="date"
                control={control as any}
                errors={errors}
                rightIcon={<Svgicons path="CalendarBlack" size={18} />}
                minimumDate={minStartDate}
              />

              <DateTimeInputField
                minimumDate={minStartDate}
                name="end_date"
                label={t('app.change_reservation.end_date')}
                mode="date"
                control={control as any}
                errors={errors}
                rightIcon={<Svgicons path="CalendarBlack" size={18} />}
              />

              {/* 3. Display the Error Message */}
              {dateError && (
                <View style={styles.errorContainer}>
                  <AppText text={dateError} color="red" fontSize={12} />
                </View>
              )}

              <AppButton
                title={t('app.change_reservation.save')}
                backgroundColor={Colors.PRIMARY_TEAL}
                onPress={handleSaveDetails}
                mt={vs(10)}
              />
            </View>
          </View>
        </Modal>

        {/* ─── Edit Guest Charges Bottom Sheet ─── */}
        <Modal visible={showPriceSheet} transparent animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalOverlay}>
                <View style={styles.bottomSheet}>
                  <View style={styles.sheetHeader}>
                    <AppText
                      text={t('app.change_reservation.edit_charges_title')}
                      type="Bold"
                      fontSize={18}
                    />
                    <TouchableOpacity onPress={() => setShowPriceSheet(false)}>
                      <Svgicons path="crossIcon" size={30} />
                    </TouchableOpacity>
                  </View>

                  <InputField
                    name="basePrice"
                    label={t('app.change_reservation.base_price')}
                    control={control as any}
                    errors={errors}
                    placeholder={t(
                      'app.change_reservation.base_price_placeholder',
                    )}
                  />

                  <AppText
                    text={t('app.change_reservation.price_hint')}
                    fontSize={12}
                    color={Colors.DARK_CHARCOAL}
                    mb={vs(5)}
                  />
                  <AppText
                    text={t('app.change_reservation.similar_listings')}
                    fontSize={12}
                    color={Colors.DARK_CHARCOAL_OPACITY_74}
                    mb={vs(20)}
                  />

                  <AppButton
                    title={t('app.change_reservation.save')}
                    backgroundColor={Colors.PRIMARY_TEAL}
                    onPress={() => setShowPriceSheet(false)}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: s(20) },
  detailCard: { padding: s(16), marginBottom: vs(15) },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  row: { flexDirection: 'row', marginTop: vs(5) },
  column: { flex: 1 },
  footer: { padding: s(20), paddingBottom: vs(30) },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.TRANSLUCENT_WHITE,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: s(30),
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(20),
  },
  // 4. Added error container style
  errorContainer: {
    marginTop: vs(-5),
    marginBottom: vs(10),
    paddingHorizontal: s(5),
  },
});

export default ChangeReservation;
