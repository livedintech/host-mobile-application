import React from 'react';
import { StyleSheet, View, Pressable, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { useWatch } from 'react-hook-form';
import BottomSheetComponent from '@/components/molecules/BottomSheetComponent/BottomSheetComponent';
import AppText from '@/components/molecules/AppText/AppText';
import DropdownField from '@/components/molecules/Input/DropdownField';
import InputField from '@/components/molecules/Input/InputField';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import AppButton from '../AppButton/AppButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import PhoneInputField from '../Input/PhoneInputField';

interface Props {
  isLoading?: boolean;
  isVisible: boolean;
  onClose: () => void;
  bookingType: string;
  setBookingType: (type: string) => void;
  control: any;
  errors: any;
  listingOptions: any[];
  selectedListingId: string;
  onSubmit: () => void;
}

export const CreateBookingSheet = ({
  isVisible,
  onClose,
  bookingType,
  setBookingType,
  control,
  errors,
  listingOptions,
  selectedListingId,
  onSubmit,
  isLoading
}: Props) => {
  const today = new Date();
  const startDateValue = useWatch({ control, name: 'start_date' });
  const minStartDate = today;
  const minEndDate = startDateValue ? new Date(startDateValue) : today;

  return (
    <BottomSheetComponent isVisible={isVisible} onClose={onClose}>
      <View style={styles.grabZone} pointerEvents="box-none" />

      <KeyboardAwareScrollView
        style={styles.flex1}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <AppText 
            text={bookingType === 'direct' ? "Create Direct Booking" : "Manage Pricing"} 
            type="Bold" 
            fontSize={22} 
            color={Colors.BLACK} 
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Svgicons path="closeIcon" size={20} />
          </TouchableOpacity>
        </View>
        {/* Type Selector */}
        <View style={styles.radioRow}>
          {['direct', 'pricing'].map((type) => (
            <Pressable disabled={isLoading} key={type} style={styles.radioItem} onPress={() => setBookingType(type)}>
              <View style={[styles.radioOuter, bookingType === type && styles.radioActive]}>
                {bookingType === type && <View style={styles.radioInner} />}
              </View>
              <AppText text={type === 'direct' ? "Direct Booking" : "Pricing"} />
            </Pressable>
          ))}
        </View>

        {(!selectedListingId || selectedListingId === "all") && (
          <DropdownField
            name="listing_id"
            control={control}
            errors={errors}
            label="Property Listing"
            placeholder="Select a property"
            data={listingOptions.filter((o: any) => o.value !== "" && !o.label.toLowerCase().includes('all'))}
          />
        )}

        {bookingType === 'direct' ? (
          <View>
            <DropdownField
              name="booking_type"
              control={control}
              errors={errors}
              label="Stay Type"
              placeholder="Select stay type"
              data={[{ label: 'Host', value: 'host' }, { label: 'Livedin', value: 'livedin' }]}
            />
            <InputField name="name" control={control} errors={errors} label="Guest Name" placeholder="Enter guest name" />
            <InputField name="email" control={control} errors={errors} label="Email" placeholder="guest@example.com" keyboardType="email-address" />
            <View style={{ marginBottom: vs(10) }}>
              <PhoneInputField
                label="Phone Number*"
                control={control}
                errors={errors}
                countryFieldName="country"
                phoneFieldName="phoneNumber"
              />
             </View>
          </View>
        ) : (
          <InputField name="rate" control={control} errors={errors} label="Pricing (SAR)" placeholder="e.g. 500" keyboardType="numeric" />
        )}

        <DateTimeInputField
          name="start_date"
          control={control}
          errors={errors}
          label="Start Date"
          placeholder="MM/DD/YY"
          mode='date'
          minimumDate={minStartDate}
          rules={{ required: 'Check-in date is required' }}
          rightIcon={<Svgicons path="Calendar_Days" size={20} color={Colors.BRUNSWICK_GREEN} />}
        />

        <DateTimeInputField
          name="end_date"
          control={control}
          errors={errors}
          label="End Date"
          placeholder="MM/DD/YY"
          mode='date'
          minimumDate={minEndDate}
          rules={{ required: 'Check-out date is required' }}
          rightIcon={<Svgicons path="Calendar_Days" size={20} color={Colors.BRUNSWICK_GREEN} />}
        />

        <View style={styles.buttonContainer}>
          <AppButton
            title={bookingType === 'direct' ? "Create Direct Booking" : "Set Pricing"}
            onPress={onSubmit}
            loading={isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
    </BottomSheetComponent>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  grabZone: {
    height: vs(40),
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 999,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(10),
    paddingBottom: vs(120),
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(30),
    marginVertical: vs(15)
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8)
  },
  radioOuter: {
    width: ms(18),
    height: ms(18),
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2D4A41',
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioInner: {
    width: ms(9),
    height: ms(9),
    borderRadius: 5,
    backgroundColor: '#2D4A41'
  },
  radioActive: {
    borderColor: '#2D4A41'
  },
  buttonContainer: {
    marginTop: vs(20),
    marginBottom: vs(10)
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(20),
    paddingTop: vs(10),
  },
  closeButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: '#E0E0E0', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateBookingSheet;