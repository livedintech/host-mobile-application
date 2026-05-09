import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

// Shared Components
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import TextareaField from '@/components/molecules/Input/TextareaField'; // ✅ Updated
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import Checkbox from '@/components/molecules/Input/CheckBox';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

// Theme & Utility
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

const CategoryInstructionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { title } = route.params || { title: 'Category' };

  const { 
    control, 
    formState: { errors } 
  } = useForm();

  const [sections, setSections] = useState([{ id: Date.now() }]);

  const addMoreSection = () => {
    setSections([...sections, { id: Date.now() }]);
  };

  const propertyData = [
    { label: 'Beachfront Villa', value: '1' },
    { label: 'Downtown Apartment', value: '2' },
  ];

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
 

        <AppText 
          text={`Custom instructions for ${title}`} 
          fontSize={28} 
          type="Bold" 
          mt={20}
          mb={12} 
        />
        
        <AppText
          text={`Add specific guidelines for how Autopilot should handle ${title.toLowerCase()}. These instructions will guide responses for this category and ensure consistent replies.`}
          fontSize={14}
          color={Colors.BLACK_60_PERCENT}
          lineHeight={20}
          mb={20}
        />

        {/* Add More Button Row */}
        <View style={styles.addMoreRow}>
          <TouchableOpacity onPress={addMoreSection} style={styles.addMoreButton}>
            <AppText text="Add more" color={Colors.BLACK} fontSize={14} type="Medium" />
          </TouchableOpacity>
        </View>

        {/* Dynamic Instruction Sections */}
        {sections.map((section, index) => (
          <View key={section.id} style={styles.sectionContainer}>
            {/* ✅ Used TextareaField instead of InputField */}
            <TextareaField
              label="Instructions"
              name={`instructions_${index}`}
              control={control}
              errors={errors}
              placeholder="Add instructions that Autopilot should follow for this category..."
              multiline={true}
              height={Metrics.verticalScale(140)}
              sparkleIcon={false}
            />

            <View style={{ marginTop: Metrics.verticalScale(10) }}>
               <MultiSelectDropdownField
                name={`properties_${index}`}
                control={control}
                errors={errors}
                label="Select Property"
                data={propertyData}
                placeholder="Select Multiple Options"
              />
            </View>

            <ButtonView style={styles.checkboxRow} activeOpacity={0.7}>
              <Checkbox isChecked={false} onPress={() => {}} />
              <AppText 
                text="Auto-create for all new listings" 
                ml={10} 
                fontSize={14} 
                type="Medium"
              />
            </ButtonView>
            
            {index < sections.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </ScrollView>

      {/* Persistent Footer Button */}
      <View style={styles.footer}>
        <AppButton
          title="Apply Changes"
          onPress={() => navigation.goBack()}
          variant="primary"
          backgroundColor={Colors.TEAL_PRIMARY_ALT}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.verticalScale(50),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(140),
  },
  addMoreRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Metrics.verticalScale(15),
  },
  addMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: Metrics.scale(16),
    paddingVertical: Metrics.verticalScale(8),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  sectionContainer: {
    marginBottom: Metrics.verticalScale(20),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.verticalScale(15),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginVertical: Metrics.verticalScale(30),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(40),
    paddingTop: Metrics.verticalScale(10),
    backgroundColor: 'transparent',
  },
});

export default CategoryInstructionsScreen;