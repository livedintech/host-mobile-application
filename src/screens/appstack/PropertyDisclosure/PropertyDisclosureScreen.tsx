import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import usePropertyDisclosureContainer from './PropertyDisclosureContainer';

const PropertyDisclosureScreen = ({ navigation }: any) => {
  const { control, errors, handleSubmit, onSubmit, isLoading } = usePropertyDisclosureContainer();

  const options = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AppText text="Step 6" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" />
        
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
});

export default PropertyDisclosureScreen;