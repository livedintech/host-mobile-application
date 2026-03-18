import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import usePropertyDisclosureContainer from './PropertyDisclosureContainer';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';

const PropertyDisclosureScreen = () => {
  const { control, errors, handleSubmit, onNext, isEdit, onSaveExit, isLoading } = usePropertyDisclosureContainer();

  const options = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  return (
            <BGImage source={require('@/assets/img/background/linearBG.png')}>

    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        {/* <AppText text="Step 6" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" /> */}
         {/* Header */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </Pressable>
          </GradientBorder>
          <CircularProgress percentage={80} size={48} strokeWidth={4} />
        </View>

         {/* Step Title */}
        <AppText text="Step 7" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" mb={20} />

        <View style={styles.subTitleRow}>
          <AppText text="Add Property Disclosure Details" fontSize={22} type="SemiBold" color={Colors.BRUNSWICK_GREEN} textAlign="center" />
          <Svgicons path="bookIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
        </View>

        {/* Disclosure Dropdowns */}
        <View style={styles.inputSection}>
          <DropdownField
            name="securityCameras"
            control={control}
            errors={errors}
            label="Exterior Security Cameras Present"
            data={options}
          />

          <DropdownField
            name="noiseMonitor"
            control={control}
            errors={errors}
            label="Noise Decibel Monitor"
            data={options}
          />

          <DropdownField
            name="weaponsOnProperty"
            control={control}
            errors={errors}
            label="Weapons On Property"
            data={options}
          />
        </View>

        {/* Action Buttons */}
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

      </ScrollView>
    </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
    gap: 10,
    flexWrap: 'wrap'
  },
  inputSection: {
    marginBottom: 20,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 40
  },
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
});

export default PropertyDisclosureScreen;