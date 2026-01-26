import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useAboutThePlaceContainer from './AboutThePlaceContainer';
import InputField from '@/components/molecules/Input/InputField';
import MaskedInputField from '@/components/molecules/Input/MaskedInputField';

const AboutThePlaceScreen = () => {
  const {
    control,
    errors,
    binaryOptions,
    numberOptions,
    handleSubmit,
    onNext,
    isLoading,
    isEdit,
    onSaveExit
  } = useAboutThePlaceContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stepTitleRow}>
          <AppText text="Step 2" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} />
        </View>

        <View style={styles.subTitleRow}>
          <AppText text="About the Place " fontSize={24} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="homePlusIcon" size={24} />
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField name="bedrooms" label="Bedrooms" control={control} errors={errors} data={numberOptions} placeholder="Select" />
            </View>
            <View style={styles.half}>
              <DropdownField name="beds" label="Beds" control={control} errors={errors} data={numberOptions} placeholder="Select" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField name="bathrooms" label="Bathrooms" control={control} errors={errors} data={numberOptions} placeholder="Select" />
            </View>
            <View style={styles.half}>
              <DropdownField name="min_nights" label="Min Nights" control={control} errors={errors} data={numberOptions} placeholder="Select" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <MaskedInputField
                name="check_in_time"
                label="Check-in Time"
                control={control}
                errors={errors}
                placeholder="HH:MM"

              />
            </View>
            <View style={styles.half}>
              <MaskedInputField
                name="check_out_time"
                label="Check-out Time"
                control={control}
                errors={errors}
                placeholder="HH:MM"
              />
            </View>
          </View>


          <DropdownField
            name="instant_booking"
            label="Instant Booking"
            control={control}
            errors={errors}
            data={binaryOptions}
            placeholder="Select Yes/No"
          />

          <View style={styles.footer}>
            <View style={styles.footer}>
              {isEdit ? (
                <AppButton
                  title="Save & Exit"
                  onPress={handleSubmit(onSaveExit)}
                  loading={isLoading}
                />
              ) : (
                <AppButton
                  title="Next"
                  onPress={handleSubmit(onNext)}
                  loading={isLoading}
                />
              )}
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  stepTitleRow: { alignItems: 'center', marginTop: 10 },
  subTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  form: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  footer: { marginTop: 30 },
});

export default AboutThePlaceScreen;