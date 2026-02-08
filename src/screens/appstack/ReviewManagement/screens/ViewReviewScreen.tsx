import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import TextareaField from '@/components/molecules/Input/TextareaField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const ViewReviewScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Rating value can be dynamic, setting 4 as per your reference
  const rating = 4;

  const renderStars = (currentRating: number) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(index => {
        const isFilled = index <= currentRating;
        return (
          <Svgicons
            key={index}
            // Logic to switch paths based on rating
            path={isFilled ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'}
            size={24}
            fill={isFilled ? Colors.BOTTLE_GREEN : Colors.ARGENT}
            mr={4}
          />
        );
      })}
      <AppText
        text={`${currentRating}/5`}
        ml={8}
        color={Colors.SUPER_GREY}
        fontSize={18}
        type="Medium"
      />
    </View>
  );

  const FeedbackBar = ({ label, value }: { label: string; value: number }) => (
    <View style={styles.barRow}>
      <AppText
        text={label}
        style={styles.barLabel}
        fontSize={16}
        color={Colors.PINE_FOREST}
        type="Medium"
      />
      <View style={styles.barContainer}>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${(value / 5) * 100}%` }]} />
        </View>
        <AppText
          text={value.toFixed(1)}
          ml={12}
          type="Bold"
          fontSize={14}
          color={Colors.PINE_FOREST}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Overall Rating Section */}
      <View style={styles.headerRow}>
        <AppText
          text="Overall Rating"
          fontSize={24}
          type="Bold"
          color={Colors.PINE_FOREST}
        />
        <ButtonView style={styles.starIconHeader}>
          <Svgicons path="starRewardIcon" size={24} />
        </ButtonView>
      </View>

      {renderStars(rating)}

      {/* Review Text Section */}
      <View style={styles.sectionHeader}>
        <AppText
          text="Review"
          type="Bold"
          fontSize={22}
          color={Colors.PINE_FOREST}
          mr={8}
        />
        <Svgicons path="chatBubbleIcon" size={18} />
      </View>
      <AppText
        text="The stay was absolutely perfect! The host was super responsive, and the property was clean, cozy, and exactly as described. The check-in process was seamless, and the location couldn't have been better. I would definitely book again—highly recommended!"
        color={Colors.PINE_FOREST}
        lineHeight={22}
        fontSize={14}
        type="Regular"
        opacity={0.7}
      />

      {/* Your Reply Section */}
      <View style={styles.replyHeader}>
        <AppText
          text="Your Reply"
          type="Bold"
          fontSize={16}
          color={Colors.PINE_FOREST}
          mr={8}
        />
        <Svgicons path="mailIcon" size={18} />
      </View>

      <View style={styles.replyContainer}>
        <TextareaField
          name="reply"
          control={control}
          errors={errors}
          placeholder="Type here"
          multiline
          style={styles.textarea}
        />
        <View style={styles.submitContainer}>
          <AppButton
            title="Submit"
            style={styles.submitBtn}
            textStyle={styles.submitBtnText}
            onPress={handleSubmit(d => console.log(d))}
          />
        </View>
      </View>

      {/* Detailed Feedback Card */}
      <GradientBorder style={styles.detailsCardGradient} borderRadius={16}>
        <View style={styles.detailsCardInner}>
          <AppText
            text="Detailed Feedback"
            type="Bold"
            fontSize={20}
            mb={20}
            color={Colors.PINE_FOREST}
          />
          <FeedbackBar label="Cleanliness" value={5.0} />
          <FeedbackBar label="Accuracy" value={5.0} />
          <FeedbackBar label="Communication" value={5.0} />
          <FeedbackBar label="Location" value={5.0} />
          <FeedbackBar label="Check-in" value={5.0} />
          <FeedbackBar label="Value" value={5.0} />
        </View>
      </GradientBorder>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  content: { padding: 24 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  starIconHeader: { padding: 4 },
  starRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 12,
  },

  // Reply box styling to match image
  replyContainer: {
    // borderWidth: 1,
    // borderColor: Colors.SMOOTH_GREY,
    // borderRadius: 12,
    // padding: 12,
    // minHeight: 120,
    // justifyContent: 'space-between'
  },
  textarea: {
    // borderWidth: 0,
    // padding: 0,
    // textAlignVertical: 'top'
  },
  submitContainer: {
    alignItems: 'flex-end',
  },
  submitBtn: {
    width: 120,
  },
  submitBtnText: {
    color: Colors.PINE_FOREST,
    fontSize: 14,
  },

  // Detailed Feedback styling
  detailsCardGradient: {
    marginTop: 40,
    marginBottom: 20,
  },
  detailsCardInner: {
    padding: 14,
    backgroundColor: Colors.WHITE,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'space-between',
  },
  barLabel: { flex: 1 },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
    justifyContent: 'flex-end',
  },
  barBg: {
    width: 120,
    height: 4,
    backgroundColor: Colors.ANTI_FLASH_WHITE,
    borderRadius: 2,
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.BOTTLE_GREEN,
    borderRadius: 2,
  },
});

export default ViewReviewScreen;
