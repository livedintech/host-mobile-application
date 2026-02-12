import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useSetPricingContainer from './SetPricingContainer';
import InputField from '@/components/molecules/Input/InputField';

const SetPricingScreen = () => {
  const { control, errors, handleSubmit, onNext, isLoading, isEdit, onSaveExit } = useSetPricingContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step Header */}
        <AppText text="Step 5" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" />

        <View style={styles.subTitleRow}>
          <AppText text="Set Your Pricing" fontSize={24} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="cardIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
        </View>

        {/* Row 1: Weekday & Weekend */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              name="weekdayPrice"
              control={control}
              errors={errors}
              label="Weekday Base Price*"
              placeholder="500"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              name="weekendPrice"
              control={control}
              errors={errors}
              label="Weekend Base Price*"
              placeholder="700"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Row 2: Discount & Tax */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              name="discount"
              control={control}
              errors={errors}
              label="Discount (%)"
              placeholder="10"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              name="taxVat"
              control={control}
              errors={errors}
              label="Tax (VAT %)"
              placeholder="15"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Row 3: Markup & Cleaning Fee */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              name="markup"
              control={control}
              errors={errors}
              label="Markup (%)"
              placeholder="10"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              name="cleaningFee"
              control={control}
              errors={errors}
              label="Cleaning Fee"
              placeholder="50"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Row 4: Security Deposit */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              name="security_deposit"
              control={control}
              errors={errors}
              label="Security Deposit"
              placeholder="100"
              keyboardType="numeric"
            />
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfWidth: { width: '48%' },
  footer: { marginTop: 40 },
});

export default SetPricingScreen;