import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import usePropertyDisclosureContainer from './PropertyDisclosureContainer';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';

const AddPropertyDisclosureScreen = () => {
  const { control, errors, handleSubmit, onNext, onSaveExit, isLoading,isEdit } = usePropertyDisclosureContainer();

  const options = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <TouchableOpacity style={styles.backBtnWrapper} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </TouchableOpacity>
            </GradientBorder>
            {!isEdit && <CircularProgress percentage={55} size={48} strokeWidth={4} />}
          </View>

          <AppText text="Add property disclosure details" fontSize={28} type="SemiBold" mt={40} pr={40}/>
          <AppText text="Select the disclosure details for this property." fontSize={12} color={Colors.DARK_CHARCOAL_OPACITY} mt={29} />

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <DropdownField 
                name="securityCameras" 
                label="Exterior Security Cameras Present" 
                control={control as any} 
                errors={errors} 
                placeholder="Select" 
                data={options} 
            />
            
            <View style={styles.fieldGap} />
            
            <DropdownField 
                name="noiseMonitor" 
                label="Noise Decibel Monitor" 
                control={control as any} 
                errors={errors} 
                placeholder="Select" 
                data={options} 
            />

            <View style={styles.fieldGap} />

            <DropdownField 
                name="weaponsOnProperty" 
                label="Weapons on Property" 
                control={control as any} 
                errors={errors} 
                placeholder="Select" 
                data={options} 
            />
          </View>
        </ScrollView>

        {/* Footer */}
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
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 200 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  formGroup: { marginTop: 40 },
  fieldGap: { height: 25 },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 25, 
    paddingBottom: 40 
  },
});

export default AddPropertyDisclosureScreen;