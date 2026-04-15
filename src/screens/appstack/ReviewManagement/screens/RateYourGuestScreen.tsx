import React from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
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

// Updated TAGS_DATA to support 4-star specific tags
const TAGS_DATA = {
  clean: ['Damaged Property', 'Ignored Checkout Directions', 'Messy Kitchen', 'Excessive Rubbish', 'Ruined Bed Linen', 'Something Else'],
  cleanPositive: ['Neat & Tidy', 'Took Care Of Rubbish', 'Kept In Good Position', 'Something Else'],
  comm: ['Unreachable', 'Unhelpful Response', 'Disrespectful', 'Slow Response', 'Something Else'],
  house: ['Arrived Too Early', 'Stayed Past Checkout', 'Unapproved Guests', 'Something Else'],
};

const RATING_LABELS: Record<number, string> = {
  1: 'Not at all clean', 2: 'Not very clean', 3: 'Fairly clean', 4: 'Very clean', 5: 'Extremely clean',
};

const RateYourGuestScreen = ({ route }: any) => {
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

  const saveAndNavigate = (targetStep: number) => {
    updateForm(reviewId, currentValues);
    setStep(reviewId, targetStep);
  };

  const handleSaveAndExit = () => {
    updateForm(reviewId, currentValues);
    goBack();
  };

const toggleTag = (fieldName: keyof RateFormValues, tag: string) => {
    // We cast to string[] to tell TS we know this specific field is an array
    const current = [...(currentValues[fieldName] as string[])];
    const index = current.indexOf(tag);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(tag);
    }
    
    // Use 'as any' here because React Hook Form's setValue is strict 
    // and we are handling the array manipulation manually
    setValue(fieldName, current as any);
  };
  const handleFinalSubmit = (data: RateFormValues) => {
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
        resetReview(reviewId);
        goBack();
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
              <ButtonView onPress={() => saveAndNavigate(step - 1)} style={styles.buttonInner}>
                <AppText text="Back" fontSize={16} type="Medium" color={Colors.BLACK} />
              </ButtonView>
            </View>

            <View style={styles.btnStyle}>
              {isLastStep ? (
                <AppButton
                  title="Submit"
                  onPress={handleSubmit(handleFinalSubmit)}
                  loading={isSubmitting}
                  variant="primary"
                  backgroundColor={Colors.WHITE}
                  color={Colors.BLACK}
                  borderRadius={28}
                  style={{ paddingVertical: Metrics.verticalScale(11) }} 
                />
              ) : (
                <ButtonView onPress={() => saveAndNavigate(step + 1)} style={styles.buttonInner}>
                  <AppText text="Next" fontSize={16} type="Medium" color={Colors.BLACK} />
                </ButtonView>
              )}
            </View>
          </View>
        ) : (
          <AppButton
            title="Next"
            onPress={() => saveAndNavigate(1)}
            color={Colors.WHITE}
            backgroundColor={Colors.BOTTLE_GREEN}
            borderColor={Colors.BOTTLE_GREEN}
          />
        )}

        <AppButton
          title="Save & Exit"
          onPress={handleSaveAndExit}
          color={Colors.WHITE}
          backgroundColor={Colors.BOTTLE_GREEN}
          borderColor={Colors.BOTTLE_GREEN}
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
            <Svgicons path="reviewStartImg" size={300} style={{ alignSelf: 'center', marginVertical: 30 }} />
            <AppText text={`Write a review for\n${guestName}`} fontSize={28} type="Bold" color={Colors.BLACK} />
            <AppText text="Your feedback helps other hosts manage better experiences." fontSize={16} color={Colors.DARK_CHARCOAL_OPACITY} mt={10} />
          </View>
        );
      case 1:
      case 2:
      case 3:
        const config = [
          { title: `How clean did ${guestName} leave your place?`, sub: `We’ll share this with ${guestName} and other hosts.`, field: 'cleanliness' as const, tagsField: 'clean_tags' as const, icon: 'cleanWaterIcon', tags: TAGS_DATA.clean },
          { title: 'Communication', sub: 'Was the guest easy to reach?', field: 'communication' as const, tagsField: 'comm_tags' as const, icon: 'cleanWaterIcon', tags: TAGS_DATA.comm },
          { title: 'Respect House Rules', sub: 'Did the guest follow rules?', field: 'respect_house_rules' as const, tagsField: 'house_tags' as const, icon: 'cleanWaterIcon', tags: TAGS_DATA.house },
        ][step - 1];

        const ratingValue = currentValues[config.field] as number;
        const selectedTags = currentValues[config.tagsField] as string[];

        // Logic to switch tags for 4 stars vs 1-3 stars
        let displayTags = config.tags;
        if (config.field === 'cleanliness') {
            displayTags = ratingValue === 4 ? TAGS_DATA.cleanPositive : TAGS_DATA.clean;
        }

        return (
          <View style={styles.stepContainer}>
            <Svgicons path={config.icon} size={40} mb={20} mt={30} />
            <AppText text={config.title} fontSize={28} type="Bold" color={Colors.BLACK} mb={10} />
            <AppText text={config.sub} fontSize={15} color={Colors.DARK_CHARCOAL_OPACITY_74} mb={30} />
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <ButtonView key={s} onPress={() => {
                    // Reset tags if switching between positive (4) and negative (1-3)
                    if (config.field === 'cleanliness' && ((ratingValue === 4 && s !== 4) || (ratingValue < 4 && s === 4))) {
                        setValue(config.tagsField, []);
                    }
                    setValue(config.field, s);
                }}>
                  <Svgicons path={s <= ratingValue ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'} size={45} mr={10} />
                </ButtonView>
              ))}
            </View>
            {ratingValue > 0 && <AppText text={RATING_LABELS[ratingValue]} fontSize={16} color={Colors.BLACK} mt={25} />}
            
            {/* Show tags for ratings 1, 2, 3, AND 4. Hide for 5 or 0. */}
            {ratingValue > 0 && ratingValue < 5 && (
              <View style={styles.tagSection}>
                <AppText text="Tell us what happened" type="Bold" fontSize={22} mt={25} mb={15} />
                <View style={styles.pillContainer}>
                  {displayTags.map(tag => (
                    <GlassCard key={tag} style={[styles.pill, selectedTags.includes(tag) && styles.activePill]}>
                      <ButtonView onPress={() => toggleTag(config.tagsField, tag)}>
                        <AppText text={tag} fontSize={13} color={Colors.BLACK} />
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
            <View style={styles.iconHeader}><Svgicons path="editIcon" size={32} color={Colors.BLACK} /></View>
            <AppText text="Write a public review" fontSize={28} type="Bold" color={Colors.BLACK} mt={20} />
            <AppText text={`We’ll share this with ${guestName} and other hosts.`} fontSize={16} color={Colors.DARK_CHARCOAL_OPACITY_74} mt={10} mb={30} />
            <TextareaField name="public_review" control={control} errors={{}} placeholder={`Say a few words about ${guestName}'s Stay`} multiline maxLength={1000} />
            <AppText text={`${currentValues.public_review?.length || 0}/1000 characters`} fontSize={12} color={Colors.SUPER_GREY} mt={Metrics.verticalScale(-10)} />
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <AppText text={`Would you recommend ${guestName}?`} fontSize={28} type="Bold" color={Colors.BLACK} mb={20} mt={Metrics.verticalScale(30)} />
            <View style={styles.recommendRow}>
              <GradientBorder colors={currentValues.recommend === true ? ['#000', '#000'] : ['rgba(128,128,128,0.6)', '#fff', 'rgba(128,128,128,0.6)']} borderRadius={32} style={styles.choiceGradient}>
                <ButtonView onPress={() => setValue('recommend', true)} style={styles.choiceInner}><AppText text="Yes" type="Medium" color={Colors.BLACK} /></ButtonView>
              </GradientBorder>
              <GradientBorder colors={currentValues.recommend === false ? ['#000', '#000'] : ['rgba(128,128,128,0.6)', '#fff', 'rgba(128,128,128,0.6)']} borderRadius={32} style={styles.choiceGradient}>
                <ButtonView onPress={() => setValue('recommend', false)} style={styles.choiceInner}><AppText text="No" type="Medium" color={Colors.BLACK} /></ButtonView>
              </GradientBorder>
            </View>
            {currentValues.recommend === false && (
              <View style={styles.textAreaBox}>
                <AppText text={`Why don't you recommend ${guestName}?`} fontSize={22} type="Bold" mt={30} mb={15} />
                <TextareaField name="feedback" control={control} errors={{}} placeholder="Tell us more (Private feedback)" multiline />
              </View>
            )}
          </View>
        );
      default: return null;
    }
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <View style={styles.mainWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
            {renderStepContent()}
          </ScrollView>
          {renderFooter()}
        </View>
      </View>
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
  pill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  activePill: {
    borderWidth: 1.5,
    borderColor: Colors.BOTTLE_GREEN,
    backgroundColor: 'rgba(29, 187, 159, 0.05)',
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