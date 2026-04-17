import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
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

const AddBookingCancelPoliciesScreen = () => {
  const { control, errors, handleSubmit, onNext, onSaveExit, isLoading } = useBookingCancelPoliciesContainer();

  const policyOptions = [
    { label: 'Flexible - Guests can cancel at least 24 hours before check-in', value: 'flexible' },
    { label: 'Moderate - Guests can cancel at least 5 days before check-in', value: 'moderate' },
    { label: 'Strict - No refunds for cancellations', value: 'strict' },
  ];

  const longTermOptions = [
    { label: 'Long-term with grace period', value: 'longterm_grace' },
    { label: 'Firm long-term policy', value: 'firm_longterm' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <TouchableOpacity style={styles.backBtn} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </TouchableOpacity>
            </GradientBorder>
            <CircularProgress percentage={70} size={48} strokeWidth={4} />
          </View>

          <AppText text="Add booking cancel policies" fontSize={28} type="Bold" mt={30} pr={100}/>

          <View style={styles.formGroup}>
            <DropdownField 
                name="airbnb_policy" 
                label="Airbnb" 
                control={control as any} 
                errors={errors} 
                data={policyOptions} 
                placeholder="Flexible - Guests can cancel at least 24.."
            />
            
            <View style={styles.fieldGap} />
            
            <DropdownField 
                name="airbnb_longterm_policy" 
                label="Airbnb Long-term" 
                control={control as any} 
                errors={errors} 
                data={longTermOptions} 
                placeholder="Long-term with grace period - To recie..."
            />

            <View style={styles.fieldGap} />

            <DropdownField 
                name="gathern_policy" 
                label="Gathern" 
                control={control as any} 
                errors={errors} 
                data={policyOptions} 
                placeholder="Flexible - Guests can cancel at least 24.."
            />

            <View style={styles.fieldGap} />

            <DropdownField 
                name="booking_com_policy" 
                label="Booking.com" 
                control={control as any} 
                errors={errors} 
                data={policyOptions} 
                placeholder="Flexible - Guests can cancel at least 24.."
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
          backgroundColor={Colors.WHITE}
            title="Next" 
            variant="secondary" 
            onPress={handleSubmit(onNext)} 
            loading={isLoading} 
          />
          <AppButton 
            title="Save & Exit" 
            mt={12} 
            onPress={handleSubmit(onSaveExit)} 
            disabled={isLoading} 
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 200 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  formGroup: { marginTop: 40 },
  fieldGap: { height: 25 },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 25, 
    paddingBottom: 40 
  },
});

export default AddBookingCancelPoliciesScreen;