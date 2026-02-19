import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import TextareaField from '@/components/molecules/Input/TextareaField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import useCreateEditListingHouseGuidelinesContainer from './useCreateEditListingHouseGuidelinesContainer';

const CreateEditListingHouseGuidelinesScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    isEdit,
    onNext,
    onSaveExit,
    isLoading,
    arrivalGuideLength,
    houseRulesLength,
    checkoutInstructionsLength,
  } = useCreateEditListingHouseGuidelinesContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </Pressable>
          </GradientBorder>
          <CircularProgress percentage={50} size={48} strokeWidth={4} />
        </View>

        {/* Title */}
        <View style={styles.titleRow}>
          <AppText text="House Guidelines" fontSize={28} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="bookIcon" size={24} />
        </View>

        {/* Arrival Guide */}
        <View style={styles.section}>
          <TextareaField
            name="arrival_guide"
            control={control}
            errors={errors}
            label="Arrival Guide"
            placeholder="Property Name: Olive Residency&#10;Address: Building 12, Al Noor Street, City Center&#10;Apartment Number: Unit 504&#10;Entry Access: Self check-in via smart lock.&#10;Access Code: Your unique access code will be shared before arrival.&#10;Parking: One reserved parking space is available for guests.&#10;Wi-Fi: High-speed internet is available inside the apartment."
            multiline={true}
            numberOfLines={8}
            descriptionLength={arrivalGuideLength}
          />
        </View>

        {/* House Rules */}
        <View style={styles.section}>
          <TextareaField
            name="house_rules"
            control={control}
            errors={errors}
            label="House Rules"
            placeholder="Please maintain a low noise level at all times.&#10;Please keep the apartment clean and tidy.&#10;Do not damage or remove any items from the apartment.&#10;Smoking is not allowed inside the apartment.&#10;Pets are not allowed unless approved in advance.&#10;Only registered guests are allowed to stay in the apartment."
            multiline={true}
            numberOfLines={8}
            descriptionLength={houseRulesLength}
          />
        </View>

        {/* Checkout Instructions */}
        <View style={styles.section}>
          <TextareaField
            name="checkout_instructions"
            control={control}
            errors={errors}
            label="Checkout Instructions"
            placeholder="Please leave the apartment in a reasonable condition at check-out.&#10;Turn off all lights, air conditioning, and electrical appliances.&#10;Place used towels in the bathroom or laundry basket.&#10;Leave used bed linens on the bed.&#10;Do not leave food items open or uncovered.&#10;Report any spills, stains, or damages immediately."
            multiline={true}
            numberOfLines={8}
            descriptionLength={checkoutInstructionsLength}
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
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
  section: {
    marginBottom: 20,
  },
  footer: { marginTop: 20 },
});

export default CreateEditListingHouseGuidelinesScreen;