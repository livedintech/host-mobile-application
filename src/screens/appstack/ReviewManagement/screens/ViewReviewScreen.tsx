import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import TextareaField from '@/components/molecules/Input/TextareaField';
import AppButton from '@/components/molecules/AppButton/AppButton';

import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

import useReviewDetail from '../containers/useReviewDetail';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const ViewReviewScreen = () => {
  const route = useRoute<any>();
  const { id } = route.params || {};

  const { reviewDetail, isLoading, starRating, submitReply, isSubmitting } =
    useReviewDetail(id);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { reply: '' },
  });

  const replyText = watch('reply');

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
          Toast.show({ type: 'error', text1: 'Failed to Submit Reply' }),
      },
    );
  };

  // UPDATED: Bar is now below the Label
  const FeedbackBar = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: number;
    icon: string;
  }) => (
    <View style={styles.barItemContainer}>
      <View style={styles.barLabelRow}>
        <View style={styles.iconBox}>
          <Svgicons path={icon} size={18} />
        </View>
        <AppText
          text={label}
          fontSize={15}
          color={Colors.BLACK}
          type="Medium"
          ml={12}
        />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${(value / 5) * 100}%` }]} />
        </View>
        <AppText
          text={value.toFixed(1)}
          ml={12}
          type="Bold"
          fontSize={12}
          color={Colors.PINE_FOREST}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.BOTTLE_GREEN} />
      </View>
    );
  }

  const borderColors = [
    'rgba(128, 128, 128, 0.66)',
    'rgba(255, 255, 255, 0.66)',
    'rgba(128, 128, 128, 0.66)',
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTitleRow}>
          <Svgicons path="smileIcon" size={32} />
        </View>
        <AppText
          text="Overall Rating"
          fontSize={30}
          type="Bold"
          color={Colors.BLACK}
          mb={30}
        />

        <AppText
          text={reviewDetail?.review?.private || 'No review text provided.'}
          color={Colors.DARK_CHARCOAL_OPACITY_74}
          lineHeight={22}
          fontSize={15}
          type="Regular"
          style={styles.description}
        />

        <GlassCard width="100%" style={styles.glassCard}>
          <View style={styles.glassHeader}>
            <AppText
              text="Guest Property Ratings"
              fontSize={18}
              type="Medium"
              color={Colors.BLACK}
            />
            <View style={styles.idIconBox}>
              <Svgicons path="identityCard" size={25} />
            </View>
          </View>

          <FeedbackBar
            label="Booking Platform"
            value={starRating || 5.0}
            icon="bookingPlatform"
          />
          <FeedbackBar
            label="Accuracy"
            value={reviewDetail?.scores?.accuracy || 0}
            icon="accuracy"
          />
          <FeedbackBar
            label="Communication"
            value={reviewDetail?.scores?.communication || 0}
            icon="communication"
          />
          <FeedbackBar
            label="Location"
            value={reviewDetail?.scores?.location || 0}
            icon="location"
          />
          <FeedbackBar
            label="Check-in"
            value={reviewDetail?.scores?.check_in || 0}
            icon="checkIn"
          />
          <FeedbackBar
            label="Value"
            value={reviewDetail?.scores?.value || 0}
            icon="value"
          />
        </GlassCard>

        <AppText
          text="Your Reply"
          type="Bold"
          fontSize={26}
          color={Colors.BLACK}
          mt={30}
          mb={15}
        />

        <View style={styles.replyBox}>
          <TextareaField
            name="reply"
            control={control}
            errors={errors}
            placeholder="Thank you for your response..."
            multiline
            style={styles.textArea}
          />
        </View>
        <AppText
          text={`${replyText?.length || 0}/500 characters`}
          fontSize={12}
          color={Colors.DARK_CHARCOAL}
          mt={0}
        />

        <View style={styles.bottomButtons}>
          <GradientBorder
            colors={borderColors}
            borderRadius={28}
            style={styles.fullWidthGradient}
          >
            <ButtonView
              onPress={handleSubmit(onFormSubmit)}
              style={styles.submitInner}
            >
              <AppText
                text="Submit"
                fontSize={16}
                type="Medium"
                color={Colors.BLACK}
              />
            </ButtonView>
          </GradientBorder>

          <AppButton
            title="Save & Exit"
            onPress={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT)}
            style={styles.exitBtn}
            color={Colors.WHITE}
            backgroundColor={Colors.BOTTLE_GREEN}
            borderColor={Colors.BOTTLE_GREEN}
          />
        </View>
      </ScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 60,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitleRow: { marginBottom: 30 },
  description: { marginBottom: 40, lineHeight: 22 },
  glassCard: { padding: 20 },
  glassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  idIconBox: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
  },

  // Bar Styling matching the image
  barItemContainer: { marginBottom: 12 },
  barLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
  iconBox: {
    width: 34,
    height: 34,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 46,
  },
  barBg: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 2,
  },
  barFill: { height: '100%', backgroundColor: '#40B69C', borderRadius: 2 }, // Teal color from img

  replyBox: { marginTop: 5 },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 15,
    borderBottomWidth: 0,
  },
  bottomButtons: { marginTop: 30 },
  fullWidthGradient: { width: '100%', marginBottom: 15 },
  submitInner: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  exitBtn: { 
    height: 52, backgroundColor: '#1DBB9F', borderRadius: 28 },
  exitBtnText: {},
});

export default ViewReviewScreen;
