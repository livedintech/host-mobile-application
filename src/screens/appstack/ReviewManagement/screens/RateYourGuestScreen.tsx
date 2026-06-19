import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
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

const TAGS_DATA = {
  clean: [
    'Damaged Property',
    'Ignored Checkout Directions',
    'Messy Kitchen',
    'Excessive Rubbish',
    'Ruined Bed Linen',
    'Something Else',
  ],
  cleanPositive: [
    'Neat & Tidy',
    'Took Care Of Rubbish',
    'Kept In Good Position',
    'Something Else',
  ],
  comm: [
    'Unreachable',
    'Unhelpful Response',
    'Disrespectful',
    'Slow Response',
    'Something Else',
  ],
  house: [
    'Arrived Too Early',
    'Stayed Past Checkout',
    'Unapproved Guests',
    'Something Else',
  ],
};

const CLEANLINESS_LABELS: Record<number, string> = {
  1: 'Not at all clean',
  2: 'Not very clean',
  3: 'Fairly clean',
  4: 'Very clean',
  5: 'Extremely clean',
};

const COMMUNICATION_LABELS: Record<number, string> = {
  1: 'Not at all well',
  2: 'Not very well',
  3: 'Fairly well',
  4: 'Very well',
  5: 'Extremely well',
};

const HOUSE_RULES_LABELS: Record<number, string> = {
  1: "Didn't follow any rules",
  2: "Didn't follow most rules",
  3: 'Followed some rules',
  4: 'Followed most rules',
  5: 'Followed all rules',
};

