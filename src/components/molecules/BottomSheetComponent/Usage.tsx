import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { s, vs, ms } from 'react-native-size-matters';
import BottomSheetComponent from '@/components/molecules/BottomSheetComponent/BottomSheetComponent';

const BookingScreen = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [bookingType, setBookingType] = useState('direct');

  const CustomInput = ({ label, placeholder, icon }: any) => (
    <View style={styles.inputGap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={styles.textInput}
        />
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>
    </View>
  );

  return (
    <BottomSheetComponent isVisible={isOpen} onClose={() => setIsOpen(false)}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 1. Direct Booking / Pricing Selector */}
        <View style={styles.radioRow}>
          <Pressable style={styles.radioItem} onPress={() => setBookingType('direct')}>
            <View style={[styles.radioOuter, bookingType === 'direct' && styles.radioActive]}>
              {bookingType === 'direct' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>Direct Booking</Text>
          </Pressable>

          <Pressable style={styles.radioItem} onPress={() => setBookingType('pricing')}>
            <View style={[styles.radioOuter, bookingType === 'pricing' && styles.radioActive]}>
              {bookingType === 'pricing' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>Pricing</Text>
          </Pressable>
        </View>

        {/* 2. Form Fields */}
        <CustomInput label="Property Listing" placeholder="Select Listing" icon="⌄" />
        <CustomInput label="Stay Type" placeholder="Guest Stay" icon="⌄" />
        <CustomInput label="Guest Name:" placeholder="Tooba J" />
        <CustomInput label="Email:" placeholder="toobaj@gmail.com" />
        <CustomInput label="Phone Number:" placeholder="+966 501 1234543" />
        <CustomInput label="Select End Date" placeholder="mm/dd/yy" icon="📅" />

        {/* 3. Action Button */}
        <Pressable style={styles.buttonShadow}>
          <LinearGradient colors={['#FFFFFF', '#F9F9F9']} style={styles.gradientBtn}>
            <Text style={styles.btnText}>Create Direct Booking</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </BottomSheetComponent>
  );
};

const styles = StyleSheet.create({
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(30),
    marginVertical: vs(20)
  },
  radioItem: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  radioOuter: {
    width: ms(20), height: ms(20), borderRadius: 10,
    borderWidth: 1.5, borderColor: '#2D4A41',
    justifyContent: 'center', alignItems: 'center'
  },
  radioActive: { borderColor: '#2D4A41' },
  radioInner: { width: ms(10), height: ms(10), borderRadius: 5, backgroundColor: '#2D4A41' },
  radioText: { fontSize: ms(16), color: '#1A332C', fontWeight: '500' },

  inputGap: { marginBottom: vs(15) },
  label: { fontSize: ms(14), fontWeight: '600', color: '#1A332C', marginBottom: vs(6) },
  inputWrapper: {
    height: vs(42), borderWidth: 1, borderColor: '#D1D1D1',
    borderRadius: ms(10), flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(12), backgroundColor: '#FFF'
  },
  textInput: { flex: 1, color: '#333', fontSize: ms(14) },
  icon: { fontSize: ms(16), color: '#666' },

  buttonShadow: {
    marginTop: vs(10), marginBottom: vs(30),
    borderRadius: ms(25), shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4
  },
  gradientBtn: {
    height: vs(50), borderRadius: ms(25),
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#EAEAEA'
  },
  btnText: { fontSize: ms(16), fontWeight: '600', color: '#2D4A41' }
});

export default BookingScreen;