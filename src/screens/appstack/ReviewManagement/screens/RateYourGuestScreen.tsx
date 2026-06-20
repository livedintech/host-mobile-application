import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import { goBack } from '@/services/navigationService';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import TextareaField from '@/components/molecules/Input/TextareaField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { useRateGuest } from '../containers/useRateGuest';
import { useRateStore } from '@/store/useRateStore';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Metrics from '@/utility/Metrics';
import Toast from 'react-native-toast-message';
import { getReviewTags } from '@/services/ReviewsApi';

interface RateFormValues {
  cleanliness: number;
  communication: number;
  respect_house_rules: number;
  clean_tags: string[];
  comm_tags: string[];
  house_tags: string[];
  public_review: string;
  recommend: boolean | null;
  feedback: string;
}

// Maps each step to its API category value
const STEP_CATEGORY_MAP: Record<number, string> = {
  1: 'cleanliness',
  2: 'communication',
  3: 'house_rules',
};

// Maps each step to the form field holding the rating
const STEP_RATING_FIELD_MAP: Record<number, keyof RateFormValues> = {
  1: 'cleanliness',
  2: 'communication',
  3: 'respect_house_rules',
};

// Maps each step to the form field holding the selected tags
const STEP_TAGS_FIELD_MAP: Record<number, keyof RateFormValues> = {
  1: 'clean_tags',
  2: 'comm_tags',
  3: 'house_tags',
};

interface StepApiData {
  title: string;
  sub: string;
  rating_label: string;
  nature: 'positive' | 'negative' | string;
  tags: { key: string; label: string }[];
}

