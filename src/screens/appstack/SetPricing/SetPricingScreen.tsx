import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import useSetPricingContainer from './SetPricingContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';

const SetPricingScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isEdit,
    isLoading,
    discountOptions,
  } = useSetPricingContainer();

  return (
     <BGImage source={require('@/assets/img/background/linearBG.png')}>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </Pressable>
          </GradientBorder>
          <CircularProgress percentage={60} size={48} strokeWidth={4} />
        </View>

        {/* Step Title */}
        <AppText text="Step 5" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" mb={20} />

        {/* Title */}
        <View style={styles.titleRow}>
          <AppText text="Set Your Pricing" fontSize={24} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="cardIcon" size={24} />
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Weekday Base Price + Weekend Base Price */}
          <View style={styles.row}>
            <View style={styles.half}>
              <InputField
                name="weekday_base_price"
                label="Weekday Base Price*"
                control={control}
                errors={errors}
                placeholder="SAR 500"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.half}>
              <InputField
                name="weekend_base_price"
                label="Weekend Base Price*"
                control={control}
                errors={errors}
                placeholder="SAR 200"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Discount + Tax(VAT) */}
          <View style={styles.row}>
            <View style={styles.half}>
              <InputField
                name="discount"
                label="Discount"
                control={control}
                errors={errors}
                placeholder="10.5%"
              />
            </View>
            <View style={styles.half}>
              <InputField
                name="tax_vat"
                label="Tax(VAT)"
                control={control}
                errors={errors}
                placeholder="2.0%"
              />
            </View>
          </View>

          {/* Markup Price + Cleaning Fee */}
          <View style={styles.row}>
            <View style={styles.half}>
              <InputField
                name="markup_price"
                label="Markup Price"
                control={control}
                errors={errors}
                placeholder="10.5%"
              />
            </View>
            <View style={styles.half}>
              <InputField
                name="cleaning_fee"
                label="Cleaning Fee"
                control={control}
                errors={errors}
                placeholder="SAR 250"
              />
            </View>
          </View>

          {/* Airbnb Discount + Gathern Discount */}
          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField
                name="airbnb_discount"
                label="Airbnb Discount"
                control={control}
                errors={errors}
                data={discountOptions}
                placeholder="10.5%"
              />
            </View>
            <View style={styles.half}>
              <DropdownField
                name="gathern_discount"
                label="Gathern Discount"
                control={control}
                errors={errors}
                data={discountOptions}
                placeholder="2.0%"
              />
            </View>
          </View>

          {/* Booking.com Discount + Extra Guest Fee */}
          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField
                name="booking_discount"
                label="Booking.com Discount"
                control={control}
                errors={errors}
                data={discountOptions}
                placeholder="10.5%"
                dropdownPosition='top'
              />
            </View>
            <View style={styles.half}>
              <InputField
                name="extra_guest_fee"
                label="Extra Guest Fee"
                control={control}
                errors={errors}
                placeholder="SAR 250"
                keyboardType="numeric"
              />
            </View>
          </View>

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
  container: { flex: 1},
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  half: { flex: 1 },
  footer: { marginTop: 20 },
});

export default SetPricingScreen;