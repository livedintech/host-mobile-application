import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import TextareaField from '@/components/molecules/Input/TextareaField'; 
import { goBack, navigate } from '@/services/navigationService';

const StaffNotes = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      specialInstructions: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log('Staff Notes Data:', data);
    // Navigate to next screen
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>


        <View style={styles.container}>
          {/* Main Title */}
          <AppText
            text="Add Instructions for Your Staff"
            fontSize={28}
            type="Bold"
            lineHeight={32}
            mb={16}
          />

          {/* Subtitle / Description */}
          <AppText
            text="Add notes or special instructions for your staff related to this property or task. These notes will help them understand any specific requirements while completing their work."
            fontSize={14}
            color={Colors.DARK_CHARCOAL_OPACITY}
            lineHeight={20}
            mb={30}
          />

          {/* Special Instructions Textarea */}
          <TextareaField
            name="specialInstructions"
            control={control}
            errors={errors}
            label="Special Instructions"
            placeholder='"Need to clean my apartment"'
            multiline={true}
            style={styles.textArea}
            wrapperStyle={styles.textAreaWrapper}
            // Applying transparent/glass look to match design
            // inputContainerStyle={styles.glassInputContainer} 
          />
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <AppButton
            title="Next"
            backgroundColor={Colors.PRIMARY_TEAL}
            borderColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  textAreaWrapper: {
    marginTop: 10,
  },
  textArea: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  glassInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Glass effect
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
  },
  footer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
});

export default StaffNotes;