const RateYourGuestScreen = ({ route }: any) => {
  const { t } = useTranslation();

  const reviewId = route.params?.id || 'default';
  const guestName = route.params?.name || 'Guest';

  const { reviews, setStep, updateForm, resetReview } = useRateStore();
  const currentReviewData = reviews[reviewId] || { step: 0, formValues: {} };
  const step = currentReviewData.step;

  const { submitReply, isSubmitting } = useRateGuest();

  const { control, handleSubmit, watch, setValue } = useForm<RateFormValues>({
    defaultValues: {
      cleanliness: currentReviewData.formValues.cleanliness || 0,
      communication: currentReviewData.formValues.communication || 0,
      respect_house_rules:
        currentReviewData.formValues.respect_house_rules || 0,
      clean_tags: currentReviewData.formValues.clean_tags || [],
      comm_tags: currentReviewData.formValues.comm_tags || [],
      house_tags: currentReviewData.formValues.house_tags || [],
      public_review: currentReviewData.formValues.public_review || '',
      recommend: currentReviewData.formValues.recommend ?? null,
      feedback: currentReviewData.formValues.feedback || '',
    },
  });

  const currentValues = watch();

  // --- VALIDATION LOGIC ---
  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1: // Cleanliness
        if (currentValues.cleanliness === 0) {
          Toast.show({
            type: 'error',
            text1: t('app.rate_guest.select_cleanliness_rating'),
          });
          return false;
        }
        if (
          currentValues.cleanliness > 0 &&
          currentValues.cleanliness < 5 &&
          currentValues.clean_tags.length === 0
        ) {
          Toast.show({
            type: 'error',
            text1: t('app.rate_guest.select_tag'),
          });
          return false;
        }
        break;
      case 2: // Communication
        if (currentValues.communication === 0) {
          Toast.show({
            type: 'error',
            text1: t('app.rate_guest.select_communication_rating'),
          });
          return false;
        }
        if (
          currentValues.communication > 0 &&
          currentValues.communication < 5 &&
          currentValues.comm_tags.length === 0
        ) {
          Toast.show({
            type: 'error',
            text1: t('app.rate_guest.select_tag'),
          });
          return false;
        }
        break;
      case 3: // House Rules
        if (currentValues.respect_house_rules === 0) {
          Toast.show({
            type: 'error',
            text1: t('app.rate_guest.select_house_rules_rating'),
          });
          return false;
        }
        if (
          currentValues.respect_house_rules > 0 &&
          currentValues.respect_house_rules < 5 &&
          currentValues.house_tags.length === 0
        ) {
          Toast.show({
            type: 'error',
            text1: t('app.rate_guest.select_tag'),
          });
          return false;
        }
        break;
      case 4: // Public Review
        if (
          !currentValues.public_review ||
          currentValues.public_review.trim().length < 10
        ) {
          Toast.show({
            type: 'error',
            text1: t('app.rate_guest.write_at_least_10_chars'),
          });
          return false;
        }
        break;
      case 5: // Recommend
        if (currentValues.recommend === null) {
          Toast.show({
            type: 'error',
            text1: t('app.rate_guest.choose_recommend'),
          });
          return false;
        }
        if (
          currentValues.recommend === false &&
          (!currentValues.feedback || currentValues.feedback.trim() === '')
        ) {
          Toast.show({
            type: 'error',
            text1: t('app.rate_guest.provide_feedback'),
          });
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

        setTimeout(() => {
          goBack();
        }, 500);
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: error?.message || 'Something went wrong. Please try again.',
        });
      },
    });
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
        const config = [
          {
            title: `How clean did ${guestName} leave your place?`,
            sub: `We'll share this with ${guestName} and other hosts.`,
            field: 'cleanliness' as const,
            tagsField: 'clean_tags' as const,
            icon: 'cleanWaterIcon',
            tags: TAGS_DATA.clean,
            ratingLabels: CLEANLINESS_LABELS,
          },
          {
            title: `How well did ${guestName} communicate?`,
            sub: `We'll share this with ${guestName} and other hosts.`,
            field: 'communication' as const,
            tagsField: 'comm_tags' as const,
            icon: 'cleanWaterIcon',
            tags: TAGS_DATA.comm,
            ratingLabels: COMMUNICATION_LABELS,
          },
          {
            title: `How well did ${guestName} follow your house rules?`,
            sub: `We'll share this with ${guestName} and other hosts.`,
            field: 'respect_house_rules' as const,
            tagsField: 'house_tags' as const,
            icon: 'cleanWaterIcon',
            tags: TAGS_DATA.house,
            ratingLabels: HOUSE_RULES_LABELS,
          },
        ][step - 1];

        const ratingValue = currentValues[config.field] as number;
        const selectedTags = currentValues[config.tagsField] as string[];

        let displayTags = config.tags;
        if (config.field === 'cleanliness') {
          displayTags =
            ratingValue === 4 ? TAGS_DATA.cleanPositive : TAGS_DATA.clean;
        }

        return (
          <View style={styles.stepContainer}>
            <Svgicons path={config.icon} size={40} mb={20} mt={30} />
            <AppText
              text={config.title}
              fontSize={28}
              type="Bold"
              color={Colors.BLACK}
              mb={10}
            />
            <AppText
              text={config.sub}
              fontSize={15}
              color={Colors.DARK_CHARCOAL_OPACITY_74}
              mb={30}
            />
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <ButtonView
                  key={s}
                  onPress={() => {
                    if (
                      config.field === 'cleanliness' &&
                      ((ratingValue === 4 && s !== 4) ||
                        (ratingValue < 4 && s === 4))
                    ) {
                      setValue(config.tagsField, []);
                    }
                    setValue(config.field, s);
                  }}
                >
                  <Svgicons
                    path={
                      s <= ratingValue
                        ? 'reviewStarIcon'
                        : 'reviewStartUnfilledIcon'
                    }
                    size={45}
                    mr={10}
                  />
                </ButtonView>
              ))}
            </View>

            {ratingValue > 0 && (
              <AppText
                text={config.ratingLabels[ratingValue]}
                fontSize={16}
                color={Colors.BLACK}
                mt={25}
              />
            )}

            {ratingValue > 0 && ratingValue < 5 && (
              <View style={styles.tagSection}>
                <AppText
                  text={t('app.rate_guest.tell_what_happened')}
                  type="Bold"
                  fontSize={22}
                  mt={25}
                  mb={15}
                />
                <View style={styles.pillContainer}>
                  {displayTags.map(tag => (
                    <GlassCard
                      key={tag}
                      style={[
                        styles.pill,
                        selectedTags.includes(tag) && styles.activePill,
                      ]}
                    >
                      <ButtonView
                        onPress={() => toggleTag(config.tagsField, tag)}
                      >
                        <AppText
                          text={tag}
                          fontSize={13}
                          color={Colors.BLACK}
                        />
                      </ButtonView>
                    </GlassCard>
                  ))}
                </View>
              </View>
            )}
          </View>
        );
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
              text={`${currentValues.public_review?.length || 0}${t(
                'app.shared.chars_of_1000',
              )}`}
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
              <View style={styles.choiceGradient}>
                <AppButton onPress={() => setValue('recommend', true)} title={t('app.rate_guest.yes')} variant='primary' />
              </View>
              <View style={styles.choiceGradient}>
                <AppButton onPress={() => setValue('recommend', false)} title={t('app.rate_guest.no')} variant='secondary' />
              </View>
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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