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

const TAGS_DATA = {
  clean: ['Damaged Property', 'Messy Kitchen', 'Excessive Rubbish', 'Ruined Bed Linen'],
  comm: ['Disrespectful', 'Unreachable', 'Slow responses', 'Unhelpful'],
  house: ['Arrived too early', 'Unapproved pet', 'Smoking', 'Unapproved event'],
};

const RateYourGuestScreen = ({ route }: any) => {
  const { step, setStep, formValues, updateForm, resetStore } = useRateStore();
  const { submitReply, isSubmitting } = useRateGuest();
  const guestName = route.params?.name || 'Guest';

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: formValues,
  });

  const currentValues = watch();

  const saveAndNavigate = (targetStep: number) => {
    updateForm(currentValues);
    setStep(targetStep);
  };

  const handleSaveAndExit = () => {
    updateForm(currentValues);
    goBack();
  };

  const toggleTag = (fieldName: string, tag: string) => {
    const current = [...(currentValues[fieldName as keyof typeof currentValues] as string[])];
    const index = current.indexOf(tag);
    if (index > -1) current.splice(index, 1);
    else current.push(tag);
    setValue(fieldName as any, current);
  };

  const handleFinalSubmit = (data: any) => {
    const payload = {
      review_id: route.params?.id,
      respect_house_rules: data.respect_house_rules,
      communication: data.communication,
      cleanliness: data.cleanliness,
      tags: [...data.clean_tags, ...data.comm_tags, ...data.house_tags],
      is_reviewee_recommended: data.recommend,
      private_review: data.feedback,
    };

    submitReply(payload, {
      onSuccess: () => {
        resetStore();
        goBack();
      },
    });
  };

  const renderRatingUI = (title: string, sub: string, field: string, tagsField: string, icon: string, tagsList: string[]) => {
    const ratingValue = currentValues[field as keyof typeof currentValues] as number;
    const selectedTags = currentValues[tagsField as keyof typeof currentValues] as string[];

    return (
      <View style={styles.stepContainer}>
        <Svgicons path={icon} size={40} mb={20} mt={30} />
        <AppText text={title} fontSize={28} type="Bold" color={Colors.BLACK} mb={10} />
        <AppText text={sub} fontSize={15} color={Colors.DARK_CHARCOAL_OPACITY_74} mb={30} />

        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(s => (
            <ButtonView key={s} onPress={() => setValue(field as any, s)}>
              <Svgicons
                path={s <= ratingValue ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'}
                size={45}
                mr={10}
              />
            </ButtonView>
          ))}
        </View>

        {ratingValue > 0 && ratingValue < 5 && (
          <View style={styles.tagSection}>
            <AppText text="Tell us what happened" type="Bold" fontSize={22} mt={25} mb={15} />
            <View style={styles.pillContainer}>
              {tagsList.map(tag => (
                <ButtonView
                  key={tag}
                  onPress={() => toggleTag(tagsField, tag)}
                  style={styles.pillWrapper}
                >
                  <GlassCard style={[styles.pill, selectedTags.includes(tag) && styles.activePill]}>
                    <AppText text={tag} fontSize={13} color={Colors.BLACK} />
                  </GlassCard>
                </ButtonView>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <GradientBorder colors={['rgba(128,128,128,0.6)', '#fff', 'rgba(128,128,128,0.6)']} borderRadius={28} style={styles.fullWidthGradient}>
            <ButtonView onPress={() => saveAndNavigate(step + 1)} style={styles.submitInner}>
              <AppText text="Next" fontSize={16} type="Medium" />
            </ButtonView>
          </GradientBorder>
          <AppButton
            title="Save & Exit"
            onPress={handleSaveAndExit}
            color={Colors.WHITE}
            backgroundColor={Colors.BOTTLE_GREEN}
            borderColor={Colors.BOTTLE_GREEN}
          />
        </View>
      </View>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ButtonView onPress={() => (step === 0 ? goBack() : saveAndNavigate(step - 1))} style={styles.backCircle}>
          <Svgicons path="arrowLeftIcon" size={30} />
        </ButtonView>

        {step === 0 && (
          <View style={styles.stepContainer}>
            <Svgicons path="reviewStartImg" size={300} style={{ alignSelf: 'center', marginVertical: 30 }} />
            <AppText text={`Write a review for\n${guestName}`} fontSize={28} type="Bold" color={Colors.BLACK} />
            <AppText text="Your feedback helps other hosts manage better experiences." fontSize={16} color={Colors.DARK_CHARCOAL_OPACITY} mt={10} />
            <AppButton title="Next" onPress={() => saveAndNavigate(1)} mt={40} color={Colors.WHITE} borderColor={Colors.BOTTLE_GREEN} backgroundColor={Colors.BOTTLE_GREEN} />
          </View>
        )}

        {step === 1 && renderRatingUI(`How clean did ${guestName} leave your place?`, 'We’ll share this with Tooba and other hosts.', 'cleanliness', 'clean_tags', 'cleanWaterIcon', TAGS_DATA.clean)}
        {step === 2 && renderRatingUI('Communication', 'Was the guest easy to reach?', 'communication', 'comm_tags', 'cleanWaterIcon', TAGS_DATA.comm)}
        {step === 3 && renderRatingUI('Respect House Rules', 'Did the guest follow rules?', 'respect_house_rules', 'house_tags', 'cleanWaterIcon', TAGS_DATA.house)}

        {step === 4 && (
          <View style={styles.stepContainer}>
            <AppText text={`Would you recommend ${guestName}?`} fontSize={28} type="Bold" color={Colors.BLACK} mb={20} />
            <View style={styles.recommendRow}>
              <ButtonView style={styles.flex1} onPress={() => setValue('recommend', true)}>
                <GlassCard style={[styles.choiceCard, currentValues.recommend === true && styles.activeChoice]}>
                  <AppText text="Yes" type="Medium" />
                </GlassCard>
              </ButtonView>
              <ButtonView style={styles.flex1} onPress={() => setValue('recommend', false)}>
                <GlassCard style={[styles.choiceCard, currentValues.recommend === false && styles.activeChoice]}>
                  <AppText text="No" type="Medium" />
                </GlassCard>
              </ButtonView>
            </View>

            {currentValues.recommend === false && (
              <View style={styles.textAreaBox}>
                <AppText text="Why don't you recommend them?" fontSize={22} type="Bold" mt={30} mb={15} />
                <TextareaField name="feedback" control={control} errors={{}} placeholder="Type here..." multiline />
              </View>
            )}

            <View style={styles.footer}>
              <GradientBorder colors={['rgba(128,128,128,0.6)', '#fff', 'rgba(128,128,128,0.6)']} borderRadius={28} style={styles.fullWidthGradient}>
                <ButtonView onPress={handleSubmit(handleFinalSubmit)} style={styles.submitInner}>
                  <AppText text={isSubmitting ? 'Submitting...' : 'Submit Review'} fontSize={16} type="Medium" />
                </ButtonView>
              </GradientBorder>
              <AppButton title="Save & Exit" onPress={handleSaveAndExit} color={Colors.WHITE} borderColor={Colors.BOTTLE_GREEN} backgroundColor={Colors.BOTTLE_GREEN} />
            </View>
          </View>
        )}
      </ScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 30, paddingBottom: 40 },
  backCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center' },
  stepContainer: { flex: 1 },
  starRow: { flexDirection: 'row', marginTop: 10 },
  tagSection: { marginTop: 10 },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%', 
  },
  pillWrapper: {
    marginRight: 10,
    marginBottom: 10,
    width: '100%',
    // alignSelf: 'flex-start', 
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    borderWidth: 1.5,
    borderColor: Colors.BOTTLE_GREEN,
    backgroundColor: 'rgba(29, 187, 159, 0.05)',
  },
  recommendRow: { flexDirection: 'row', gap: 15 },
  flex1: { flex: 1 },
  choiceCard: { height: 65, justifyContent: 'center', alignItems: 'center', borderRadius: 32 },
  activeChoice: { borderWidth: 2, borderColor: Colors.PINE_FOREST },
  footer: { marginTop: 40 },
  fullWidthGradient: { width: '100%', marginBottom: 12 },
  submitInner: { height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.WHITE },
  textAreaBox: { marginTop: 10 },
});

export default RateYourGuestScreen;