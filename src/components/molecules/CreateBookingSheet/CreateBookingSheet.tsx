import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import BottomSheetComponent from '@/components/molecules/BottomSheetComponent/BottomSheetComponent';
import AppText from '@/components/molecules/AppText/AppText';
import DropdownField from '@/components/molecules/Input/DropdownField';
import InputField from '@/components/molecules/Input/InputField';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';

interface Props {
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
}: Props) => (
  <BottomSheetComponent isVisible={isVisible} onClose={onClose}>
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Type Selector: Direct Booking vs Pricing */}
      <View style={styles.radioRow}>
        {['direct', 'pricing'].map((type) => (
          <Pressable key={type} style={styles.radioItem} onPress={() => setBookingType(type)}>
            <View style={[styles.radioOuter, bookingType === type && styles.radioActive]}>
              {bookingType === type && <View style={styles.radioInner} />}
            </View>
            <AppText text={type === 'direct' ? "Direct Booking" : "Pricing"} />
          </Pressable>
        ))}
      </View>

      {/* Property Selection (Shown only if 'All Listings' is selected in main screen) */}
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
            data={[{label: 'Host', value: 'host'}, {label: 'Livedin', value: 'livedin'}]} 
          />
          <InputField 
            name="name" 
            control={control} 
            errors={errors} 
            label="Guest Name" 
            placeholder="Enter guest name" 
          />
          <InputField 
            name="email" 
            control={control} 
            errors={errors} 
            label="Email" 
            placeholder="guest@example.com" 
            keyboardType="email-address" 
          />
          <InputField 
            name="phone" 
            control={control} 
            errors={errors} 
            label="Phone" 
            placeholder="+966..." 
            keyboardType="phone-pad" 
          />
        </View>
      ) : (
        <InputField 
          name="rate" 
          control={control} 
          errors={errors} 
          label="Pricing (SAR)" 
          placeholder="e.g. 500" 
          keyboardType="numeric" 
        />
      )}
      
      <DateTimeInputField 
        name="end_date" 
        control={control} 
        errors={errors} 
        label="End Date" 
        placeholder="YYYY-MM-DD"
        mode='date'
        rightIcon={<Svgicons path="Calendar_Days" size={20} color={Colors.BRUNSWICK_GREEN} />} 
      />

      <Pressable style={styles.buttonShadow} onPress={onSubmit}>
        <LinearGradient colors={['#FFFFFF', '#F9F9F9']} style={styles.gradientBtn}>
          <AppText 
            text={bookingType === 'direct' ? "Create Direct Booking" : "Set Pricing"} 
            type="Bold" 
            color="#2D4A41" 
          />
        </LinearGradient>
      </Pressable>
    </ScrollView>
  </BottomSheetComponent>
);

const styles = StyleSheet.create({
  radioRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: s(30), 
    marginVertical: vs(20) 
  },
  radioItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: s(8) 
  },
  radioOuter: { 
    width: ms(20), 
    height: ms(20), 
    borderRadius: 10, 
    borderWidth: 1.5, 
    borderColor: '#2D4A41', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioInner: { 
    width: ms(10), 
    height: ms(10), 
    borderRadius: 5, 
    backgroundColor: '#2D4A41' 
  },
  radioActive: { 
    borderColor: '#2D4A41' 
  },
  buttonShadow: { 
    marginTop: vs(10), 
    marginBottom: vs(30), 
    borderRadius: ms(25), 
    elevation: 4 
  },
  gradientBtn: { 
    height: vs(50), 
    borderRadius: ms(25), 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#EAEAEA' 
  },
});