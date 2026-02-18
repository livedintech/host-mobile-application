import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import useCreateEditListingCancelPoliciesContainer from './CreateEditListingCancelPoliciesContainer';

const CreateEditListingCancelPoliciesScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isEdit,
    isLoading,
    cancelPolicyOptions,
  } = useCreateEditListingCancelPoliciesContainer();

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
          <CircularProgress percentage={55} size={48} strokeWidth={4} />
        </View>

        {/* Title */}
        <View style={styles.titleRow}>
          <AppText text="Booking Cancel Policies" fontSize={26} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="clipboardIcon" size={24} />
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Cancel Policy Airbnb */}
          <DropdownField
            name="cancel_policy_airbnb"
            label="Cancel Policy Airbnb"
            control={control}
            errors={errors}
            data={cancelPolicyOptions}
            placeholder="Flexible - Guests can cancel at least 24..."
          />

          {/* Cancel Policy Gathern */}
          <DropdownField
            name="cancel_policy_gathern"
            label="Cancel Policy Gathern"
            control={control}
            errors={errors}
            data={cancelPolicyOptions}
            placeholder="Flexible - Guests can cancel at least 24..."
          />

          {/* Cancel Policy Booking.com */}
          <DropdownField
            name="cancel_policy_booking"
            label="Cancel Policy Booking.com"
            control={control}
            errors={errors}
            data={cancelPolicyOptions}
            placeholder="Flexible - Guests can cancel at least 24..."
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
  form: { flex: 1 },
  footer: { marginTop: 20 },
});

export default CreateEditListingCancelPoliciesScreen;