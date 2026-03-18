import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import useBookingDetailsContainer from './CreateEditBookingDetailsContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';

const BookingDetailsScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isEdit,
    isLoading,
    bookingTypeOptions,
    guestEligibilityOptions,
  } = useBookingDetailsContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
              <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </Pressable>
            </GradientBorder>
            <CircularProgress percentage={45} size={48} strokeWidth={4} />
          </View>

          {/* Title */}
          <View style={styles.titleRow}>
            <AppText text="Add Booking Details" fontSize={28} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
            <Svgicons path="homeIcon" size={24} />
          </View>

          {/* Form */}
          <View style={styles.form}>

            {/* Booking Type */}
            <DropdownField
              name="booking_type"
              label="Booking Type"
              control={control}
              errors={errors}
              data={bookingTypeOptions}
              placeholder="Instant"
            />

            {/* Guest Eligibility */}
            <DropdownField
              name="guest_eligibility"
              label="Guest Eligibility"
              control={control}
              errors={errors}
              data={guestEligibilityOptions}
              placeholder="Yes"
            />

            {/* Check-in Time */}
            <DateTimeInputField
              mode="time"
              name="check_in_time"
              label="Check-in Time"
              control={control}
              errors={errors}
              placeholder="09:00"
            />

            {/* Check-out Time */}
            <DateTimeInputField
              mode="time"
              name="check_out_time"
              label="Check-out Time"
              control={control}
              errors={errors}
              placeholder="22:00"
            />

          </View>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            {!isEdit && (
              <>
                <AppButton
                  title="Next"
                  onPress={handleSubmit(onNext)}
                  loading={isLoading}
                />
                <AppButton
                  title="Save & Exit"
                  onPress={handleSubmit(onSaveExit)}
                  mt={15}
                  disabled={isLoading}
                />
              </>
            )}

            {isEdit && (
              <AppButton
                title="Save & Exit"
                onPress={handleSubmit(onSaveExit)}
                loading={isLoading}
              />
            )}
          </View>

        </ScrollView>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  form: { flex: 1 },
  footer: { marginTop: 20 },
});

export default BookingDetailsScreen;