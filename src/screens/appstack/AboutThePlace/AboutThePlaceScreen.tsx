// AboutThePlaceScreen.tsx
import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useAboutThePlaceContainer from './AboutThePlaceContainer';
import InputField from '@/components/molecules/Input/InputField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';

const AboutThePlaceScreen = () => {
  const {
    control, errors, numberOptions,
    handleSubmit, onNext, onSaveExit,
    isLoading, isEdit,
  } = useAboutThePlaceContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </Pressable>
          </GradientBorder>
          {!isEdit && <CircularProgress percentage={15} size={48} strokeWidth={4} />}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <AppText text="Add information about your property" fontSize={28} type="Bold" mb={30} />

          <View style={styles.inputWrapper}>
            <InputField
              name="size_sqm"
              label="Property Size (SQM)"
              control={control}
              errors={errors}
              placeholder="500 Square Metres"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.card}>
            <View style={styles.iconRow}>
              <Svgicons path="guestIcon" size={20} />
              <AppText text="Number of Guests" ml={10} fontSize={14} type="Medium" />
            </View>
            <DropdownField label="" name="guest_limit" control={control} errors={errors} data={numberOptions} placeholder="3" />
          </View>

          <View style={styles.card}>
            <View style={styles.iconRow}>
              <Svgicons path="bedroomIcon" size={20} />
              <AppText text="Number of Bedrooms" ml={10} fontSize={14} type="Medium" />
            </View>
            <DropdownField label="" name="bedrooms" control={control} errors={errors} data={numberOptions} placeholder="4 Bedrooms" />
          </View>

          <View style={styles.card}>
            <View style={styles.iconRow}>
              <Svgicons path="bedroom" size={20} />
              <AppText text="Number of Beds" ml={10} fontSize={14} type="Medium" />
            </View>
            <DropdownField label="" name="beds" control={control} errors={errors} data={numberOptions} placeholder="4 Beds" />
          </View>

          <View style={styles.card}>
            <View style={styles.iconRow}>
              <Svgicons path="bathroom" size={20} />
              <AppText text="Number of Bathrooms" ml={10} fontSize={14} type="Medium" />
            </View>
            <DropdownField label="" name="bathrooms" control={control} errors={errors} data={numberOptions} placeholder="3" />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {!isEdit && (
            <AppButton title="Next" variant="secondary" onPress={handleSubmit(onNext)} loading={isLoading} />
          )}
          <AppButton
            title="Save & Exit"
            mt={!isEdit ? 15 : 0}
            onPress={handleSubmit(onSaveExit)}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 10 },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  inputWrapper: { marginBottom: 15 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  iconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  footer: { paddingHorizontal: 25, paddingBottom: 30 },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AboutThePlaceScreen;