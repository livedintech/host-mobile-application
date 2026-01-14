import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useSetPricingContainer from './SetPricingContainer';
import InputField from '@/components/molecules/Input/InputField';

const SetPricingScreen = ({ navigation }: any) => {
  const { control, errors, handleSubmit, onSubmit, isLoading } = useSetPricingContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step Header */}
        <AppText text="Step 5" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" />
        
        <View style={styles.subTitleRow}>
          <AppText text="Set Your Pricing" fontSize={24} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="cardIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
        </View>

        {/* Pricing Row 1: Weekday & Weekend */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              name="weekdayPrice"
              control={control}
              errors={errors}
              label="Weekday Base Price*"
              placeholder="SAR 500"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              name="weekendPrice"
              control={control}
              errors={errors}
              label="Weekend Base Price*"
              placeholder="SAR 200"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Pricing Row 2: Discount & Tax */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              name="discount"
              control={control}
              errors={errors}
              label="Discount"
              placeholder="10.5%"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              name="taxVat"
              control={control}
              errors={errors}
              label="Tax(VAT)"
              placeholder="2.0%"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Pricing Row 3: Markup & Cleaning Fee */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              name="security_deposit"
              control={control}
              errors={errors}
              label="Security Deposit"
              placeholder="SR 1000"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              name="cleaningFee"
              control={control}
              errors={errors}
              label="Cleaning Fee"
              placeholder="2.0%"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <AppButton 
            title="Next" 
            onPress={handleSubmit(onSubmit)} 
            loading={isLoading} 
          />
          <AppButton 
            title="Save & Exit" 
            onPress={() => navigation.goBack()} 
            mt={15} 
          />
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
    marginBottom: 5,
  },
  halfWidth: { width: '48%' },
  footer: { marginTop: 40 },
});

export default SetPricingScreen;