const RateYourGuestScreen = ({ route }: any) => {
  const { t } = useTranslation();

  const reviewId = route.params?.id || 'default';
  const guestName = route.params?.name || 'Guest';

  const { reviews, setStep, updateForm, resetReview } = useRateStore();
  const currentReviewData = reviews[reviewId] || { step: 0, formValues: {} };
  const step = currentReviewData.step;

  const { submitReply, isSubmitting } = useRateGuest();

  // Holds per-step API data keyed by `${step}-${rating}`
  const [stepApiData, setStepApiData] = useState<Record<string, StepApiData>>({});
  const [isFetchingTags, setIsFetchingTags] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<RateFormValues>({
    defaultValues: {
      cleanliness: currentReviewData.formValues.cleanliness || 0,
      communication: currentReviewData.formValues.communication || 0,
      respect_house_rules: currentReviewData.formValues.respect_house_rules || 0,
      clean_tags: currentReviewData.formValues.clean_tags || [],
      comm_tags: currentReviewData.formValues.comm_tags || [],
      house_tags: currentReviewData.formValues.house_tags || [],
      public_review: currentReviewData.formValues.public_review || '',
      recommend: currentReviewData.formValues.recommend ?? null,
      feedback: currentReviewData.formValues.feedback || '',
    },
  });

  const currentValues = watch();

  // Fetch tags from API whenever the rating changes on steps 1-3
  const fetchTagsForRating = async (currentStep: number, rating: number) => {
    if (rating === 0 || !STEP_CATEGORY_MAP[currentStep]) return;

    const cacheKey = `${currentStep}-${rating}`;
    if (stepApiData[cacheKey]) return; // already cached

    const category = STEP_CATEGORY_MAP[currentStep];

    setIsFetchingTags(true);
    try {
      const response = await getReviewTags({
        category,
        review_type: 'host_review_guest',
        rating,
        guest_name: guestName,
      });

      setStepApiData(prev => ({
        ...prev,
        [cacheKey]: response.data,
      }));
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load tags. Please try again.',
      });
    } finally {
      setIsFetchingTags(false);
    }
  };

  // Re-fetch whenever step or the current rating for that step changes
  useEffect(() => {
    if (step >= 1 && step <= 3) {
      const ratingField = STEP_RATING_FIELD_MAP[step];
      const rating = currentValues[ratingField] as number;
      if (rating > 0) {
        fetchTagsForRating(step, rating);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // --- VALIDATION LOGIC (unchanged) ---
  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (currentValues.cleanliness === 0) {
          Toast.show({ type: 'error', text1: t('app.rate_guest.select_cleanliness_rating') });
          return false;
        }
        if (
          currentValues.cleanliness > 0 &&
          currentValues.cleanliness < 5 &&
          currentValues.clean_tags.length === 0
        ) {
          Toast.show({ type: 'error', text1: t('app.rate_guest.select_tag') });
          return false;
        }
        break;
      case 2:
        if (currentValues.communication === 0) {
          Toast.show({ type: 'error', text1: t('app.rate_guest.select_communication_rating') });
          return false;
        }
        if (
          currentValues.communication > 0 &&
          currentValues.communication < 5 &&
          currentValues.comm_tags.length === 0
        ) {
          Toast.show({ type: 'error', text1: t('app.rate_guest.select_tag') });
          return false;
        }
        break;
      case 3:
        if (currentValues.respect_house_rules === 0) {
          Toast.show({ type: 'error', text1: t('app.rate_guest.select_house_rules_rating') });
          return false;
        }
        if (
          currentValues.respect_house_rules > 0 &&
          currentValues.respect_house_rules < 5 &&
          currentValues.house_tags.length === 0
        ) {
          Toast.show({ type: 'error', text1: t('app.rate_guest.select_tag') });
          return false;
        }
        break;
      case 4:
        if (!currentValues.public_review || currentValues.public_review.trim().length < 10) {
          Toast.show({ type: 'error', text1: t('app.rate_guest.write_at_least_10_chars') });
          return false;
        }
        break;
      case 5:
        if (currentValues.recommend === null) {
          Toast.show({ type: 'error', text1: t('app.rate_guest.choose_recommend') });
          return false;
        }
        if (
          currentValues.recommend === false &&
          (!currentValues.feedback || currentValues.feedback.trim() === '')
        ) {
          Toast.show({ type: 'error', text1: t('app.rate_guest.provide_feedback') });
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const saveAndNavigate = (targetStep: number) => {
    if (targetStep > step) {
      if (!validateStep(step)) return;
    }
    updateForm(reviewId, currentValues);
    setStep(reviewId, targetStep);
  };

  const handleSaveAndExit = () => {
    updateForm(reviewId, currentValues);
    goBack();
  };

  const toggleTag = (fieldName: keyof RateFormValues, tag: string) => {
    const current = [...(currentValues[fieldName] as string[])];
    const index = current.indexOf(tag);
    if (index > -1) current.splice(index, 1);
    else current.push(tag);
    setValue(fieldName, current as any);
  };

  const handleFinalSubmit = (data: RateFormValues) => {
    if (!validateStep(5)) return;

    const payload = {
      review_id: reviewId,
      respect_house_rules: data.respect_house_rules,
      communication: data.communication,
      cleanliness: data.cleanliness,
      issues: [...data.clean_tags, ...data.comm_tags, ...data.house_tags],
      is_reviewee_recommended: data.recommend,
      public_review: data.public_review,
      private_review: data.feedback,
    };

    submitReply(payload, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: t('app.rate_guest.review_submitted'),
          visibilityTime: 3000,
        });
        resetReview(reviewId);
        setTimeout(() => goBack(), 500);
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: error?.message || 'Something went wrong. Please try again.',
        });
      },
    });
  };

  // --- RENDER RATING STEPS 1-3 with API data ---
  const renderRatingStep = () => {
    const ratingField = STEP_RATING_FIELD_MAP[step];
    const tagsField = STEP_TAGS_FIELD_MAP[step];
    const ratingValue = currentValues[ratingField] as number;
    const selectedTags = currentValues[tagsField] as string[];
    const cacheKey = `${step}-${ratingValue}`;
    const apiData = stepApiData[cacheKey];

    // Fallback static titles while API hasn't responded yet
    const staticTitles: Record<number, { title: string; sub: string }> = {
      1: {
        title: `How clean did ${guestName} leave your place?`,
        sub: `We'll share this with ${guestName} and other hosts.`,
      },
      2: {
        title: `How well did ${guestName} communicate?`,
        sub: `We'll share this with ${guestName} and other hosts.`,
      },
      3: {
        title: `How well did ${guestName} follow your house rules?`,
        sub: `We'll share this with ${guestName} and other hosts.`,
      },
    };

    const title = apiData?.title ?? staticTitles[step].title;
    const sub = apiData?.sub ?? staticTitles[step].sub;
    const ratingLabel = apiData?.rating_label ?? '';
    // Tags from API — only shown when rating > 0 && rating < 5
    const apiTags = apiData?.tags ?? [];

    return (
      <View style={styles.stepContainer}>
        <Svgicons path="cleanWaterIcon" size={40} mb={20} mt={30} />
        <AppText text={title} fontSize={28} type="Bold" color={Colors.BLACK} mb={10} />
        <AppText
          text={sub}
          fontSize={15}
          color={Colors.DARK_CHARCOAL_OPACITY_74}
          mb={30}
        />

        {/* Star Row */}
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(s => (
            <ButtonView
              key={s}
              onPress={() => {
                // Clear tags if rating bucket changes
                if (ratingValue !== s) {
                  setValue(tagsField, [] as any);
                }
                setValue(ratingField, s as any);
                // Trigger API fetch for new rating
                fetchTagsForRating(step, s);
              }}
            >
              <Svgicons
                path={s <= ratingValue ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'}
                size={45}
                mr={10}
              />
            </ButtonView>
          ))}
        </View>

        {/* Rating Label from API */}
        {ratingValue > 0 && (
          isFetchingTags ? (
            <ActivityIndicator
              size="small"
              color={Colors.PRIMARY_TEAL}
              style={{ marginTop: 25 }}
            />
          ) : (
            ratingLabel ? (
              <AppText
                text={ratingLabel}
                fontSize={16}
                color={Colors.BLACK}
                mt={25}
              />
            ) : null
          )
        )}

        {/* Tags from API — shown when rating > 0 and < 5 */}
        {ratingValue > 0 && ratingValue < 5 && (
          <View style={styles.tagSection}>
            {isFetchingTags ? (
              <ActivityIndicator
                size="small"
                color={Colors.PRIMARY_TEAL}
                style={{ marginTop: 20 }}
              />
            ) : apiTags.length > 0 ? (
              <>
                <AppText
                  text={t('app.rate_guest.tell_what_happened')}
                  type="Bold"
                  fontSize={22}
                  mt={25}
                  mb={15}
                />
                <View style={styles.pillContainer}>
                  {apiTags.map(tag => (
                    <GlassCard
                      key={tag.key}
                      style={[
                        styles.pill,
                        selectedTags.includes(tag.key) && styles.activePill,
                      ]}
                    >
                      <ButtonView onPress={() => toggleTag(tagsField, tag.key)}>
                        <AppText text={tag.label} fontSize={13} color={Colors.BLACK} />
                      </ButtonView>
                    </GlassCard>
                  ))}
                </View>
              </>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    const showBackNext = step > 0;
    const isLastStep = step === 5;

    return (
      <View style={styles.footerContainer}>
        {showBackNext ? (
          <View style={styles.actionRow}>
            <View style={styles.btnStyle}>
              <AppButton
                variant='secondary'
                title={t('app.rate_guest.back')}
                onPress={() => saveAndNavigate(step - 1)}
              />
            </View>

            <View style={styles.btnStyle}>
              {isLastStep ? (
                <AppButton
                  variant='primary'
                  title={t('app.rate_guest.submit')}
                  onPress={handleSubmit(handleFinalSubmit)}
                  loading={isSubmitting}
                />
              ) : (
                <AppButton
                  variant='primary'
                  title={t('app.rate_guest.next')}
                  onPress={() => saveAndNavigate(step + 1)}
                />
              )}
            </View>
          </View>
        ) : (
          <AppButton
            variant='primary'
            title={t('app.rate_guest.next')}
            onPress={() => saveAndNavigate(1)}
            mt={12}
          />
        )}

        <AppButton
          variant='secondary'
          title={t('app.rate_guest.save_exit')}
          onPress={handleSaveAndExit}
          mt={12}
        />
      </View>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Svgicons
              path="reviewStartImg"
              size={300}
              style={{ alignSelf: 'center', marginVertical: 30 }}
            />
            <AppText
              text={t('app.shared.write_review_for', { name: guestName })}
              fontSize={28}
              type="Bold"
              color={Colors.BLACK}
            />
            <AppText
              text={t('app.rate_guest.feedback_desc')}
              fontSize={16}
              color={Colors.DARK_CHARCOAL_OPACITY}
              mt={10}
            />
          </View>
        );

      case 1:
      case 2:
      case 3:
        return renderRatingStep();

      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconHeader}>
              <Svgicons path="editIcon" size={32} color={Colors.BLACK} />
            </View>
            <AppText
              text={t('app.rate_guest.write_review')}
              fontSize={28}
              type="Bold"
              color={Colors.BLACK}
              mt={20}
            />
            <AppText
              text={t('app.shared.share_with_hosts', { name: guestName })}
              fontSize={16}
              color={Colors.DARK_CHARCOAL_OPACITY_74}
              mt={10}
              mb={30}
            />
            <TextareaField
              name="public_review"
              control={control}
              errors={{}}
              placeholder={`Say a few words about ${guestName}'s Stay`}
              multiline
              maxLength={1000}
            />
            <AppText
              text={`${currentValues.public_review?.length || 0}${t('app.shared.chars_of_1000')}`}
              fontSize={12}
              color={Colors.SUPER_GREY}
              mt={Metrics.verticalScale(-10)}
            />
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <AppText
              text={t('app.shared.recommend_guest', { name: guestName })}
              fontSize={28}
              type="Bold"
              color={Colors.BLACK}
              mb={20}
              mt={Metrics.verticalScale(30)}
            />
            <View style={styles.recommendRow}>
              <GradientBorder
                colors={
                  currentValues.recommend === true
                    ? ['#000', '#000']
                    : ['rgba(128,128,128,0.6)', '#fff', 'rgba(128,128,128,0.6)']
                }
                borderRadius={32}
                style={styles.choiceGradient}
              >
                <ButtonView
                  onPress={() => setValue('recommend', true)}
                  style={styles.choiceInner}
                >
                  <AppText text={t('app.rate_guest.yes')} type="Medium" color={Colors.BLACK} />
                </ButtonView>
              </GradientBorder>

              <GradientBorder
                colors={
                  currentValues.recommend === false
                    ? ['#000', '#000']
                    : ['rgba(128,128,128,0.6)', '#fff', 'rgba(128,128,128,0.6)']
                }
                borderRadius={32}
                style={styles.choiceGradient}
              >
                <ButtonView
                  onPress={() => setValue('recommend', false)}
                  style={styles.choiceInner}
                >
                  <AppText text={t('app.rate_guest.no')} type="Medium" color={Colors.BLACK} />
                </ButtonView>
              </GradientBorder>
            </View>

            {currentValues.recommend === false && (
              <View style={styles.textAreaBox}>
                <AppText
                  text={t('app.shared.dont_recommend', { name: guestName })}
                  fontSize={22}
                  type="Bold"
                  mt={30}
                  mb={15}
                />
                <TextareaField
                  name="feedback"
                  control={control}
                  errors={{}}
                  placeholder={t('app.rate_guest.private_feedback_placeholder')}
                  multiline
                />
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.safeArea}>
            <View style={styles.mainWrapper}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {renderStepContent()}
              </ScrollView>
              {renderFooter()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  mainWrapper: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  stepContainer: { flex: 1 },
  iconHeader: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  starRow: { flexDirection: 'row', marginTop: 10 },
  tagSection: { marginTop: 10 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  activePill: {
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8.1,
    elevation: 5,
  },
  recommendRow: { flexDirection: 'row', gap: 15 },
  choiceGradient: { flex: 1 },
  choiceInner: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 32,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  buttonInner: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 28,
  },
  btnStyle: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 50,
  },
  textAreaBox: { marginTop: 10 },
});

export default RateYourGuestScreen;