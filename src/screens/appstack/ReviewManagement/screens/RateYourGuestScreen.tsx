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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSuccessVisible, setSuccessVisible] = useState(false);
  const guestName = route.params?.name || 'Ali Masood';

  // Fixed StarRating to match reference UI logic
  const StarRating = ({
    label,
    rating = 4,
  }: {
    label: string;
    rating?: number;
  }) => (
    <View style={styles.ratingSection}>
      <AppText
        text={label}
        type="Bold"
        fontSize={20}
        mb={12}
        color={Colors.PINE_FOREST}
      />
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(index => {
          const isFilled = index <= rating;
          return (
            <Svgicons
              key={index}
              path={isFilled ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'}
              size={24}
              mr={6}
              fill={isFilled ? Colors.BOTTLE_GREEN : Colors.ARGENT}
            />
          );
        })}
        <AppText
          text={`${rating}/5`}
          ml={8}
          fontSize={18}
          color={Colors.SUPER_GREY}
          type="Medium"
        />
      </View>
    </View>
  );

  const onSubmit = (data: any) => {
    console.log(data);
    setSuccessVisible(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <AppText
          text="Rate Your Guest"
          fontSize={26}
          type="Bold"
          color={Colors.PINE_FOREST}
        />
        <Svgicons path="starRewardIcon" size={24} ml={10} />
      </View>

      <AppText
        text={`Tell us how your hosting experience went with ${guestName}, writing a review for guest helps other hosts to manage better experiences in advance.`}
        color={Colors.PINE_FOREST}
        lineHeight={22}
        fontSize={15}
        mb={30}
        opacity={0.7}
      />

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

      <View style={styles.textAreaSection}>
        <TextareaField
          name="review"
          control={control}
          errors={errors}
          label="Write A Review"
          placeholder="Type here"
          multiline
          sparkleIcon
        />
      </View>

      <View style={styles.textAreaSection}>
        <TextareaField
          name="privateNote"
          control={control}
          errors={errors}
          label={`Write a Private note to ${guestName.split(' ')[0]}`}
          placeholder="Type here"
          multiline
          sparkleIcon
        />
      </View>

      <AppButton
        title="Submit Rating"
        onPress={handleSubmit(onSubmit)}
        mt={30}
        mb={50}
        borderColor={Colors.SMOOTH_GREY}
        textStyle={{ color: Colors.PINE_FOREST }}
      />

      <Modal isVisible={isSuccessVisible} backdropOpacity={0.5}>
        <View style={styles.modalContent}>
          <View style={styles.modalIconContainer}>
            <Svgicons path="checkCircleIcon" size={40} fill={Colors.WHITE} />
          </View>
          <AppText
            text="Your review and rating have been submitted. Thank you for sharing your feedback."
            textAlign="center"
            fontSize={16}
            type="Medium"
            color={Colors.PINE_FOREST}
            mb={30}
          />
          <AppButton
            title="Close"
            onPress={() => {
              setSuccessVisible(false);
              goBack();
            }}
            style={styles.modalCloseBtn}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  content: { padding: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  ratingSection: { marginTop: 10 },
  starRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  textAreaSection: { marginBottom: 25 },

  // Modal styling to match confirmation image
  modalContent: {
    backgroundColor: Colors.WHITE,
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalIconContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.WHITE,
    borderRadius: 12,
  },
  modalCloseBtn: {
    width:'100%'
  },
});

export default RateYourGuestScreen;
