import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import useBookingRulesContainer from './BookingRulesContainer';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import Metrics from '@/utility/Metrics';

const AddBookingRulesScreen = () => {
  const { control, errors, handleSubmit, onNext, onSaveExit, isLoading, isEdit } = useBookingRulesContainer();
  const yesNoOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
  ];
 const numberOptions = Array.from({ length: 365 }, (_, i) => ({
  label: String(i + 1),  // ✅ 1 se 365
  value: String(i + 1),
}));
  // ✅ Gap nights ke liye alag — 0 se 30 tak
  const gapNightOptions = Array.from({ length: 30 }, (_, i) => ({
  label: String(i + 1),  // ✅ 1 se 30
  value: String(i + 1),
}));
  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Header Row */}
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <TouchableOpacity style={styles.backBtnWrapper} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </TouchableOpacity>
            </GradientBorder>
            {!isEdit && <CircularProgress percentage={65} size={48} strokeWidth={4} />}
          </View>

          <AppText text="Add booking rules" fontSize={28} type="Bold" mt={30} pr={160} />

          <View style={styles.formGroup}>
            <DropdownField
              name="long_term_stay"
              label="Long term Stay"
              control={control as any}
              errors={errors}
              data={yesNoOptions}
            />

            <View style={styles.fieldGap} />

            <DropdownField
              name="min_gap_night"
              label="Minimum Gap Night"
              control={control as any}
              errors={errors}
              data={gapNightOptions} // ✅ 0-30
              placeholder="1"
            />

            <View style={styles.fieldGap} />

            <DropdownField
              name="min_night_stay"
              label="Minimum Night Stay"
              control={control as any}
              errors={errors}
              data={numberOptions} // ✅ 0-365
              placeholder="2"
            />


            <View style={styles.fieldGap} />

            <DropdownField
              name="max_night_stay"
              label="Maximum Night Stay"
              control={control as any}
              errors={errors}
              data={numberOptions} // ✅ 0-365 — ab 30 bhi hoga
              placeholder="2"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {!isEdit && (
            <AppButton
              title="Next"
              variant="secondary"
              onPress={handleSubmit(onNext)}
              loading={isLoading}
              backgroundColor={Colors.WHITE}
            />
          )}

          <AppButton
            title="Save & Exit"
            mt={12}
            onPress={handleSubmit(onSaveExit)}
            disabled={isLoading}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Metrics.baseMargin, paddingTop: 10, },
  content: { paddingBottom: Metrics.verticalScale(50) },  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  formGroup: { marginTop: 40 },
  fieldGap: { height: 25 },
  footer: {
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    padding: 25,
    paddingBottom: 40
  },
});

export default AddBookingRulesScreen;