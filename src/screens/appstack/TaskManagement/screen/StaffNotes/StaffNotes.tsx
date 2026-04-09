import React, { useEffect } from 'react';
import { StyleSheet, View,Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import TextareaField from '@/components/molecules/Input/TextareaField'; 
import useStaffNotesContainer from '../../container/StaffNotesContainer/StaffNotesContainer';
import { useTaskStore } from '@/store/taskStore';

const StaffNotes = () => {
  const { onSubmitNotes, isLoading } = useStaffNotesContainer();
  // Get taskDescription from the store
  const { taskDescription } = useTaskStore();
  
  const {
    control,
    handleSubmit,
    setValue, // Added to update form if store changes
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Use description from store if it exists, otherwise empty string
      specialInstructions: taskDescription || '',
    },
  });

  // sync form if taskDescription arrives late or changes
  useEffect(() => {
    if (taskDescription) {
      setValue('specialInstructions', taskDescription);
    }
  }, [taskDescription, setValue]);

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

      <View style={styles.safeArea}>
        <View style={styles.container}>
          <AppText
            text="Add Instructions for Your Staff"
            fontSize={28}
            type="Bold"
            lineHeight={32}
            mb={16}
            mt={20}
          />

          <AppText
            text="Add notes or special instructions for your staff related to this property or task. These notes will help them understand any specific requirements while completing their work."
            fontSize={14}
            color={Colors.DARK_CHARCOAL_OPACITY}
            lineHeight={20}
            mb={30}
          />

          <TextareaField
            name="specialInstructions"
            control={control}
            errors={errors}
            label="Special Instructions"
            placeholder='"Need to clean my apartment"'
            multiline={true}
            style={styles.textArea}
            wrapperStyle={styles.textAreaWrapper}
          />
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Next"
            backgroundColor={Colors.PRIMARY_TEAL}
            borderColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            onPress={handleSubmit(onSubmitNotes)}
            loading={isLoading}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>

    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 25, paddingTop: 10 },
  textAreaWrapper: { marginTop: 10 },
  textArea: { fontSize: 16, color: Colors.BLACK },
  footer: { paddingHorizontal: 25, paddingBottom: 30 },
});

export default StaffNotes;