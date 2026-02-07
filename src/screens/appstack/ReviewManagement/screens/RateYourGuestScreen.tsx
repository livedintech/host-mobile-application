import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';

import Modal from 'react-native-modal';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import { goBack } from '@/services/navigationService';
import AppText from '@/components/molecules/AppText/AppText';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import AppButton from '@/components/molecules/AppButton/AppButton';

const RateYourGuestScreen = ({ route }: any) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [isSuccessVisible, setSuccessVisible] = useState(false);
  const guestName = route.params?.name || "Ali Masood";

  const StarRating = ({ label }: { label: string }) => (
    <View style={styles.ratingSection}>
      <AppText text={label} type="Bold" fontSize={18} mb={10} />
      <View style={styles.starRow}>
         {[1,2,3,4,5].map(s => <Svgicons key={s} path="StarIcon" size={25} mr={5} fill={s <= 4 ? Colors.BOTTLE_GREEN : Colors.SMOOTH_GREY}/>)}
         <AppText text="4/5" ml={10} />
      </View>
    </View>
  );

  const onSubmit = (data: any) => {
    console.log(data);
    setSuccessVisible(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <AppText text="Rate Your Guest" fontSize={24} type="Bold" mb={10} />
      <AppText text={`Tell us how your hosting experience went with ${guestName}...`} color={Colors.SUPER_GREY} mb={20} />

      <StarRating label="Respect House rules" />
      <MultiSelectDropdownField
        name="rules"
        control={control}
        errors={errors}
        label="Select all that apply"
        data={[{ label: 'Arrived on time', value: '1' }]}
      />

      <StarRating label="Communication" />
      <MultiSelectDropdownField
        name="comm"
        control={control}
        errors={errors}
        label="Select all that apply"
        data={[{ label: 'Helpful Messages', value: '1' }]}
      />

      <StarRating label="Cleanliness" />
      <MultiSelectDropdownField
        name="clean"
        control={control}
        errors={errors}
        label="Select all that apply"
        data={[{ label: 'Neat & Clean', value: '1' }]}
      />

      <TextareaField
        name="review"
        control={control}
        errors={errors}
        label="Write A Review"
        placeholder="Type here"
        multiline
        sparkleIcon
      />

      <TextareaField
        name="privateNote"
        control={control}
        errors={errors}
        label={`Write a Private note to ${guestName.split(' ')[0]}`}
        placeholder="Type here"
        multiline
        sparkleIcon
      />

      <AppButton title="Submit Rating" color={Colors.WHITE} backgroundColor={Colors.BOTTLE_GREEN} onPress={handleSubmit(onSubmit)} mt={20} mb={40}/>

      <Modal isVisible={isSuccessVisible}>
        <View style={styles.modalContent}>
          <Svgicons path="CheckCircleIcon" size={50} mb={20} />
          <AppText text="Your review and rating have been submitted. Thank you for sharing your feedback." textAlign="center" mb={20} />
          <AppButton title="Close" onPress={() => { setSuccessVisible(false); goBack(); }} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  ratingSection: { marginBottom: 15 },
  starRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  modalContent: { backgroundColor: Colors.WHITE, padding: 30, borderRadius: 20, alignItems: 'center' }
});

export default RateYourGuestScreen;