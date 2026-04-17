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

const SetPricingScreen = () => {
  const { control, errors, handleSubmit, onSubmit, isLoading } = usePricingContainer();

  const currencyOptions = [
    { label: 'Riyal (SAR)', value: 'SAR' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <TouchableOpacity style={styles.backBtn} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </TouchableOpacity>
            </GradientBorder>
            <CircularProgress percentage={80} size={48} strokeWidth={4} />
          </View>

          <AppText text="Set your pricing" fontSize={32} type="Bold" mt={30} />
          <AppText 
            text="Base price is set by the platform. Set a markup for each platform individually." 
            fontSize={14} 
            color="#6B6B6B" 
            mt={10} 
          />

          <View style={styles.formGroup}>
            <DropdownField name="currency" label="Select Money Currency" control={control as any} errors={errors} data={currencyOptions} disabled/>
            <View style={styles.fieldGap} />
            <InputField name="weekday_price" label="Weekday Base Price" control={control as any} errors={errors} placeholder="500 SAR" keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="weekend_price" label="Weekend Base Price" control={control as any} errors={errors} placeholder="500 SAR" keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="tax_vat" label="Tax (Vat)" control={control as any} errors={errors} placeholder="2.0%" keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="airbnb_markup" label="Airbnb Markup Price" control={control as any} errors={errors} placeholder="2.0%" keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="gathern_markup" label="Gathern Markup Price" control={control as any} errors={errors} placeholder="2.0%" keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="booking_com_markup" label="Booking.com Markup Price" control={control as any} errors={errors} placeholder="2.0%" keyboardType="numeric" />
            <View style={styles.fieldGap} />
            <InputField name="extra_guest_fee" label="Extra Guest Fee" control={control as any} errors={errors} placeholder="200 SAR" keyboardType="numeric" />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title="Next" 
            variant="secondary" 
            onPress={handleSubmit((d) => onSubmit(d, false))} 
            loading={isLoading} 
          />
          <AppButton 
            title="Save & Exit" 
            mt={12} 
            onPress={handleSubmit((d) => onSubmit(d, true))} 
            disabled={isLoading} 
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 220 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  formGroup: { marginTop: 30 },
  fieldGap: { height: 20 },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 25, 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    paddingBottom: 40 
  },
});

export default SetPricingScreen;