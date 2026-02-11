import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Modal from 'react-native-modal';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import { goBack } from '@/services/navigationService';
import AppText from '@/components/molecules/AppText/AppText';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { useRateGuest } from '../containers/useRateGuest';

// Tags extracted from your image
const HOUSE_RULES_TAGS = [
  { label: 'Arrived too early', value: 'Arrived too early' },
  { label: 'Stayed past checkout', value: 'Stayed past checkout' },
  { label: 'Unapproved guests', value: 'Unapproved guests' },
  { label: 'Unapproved pet', value: 'Unapproved pet' },
  { label: 'Didn’t respect quiet hours', value: 'Didn’t respect quiet hours' },
  { label: 'Unapproved filming or photography', value: 'Unapproved filming or photography' },
  { label: 'Unapproved event', value: 'Unapproved event' },
  { label: 'Smoking', value: 'Smoking' },
];

const COMMUNICATION_TAGS = [
  { label: 'Helpful messages', value: 'Helpful messages' },
  { label: 'Respectful', value: 'Respectful' },
  { label: 'Always responded', value: 'Always responded' },
  { label: 'Unhelpful responses', value: 'Unhelpful responses' },
  { label: 'Disrespectful', value: 'Disrespectful' },
  { label: 'Unreachable', value: 'Unreachable' },
  { label: 'Slow responses', value: 'Slow responses' },
];

const CLEANLINESS_TAGS = [
  { label: 'Neat & tidy', value: 'Neat & tidy' },
  { label: 'Kept in good condition', value: 'Kept in good condition' },
  { label: 'Took care of garbage', value: 'Took care of garbage' },
  { label: 'Ignored check-out directions', value: 'Ignored check-out directions' },
  { label: 'Excessive garbage', value: 'Excessive garbage' },
  { label: 'Messy kitchen', value: 'Messy kitchen' },
  { label: 'Damaged property', value: 'Damaged property' },
  { label: 'Ruined bed linens', value: 'Ruined bed linens' },
];

const RateYourGuestScreen = ({ route }: any) => {
  const { submitReply, isSubmitting } = useRateGuest();
  const [isSuccessVisible, setSuccessVisible] = useState(false);
  
  const guestName = route.params?.name || 'Guest';
  const reviewId = route.params?.id;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Set default rating to 1 star as requested
      respect_house_rules: 1,
      communication: 1,
      cleanliness: 1,
      house_tags: [],
      comm_tags: [],
      clean_tags: [],
      public_review: '',
      private_review: '',
    },
  });

  const onSubmit = (data: any) => {
    const combinedTags = [
      ...(data.house_tags || []),
      ...(data.comm_tags || []),
      ...(data.clean_tags || []),
    ];

    const payload = {
      review_id: reviewId,
      respect_house_rules: data.respect_house_rules,
      communication: data.communication,
      cleanliness: data.cleanliness,
      public_review: data.public_review,
      private_review: data.private_review,
      // Logic: returns true if 4 or 5, else false
      // is_reviewee_recommended: data.respect_house_rules >= 4, 
      is_reviewee_recommended : true,
      tags: combinedTags,
    };

    submitReply(payload, {
      onSuccess: () => setSuccessVisible(true),
    });
  };

  const StarRatingInput = ({ name, label }: { name: string; label: string }) => (
    <Controller
      control={control}
      name={name as any}
      render={({ field: { onChange, value } }) => (
        <View style={styles.ratingSection}>
          <AppText text={label} type="Bold" fontSize={20} mb={12} color={Colors.PINE_FOREST} />
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((index) => (
              <TouchableOpacity key={index} onPress={() => onChange(index)}>
                <Svgicons
                  path={index <= value ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'}
                  size={24}
                  mr={6}
                  fill={index <= value ? Colors.BOTTLE_GREEN : Colors.ARGENT}
                />
              </TouchableOpacity>
            ))}
            <AppText text={`${value}/5`} ml={8} fontSize={18} color={Colors.SUPER_GREY} type="Medium" />
          </View>
        </View>
      )}
    />
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <AppText text="Rate Your Guest" fontSize={26} type="Bold" color={Colors.PINE_FOREST} />
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

      <StarRatingInput name="respect_house_rules" label="Respect House rules" />
      <MultiSelectDropdownField
        name="house_tags"
        control={control}
        errors={errors}
        label="Select all that apply"
        data={HOUSE_RULES_TAGS}
      />

      <StarRatingInput name="communication" label="Communication" />
      <MultiSelectDropdownField
        name="comm_tags"
        control={control}
        errors={errors}
        label="Select all that apply"
        data={COMMUNICATION_TAGS}
      />

      <StarRatingInput name="cleanliness" label="Cleanliness" />
      <MultiSelectDropdownField
        name="clean_tags"
        control={control}
        errors={errors}
        label="Select all that apply"
        data={CLEANLINESS_TAGS}
      />

      <View style={styles.textAreaSection}>
        <TextareaField
          name="public_review"
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
          name="private_review"
          control={control}
          errors={errors}
          label={`Write a Private note to ${guestName.split(' ')[0]}`}
          placeholder="Type here"
          multiline
          sparkleIcon
        />
      </View>

      <AppButton
        title={isSubmitting ? "Submitting..." : "Submit Rating"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        mt={30}
        mb={50}
        borderColor={Colors.SMOOTH_GREY}
        textStyle={{ color: Colors.PINE_FOREST }}
      />

      <Modal isVisible={isSuccessVisible} backdropOpacity={0.5}>
        <View style={styles.modalContent}>
          <View style={styles.modalIconContainer}>
            <Svgicons path="checkCircleIcon" size={40} fill={Colors.BOTTLE_GREEN} />
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
  modalContent: {
    backgroundColor: Colors.WHITE,
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY
  },
  modalIconContainer: { marginBottom: 20 },
  modalCloseBtn: { width: '100%' },
});

export default RateYourGuestScreen;