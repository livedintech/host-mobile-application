import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useAboutThePlaceContainer from './AboutThePlaceContainer';
import InputField from '@/components/molecules/Input/InputField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';

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
    onSaveExit,
    getAmunities,
    isLoadingGetAmunities,
  } = useAboutThePlaceContainer();

  return (
     <BGImage source={require('@/assets/img/background/linearBG.png')}>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner} >
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path='arrowLeftIcon' size={24} />
            </Pressable>
          </GradientBorder>
          <CircularProgress percentage={15} size={48} strokeWidth={4} />
        </View>
        <View style={styles.stepTitleRow}>
          <AppText text="Step 2" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} />
        </View>

        <View style={styles.subTitleRow}>
          <AppText text="About the Place " fontSize={24} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="homePlusIcon" size={24} />
        </View>

        <View style={styles.form}>

          {/* Size (SQM) */}
          <InputField
            name="size_sqm"
            label="Size (SQM)"
            control={control}
            errors={errors}
            placeholder="500 Sqm"
            keyboardType="numeric"
          />

          {/* Number of Bedrooms + Number of Beds */}
          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField name="bedrooms" label="Number of Bedrooms" control={control} errors={errors} data={numberOptions} placeholder="Select" />
            </View>
            <View style={styles.half}>
              <DropdownField name="beds" label="Number of Beds" control={control} errors={errors} data={numberOptions} placeholder="Select" />
            </View>
          </View>

          {/* Kitchen + Pool */}
          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField name="kitchen" label="Kitchen" control={control} errors={errors} data={binaryOptions} placeholder="yes/no" />
            </View>
            <View style={styles.half}>
              <DropdownField name="pool" label="Pool" control={control} errors={errors} data={binaryOptions} placeholder="yes/no" />
            </View>
          </View>

          {/* Long term Stay? + Minimum Gap Night */}
          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField name="long_term_stay" label="Long term Stay?" control={control} errors={errors} data={binaryOptions} placeholder="yes/no" />
            </View>
            <View style={styles.half}>
              <DropdownField name="min_gap_night" label="Minimum Gap Night" control={control} errors={errors} data={numberOptions} placeholder="Select" />
            </View>
          </View>

          {/* Minimum Night Stay + Maximum Night Stay */}
          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField name="min_nights" label="Minimum Night Stay" control={control} errors={errors} data={numberOptions} placeholder="Select" />
            </View>
            <View style={styles.half}>
              <DropdownField name="max_nights" label="Maximum Night Stay" control={control} errors={errors} data={numberOptions} placeholder="Select" />
            </View>
          </View>

          {/* Other House Features */}
          <MultiSelectDropdownField
            control={control}
            label="Other House Features"
            errors={errors}
            name="amenities"
            data={getAmunities}
            disabled={isLoadingGetAmunities}
            dropdownPosition="top"
          />

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
        </View>
      </ScrollView>
    </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  stepTitleRow: { alignItems: 'center', marginTop: 10 },
  subTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  form: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  footer: { marginTop: 30 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowCircleInner: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
});

export default AboutThePlaceScreen;