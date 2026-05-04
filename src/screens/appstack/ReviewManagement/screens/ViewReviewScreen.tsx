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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const route = useRoute<any>();
  const { id } = route.params || {};

  const { reviewDetail, isLoading, submitReply, isSubmitting } =
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
    const apiReply = reviewDetail?.reply?.content || reviewDetail?.reply_review;
    if (apiReply) {
      setValue('reply', apiReply);
    }
  }, [reviewDetail, setValue]);

  const onFormSubmit = (data: { reply: string }) => {
    submitReply(
      { review_id: Number(id), content: data.reply },
      {
        onSuccess: () =>
          Toast.show({
            type: 'success',
            text1: t('app.view_review.reply_submitted'),
          }),
        onError: () =>
          Toast.show({ type: 'error', text1: t('app.view_review.reply_submit_failed') }),
      },
    );
  };

  const formatText = (value: any) => {
    return value?.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const isBookingCom = reviewDetail?.booking?.platform === 'BookingCom';
  const hasExistingReply = !!(
    reviewDetail?.reply?.content || reviewDetail?.reply_review
  );

  // Constants for scaling
  const maxScale = isBookingCom ? 10 : 5;
  // Get overall score from your specific path: reviewDetail.overall.stars
  const overallScore = Number(reviewDetail?.overall?.stars) || 0;

  const generateLabel = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getDynamicIcon = (key: string) => {
    const iconMap: Record<string, string> = {
      accuracy: 'accuracy',
      communication: 'communication',
      location: 'location',
      check_in: 'checkIn',
      cleanliness: 'cleanliness',
      comfort: 'comfort',
      facilities: 'facilities',
      value: 'value',
      staff: 'staff',
    };
    return iconMap[key] || 'starIcon';
  };

  /**
   * REUSABLE FEEDBACK BAR COMPONENT
   */
  const FeedbackBar = ({
    label,
    value,
    icon,
    isLarge = false,
  }: {
    label: string;
    value: number;
    icon: string;
    isLarge?: boolean;
  }) => (
    <View style={styles.barItemContainer}>
      <View style={styles.barLabelRow}>
        <View style={[styles.iconBox, isLarge && styles.largeIconBox]}>
          <Svgicons path={icon} size={isLarge ? 24 : 18} />
        </View>
        <AppText
          text={label}
          fontSize={isLarge ? 18 : 15}
          color={Colors.BLACK}
          type="Medium"
          ml={12}
        />
      </View>
      <View style={styles.progressSection}>
        <View style={[styles.barBg, isLarge && styles.largeBarBg]}>
          <View
            style={[styles.barFill, { width: `${(value / maxScale) * 100}%` }]}
          />
        </View>
        <AppText
          text={value.toFixed(1)}
          ml={12}
          type="Bold"
          fontSize={isLarge ? 16 : 12}
          color={isLarge ? Colors.BLACK : Colors.PINE_FOREST}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.MEDIUM_JUNGLE_GREEN} />
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

        {isBookingCom ? (
          <AppText
            text={reviewDetail?.review?.headline || ''}
            fontSize={28}
            type="Bold"
            color={Colors.BLACK}
            mb={30}
          />
        ) : (
          <AppText
            text={t('app.view_review.overall_rating')}
            fontSize={28}
            type="Bold"
            color={Colors.BLACK}
            mb={60}
          />
        )}

        {/* --- REVIEW TEXT SECTION --- */}
      {isBookingCom &&  <View style={{ marginBottom: 20 }}>
          {/* Positive Section */}
          <AppText
            text={t('app.view_review.likes_label')}
            fontSize={16}
            type="Bold"
            color={Colors.BLACK}
            mb={10}
          />
          <AppText
            text={
              formatText(reviewDetail?.review?.positive) ||
              'No feedback provided.'
            }
            color={Colors.DARK_CHARCOAL_OPACITY_74}
            lineHeight={18}
            fontSize={14}
            type="Regular"
            mb={40}
          />

          {/* Negative Section */}
          <AppText
            text={t('app.view_review.dislikes_label')}
            fontSize={16}
            type="Bold"
            color={Colors.BLACK}
            mb={10}
          />
          <AppText
            text={
              formatText(reviewDetail?.review?.negative) ||
              'No specific complaints provided.'
            }
            color={Colors.DARK_CHARCOAL_OPACITY_74}
            lineHeight={18}
            fontSize={14}
            type="Regular"
            mb={30}
          />
        </View>}

        {/* --- OVERALL RATING UI BLOCK (From Screenshot) --- */}
        {isBookingCom && (
          <View style={styles.overallRatingWrapper}>
            <FeedbackBar
              label="Overall Rating"
              value={overallScore}
              icon="identityCard"
              isLarge={true}
            />
          </View>
        )}

        <GlassCard width="100%" style={styles.glassCard}>
          <View style={styles.glassHeader}>
            <AppText
              text={t('app.view_review.guest_property_ratings')}
              fontSize={18}
              type="Medium"
              color={Colors.BLACK}
            />
            <View style={styles.idIconBox}>
              <Svgicons path="identityCard" size={25} />
            </View>
          </View>

          {reviewDetail?.scores &&
            Object.entries(reviewDetail.scores).map(([key, value]) => (
              <FeedbackBar
                key={key}
                label={generateLabel(key)}
                value={Number(value) || 0}
                icon={getDynamicIcon(key)}
              />
            ))}
        </GlassCard>

        {isBookingCom && (
          <>
            <AppText
              text={t('app.view_review.your_reply')}
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
                placeholder={t('app.view_review.no_response')}
                multiline
                style={[
                  styles.textArea,
                  hasExistingReply && styles.disabledTextArea,
                ]}
                editable={!hasExistingReply}
              />
            </View>

            {!hasExistingReply && (
              <AppText
                text={`${replyText?.length || 0}/500 characters`}
                fontSize={12}
                color={Colors.DARK_CHARCOAL}
                mt={0}
              />
            )}
          </>
        )}

        {isBookingCom && !hasExistingReply && (
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
                  text={isSubmitting ? 'Submitting...' : 'Submit'}
                  fontSize={16}
                  type="Medium"
                  color={Colors.BLACK}
                />
              </ButtonView>
            </GradientBorder>

            <AppButton
              title={t('app.view_review.save_exit')}
              onPress={() =>
                navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT)
              }
              style={styles.exitBtn}
              color={Colors.WHITE}
              backgroundColor={Colors.BOTTLE_GREEN}
              borderColor={Colors.BOTTLE_GREEN}
            />
          </View>
        )}
      </ScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 60,
  },
  headerTitleRow: { marginBottom: 20 },
  overallRatingWrapper: {
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 15,
  },
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
  barItemContainer: { marginBottom: 12 },
  barLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconBox: {
    width: 34,
    height: 34,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeIconBox: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.6)',
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
  largeBarBg: {
    height: 6,
  },
  barFill: { height: '100%', backgroundColor: '#40B69C', borderRadius: 2 },
  replyBox: { marginTop: 5 },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 15,
    borderBottomWidth: 0,
  },
  disabledTextArea: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    color: Colors.DARK_CHARCOAL,
  },
  bottomButtons: { marginTop: 30 },
  fullWidthGradient: { width: '100%', marginBottom: 15 },
  submitInner: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  exitBtn: { height: 52, backgroundColor: '#1DBB9F', borderRadius: 28 },
});

export default ViewReviewScreen;