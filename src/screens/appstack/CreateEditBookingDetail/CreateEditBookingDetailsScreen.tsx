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
import useBookingDetailsContainer from './CreateEditBookingDetailsContainer';
import Metrics from '@/utility/Metrics';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';

const AddBookingDetailsScreen = () => {
  const { control, errors, handleSubmit, onNext, onSaveExit, isLoading } = useBookingDetailsContainer();

  const yesNoOptions = [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }];
  const bookingTypeOptions = [{ label: 'Instant', value: 'Instant' }, { label: 'Manual', value: 'Manual' }];
  const cleanlinessOptions = [{ label: 'Clean', value: 'Clean' }, { label: 'Dirty', value: 'Dirty' }];

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
            <CircularProgress percentage={60} size={48} strokeWidth={4} />
          </View>

          <AppText text="Step 3" fontSize={18} type="Medium" mt={20} />
          <AppText text="Add booking details" fontSize={32} type="Bold" mt={5} pr={80}/>

          <View style={styles.formGroup}>
            <DropdownField name="booking_type" label="Booking Type" control={control as any} errors={errors} data={bookingTypeOptions} />
            <View style={styles.fieldGap} />

            <DropdownField name="guest_eligibility" label="Guest Eligibility" control={control as any} errors={errors} data={yesNoOptions} />
            <View style={styles.fieldGap} />

            <DateTimeInputField
              name="check_in_time"
              label="Check-in Time"
              control={control as any}
              errors={errors}
              mode="time"
              placeholder="09:00"
            />           

            <DateTimeInputField
              name="check_out_time"
              label="Check-out Time"
              control={control as any}
              errors={errors}
              mode="time"
              placeholder="23:00"
            />            

            <DropdownField name="allow_same_day" label="Allow Same-day Booking.com Bookings" control={control as any} errors={errors} data={yesNoOptions} />
            <View style={styles.fieldGap} />

            <DropdownField name="cleanliness_status" label="Listing's Cleanliness Status" control={control as any} errors={errors} data={cleanlinessOptions} placeholder="Cleaning Status" />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton title="Next" variant="secondary" backgroundColor={Colors.WHITE} onPress={handleSubmit(onNext)} loading={isLoading} />
          <AppButton title="Save & Exit" mt={12} onPress={handleSubmit(onSaveExit)} disabled={isLoading} />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Metrics.baseMargin, paddingTop: Metrics.verticalScale(20), paddingBottom: Metrics.verticalScale(200) },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  formGroup: { marginTop: 30 },
  fieldGap: { height: 20 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, paddingBottom: 40 },
});

export default AddBookingDetailsScreen;