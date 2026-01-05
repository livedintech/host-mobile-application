import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import InputField from '@/components/molecules/Input/InputField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useAboutThePlaceContainer from './AboutThePlaceContainer';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';

const AboutThePlaceScreen = () => {
  const { control, errors, binaryOptions, numberOptions, handleSubmit, onNext, navigation, otherHouseFeatures } = useAboutThePlaceContainer();

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
          <InputField name="size" label="Size (SQM)" control={control} errors={errors} placeholder="500 Sqm" />

          {/* Grid Layout for Dropdowns */}
          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField name="bedrooms" label="Number of Bedrooms" control={control} errors={errors} data={numberOptions} />
            </View>
            <View style={styles.half}>
              <DropdownField name="beds" label="Number of Beds" control={control} errors={errors} data={numberOptions} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField name="kitchen" label="Kitchen" control={control} errors={errors} data={binaryOptions} placeholder="yes/no" />
            </View>
            <View style={styles.half}>
              <DropdownField name="pool" label="Pool" control={control} errors={errors} data={binaryOptions} placeholder="yes/no" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <DropdownField name="longTermStay" label="Long term Stay?" control={control} errors={errors} data={binaryOptions} placeholder="yes/no" />
            </View>
            <View style={styles.half}>
              <DropdownField name="minDayStay" label="Minimum Day Stay" control={control} errors={errors} data={numberOptions} />
            </View>
          </View>

          <MultiSelectDropdownField 
            name="otherFeatures" 
            label="Other House Features" 
            control={control} 
            errors={errors} 
            data={otherHouseFeatures} 
            placeholder="Select Multiple Options" 
          />

          <View style={styles.footer}>
            <AppButton title="Next" onPress={handleSubmit(onNext)}  />
            <AppButton title="Save & Exit" onPress={() => navigation.goBack()}  mt={15} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  bgCircle: { 
    position: 'absolute', 
    top: -50, 
    alignSelf: 'center', 
    width: 600, 
    height: 600, 
    borderRadius: 300, 
    borderWidth: 1, 
    borderColor: '#F8F8F8', 
    zIndex: -1 
  },
  header: { paddingHorizontal: 22, paddingTop: 10, zIndex: 10 },
  backBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    borderWidth: 1, 
    borderColor: '#EBEBEB', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  stepTitleRow: { alignItems: 'center', marginTop: 10 },
  subTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  form: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  half: { width: '48%' },
  footer: { marginTop: 30 }
});

export default AboutThePlaceScreen;