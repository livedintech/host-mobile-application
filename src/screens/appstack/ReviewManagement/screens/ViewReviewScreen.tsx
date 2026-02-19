import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';

import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import TextareaField from '@/components/molecules/Input/TextareaField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

import useReviewDetail from '../containers/useReviewDetail';
import Toast from 'react-native-toast-message';

const ViewReviewScreen = () => {
  const route = useRoute<any>();
  const { id } = route.params || {};

  const { reviewDetail, isLoading, starRating, submitReply, isSubmitting } =
    useReviewDetail(id);
    console.log("starRating",starRating)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { reply: '' },
  });

  useEffect(() => {
    if (reviewDetail?.reply_review) {
      setValue('reply', reviewDetail.reply_review);
    }
  }, [reviewDetail, setValue]);

  const onFormSubmit = (data: { reply: string }) => {
    submitReply(
      { review_id: Number(id), content: data.reply },
      {
        onSuccess: () =>
          Toast.show({
            type: 'success',
            text1: 'Reply submitted successfully',
          }),
        onError: () =>
          Toast.show({
            type: 'error',
            text1: 'Failed to Submit Reply',
          }),
      },
    );
  };

  console.log("reviewDetail",reviewDetail)

  const renderStars = (rating: number) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(index => {
        const isFilled = index <= Math.round(rating);
        return (
          <Svgicons
            key={index}
            path={isFilled ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'}
            size={24}
            fill={isFilled ? Colors.BOTTLE_GREEN : Colors.ARGENT}
            mr={4}
          />
        );
      })}
      <AppText
        text={`${rating}/5`}
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

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.BOTTLE_GREEN} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

      {renderStars(starRating)}

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
        text={
          reviewDetail?.review
            ? `${reviewDetail.review.private}`
            : 'No review text available.'
        }
        color={Colors.PINE_FOREST}
        lineHeight={22}
        fontSize={14}
        type="Regular"
        opacity={0.7}
      />

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
        />
        <View style={styles.submitContainer}>
          <AppButton
            title="Submit"
            loading={isSubmitting}
            style={styles.submitBtn}
            textStyle={styles.submitBtnText}
            onPress={handleSubmit(onFormSubmit)}
          />
        </View>
      </View>

      <GradientBorder style={styles.detailsCardGradient} borderRadius={16}>
        <View style={styles.detailsCardInner}>
          <AppText
            text="Detailed Feedback"
            type="Bold"
            fontSize={20}
            mb={20}
            color={Colors.PINE_FOREST}
          />
          <FeedbackBar label="Cleanliness" value={reviewDetail.scores.cleanliness} />
          <FeedbackBar label="Accuracy" value={reviewDetail.scores.accuracy} />
          <FeedbackBar label="Communication" value={reviewDetail.scores.cleanliness} />
          <FeedbackBar label="Location" value={reviewDetail.scores.location} />
          <FeedbackBar label="Check-in" value={reviewDetail.scores.check_in} />
          <FeedbackBar label="Value" value={reviewDetail.scores.value} />
        </View>
      </GradientBorder>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  content: { padding: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  starIconHeader: { padding: 4, marginLeft: 8 },
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
  replyContainer: { marginBottom: 20 },
  submitContainer: { alignItems: 'flex-end', marginTop: 10 },
  submitBtn: { width: 120 },
  submitBtnText: { color: Colors.PINE_FOREST, fontSize: 14 },
  detailsCardGradient: { marginTop: 40, marginBottom: 20 },
  detailsCardInner: { padding: 14, backgroundColor: Colors.WHITE },
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
