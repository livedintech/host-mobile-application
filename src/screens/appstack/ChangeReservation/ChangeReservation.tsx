import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  SafeAreaView,
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
import InputField from '@/components/molecules/Input/InputField'; // Assuming you have a standard InputField

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

  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [showPriceSheet, setShowPriceSheet] = useState(false);

  // Watch values for UI display
  const currentDates = watch('dates');
  const currentPrice = watch('basePrice');
  const currentGuests = watch('guests');

  //   const guestOptions = [
  //     { label: '1', value: '1' },
  //     { label: '2', value: '2' },
  //     { label: '3', value: '3' },
  //     { label: '4', value: '4' },
  //   ];

  const handleSaveDetails = () => {
    const start = watch('start_date');
    const end = watch('end_date');
    if (start && end) {
      setValue('dates', `${start} - ${end}`);
    }
    setShowDetailsSheet(false);
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <AppText
            text="What do you want to change?"
            type="Bold"
            fontSize={28}
            mb={vs(30)}
          />

          <DropdownField
            name="listing_id"
            label="Change Listing"
            control={control as any}
            errors={errors}
            data={listingOptions}
          />

          {/* Reservation Details Card */}
          <GlassCard width="100%" style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <AppText text="Reservation Details" type="Bold" fontSize={16} />
              <ButtonView onPress={() => setShowDetailsSheet(true)}>
                <Svgicons path="pencil" size={20} />
              </ButtonView>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <AppText text="Dates" fontSize={12} color={Colors.BLACK} />
                <AppText
                  text={currentDates}
                  fontSize={14}
                  type="Medium"
                  color="#333333F0"
                />
              </View>
              {/* <View style={styles.column}>
                <AppText text="Guests" fontSize={12} color={Colors.BLACK} />
                <AppText text={currentGuests} fontSize={14} type="Medium" color='#333333F0'/>
              </View> */}
            </View>
          </GlassCard>

          {/* Guest Charges Card */}
          <GlassCard width="100%" style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <AppText text="Guest Charges" type="Bold" fontSize={16} />
              <ButtonView onPress={() => setShowPriceSheet(true)}>
                <Svgicons path="pencil" size={20} />
              </ButtonView>
            </View>
            <AppText text="Base Price" fontSize={12} color={Colors.BLACK} />
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
            title="Send Request"
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
                  text="Edit Reservation Details"
                  type="Medium"
                  fontSize={20}
                />
                <TouchableOpacity onPress={() => setShowDetailsSheet(false)}>
                  <Svgicons path="crossIcon" size={30} />
                </TouchableOpacity>
              </View>

              {/* <DropdownField
                name="guests"
                label="Number Of Guests"
                control={control as any}
                errors={errors}
                data={guestOptions}
              /> */}

              <DateTimeInputField
                name="start_date"
                label="Start Date"
                mode="date"
                control={control as any}
                errors={errors}
                rightIcon={<Svgicons path="CalendarBlack" size={18} />}
              />

              <DateTimeInputField
                name="end_date"
                label="End Date"
                mode="date"
                control={control as any}
                errors={errors}
                rightIcon={<Svgicons path="CalendarBlack" size={18} />}
              />

              <AppButton
                title="Save"
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
                <AppText text="Edit Guest Charges" type="Bold" fontSize={18} />
                <TouchableOpacity onPress={() => setShowPriceSheet(false)}>
                  <Svgicons path="crossIcon" size={30} />
                </TouchableOpacity>
              </View>

              <InputField
                name="basePrice"
                label="Base Price"
                control={control as any}
                errors={errors}
                placeholder="SAR 500"
              />

              <AppText
                text="SR499 - SR500 depending on promotions"
                fontSize={12}
                color={Colors.DARK_CHARCOAL}
                mb={vs(5)}
              />
              <AppText
                text="Similar listings SR86 - SR129"
                fontSize={12}
                color={Colors.DARK_CHARCOAL_OPACITY_74}
                mb={vs(20)}
              />

              <AppButton
                title="Save"
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
  // Modal Styles
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
});

export default ChangeReservation;
