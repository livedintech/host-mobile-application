import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
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
  clean: [
    'Damaged Property',
    'Ignored Checkout Directions',
    'Messy Kitchen',
    'Excessive Rubbish',
    'Ruined Bed Linen',
    'Something Else'
  ],
  comm: ['Unreachable','Unhelpful Response','Disrespectful','Slow Response','Something Else'],
  house: ['Arrived Too Early', 'Stayed Past Checkout', 'Unapproved Guests', 'Something Else'],
};

// Map ratings to the specific labels you requested
const RATING_LABELS: Record<number, string> = {
  1: 'Not at all clean',
  2: 'Not very clean',
  3: 'Fairly clean',
  4: 'Very clean',
  5: 'Extremely clean',
};

const RateYourGuestScreen = ({ route }: any) => {
  const { step, setStep, formValues, updateForm, resetStore } = useRateStore();
  const { submitReply, isSubmitting } = useRateGuest();
  const guestName = route.params?.name || 'Tooba';

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
    const current = [
      ...(currentValues[fieldName as keyof typeof currentValues] as string[]),
    ];
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

  const renderFooter = () => {
    const showBackNext = step > 0;
    return (
      <View style={styles.footerContainer}>
        {showBackNext ? (
          <View style={styles.actionRow}>
            <View style={styles.btnStyle}>
              <ButtonView
                onPress={() => saveAndNavigate(step - 1)}
                style={styles.buttonInner}
              >
                <AppText
                  text="Back"
                  fontSize={16}
                  type="Medium"
                  color={Colors.BLACK}
                />
              </ButtonView>
            </View>

            <View style={styles.btnStyle}>
              <ButtonView
                onPress={
                  step === 4
                    ? handleSubmit(handleFinalSubmit)
                    : () => saveAndNavigate(step + 1)
                }
                style={styles.buttonInner}
              >
                <AppText
                  text={
                    step === 4
                      ? isSubmitting
                        ? 'Submitting...'
                        : 'Submit'
                      : 'Next'
                  }
                  fontSize={16}
                  type="Medium"
                  color={Colors.BLACK}
                />
              </ButtonView>
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
            <Svgicons
              path="reviewStartImg"
              size={300}
              style={{ alignSelf: 'center', marginVertical: 30 }}
            />
            <AppText
              text={`Write a review for\n${guestName}`}
              fontSize={28}
              type="Bold"
              color={Colors.BLACK}
            />
            <AppText
              text="Your feedback helps other hosts manage better experiences."
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
            sub: 'We’ll share this with Tooba and other hosts.',
            field: 'cleanliness',
            tagsField: 'clean_tags',
            icon: 'cleanWaterIcon',
            tags: TAGS_DATA.clean,
          },
          {
            title: 'Communication',
            sub: 'Was the guest easy to reach?',
            field: 'communication',
            tagsField: 'comm_tags',
            icon: 'cleanWaterIcon',
            tags: TAGS_DATA.comm,
          },
          {
            title: 'Respect House Rules',
            sub: 'Did the guest follow rules?',
            field: 'respect_house_rules',
            tagsField: 'house_tags',
            icon: 'cleanWaterIcon',
            tags: TAGS_DATA.house,
          },
        ][step - 1];
        const ratingValue = currentValues[
          config.field as keyof typeof currentValues
        ] as number;
        const selectedTags = currentValues[
          config.tagsField as keyof typeof currentValues
        ] as string[];

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
                  onPress={() => setValue(config.field as any, s)}
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

            {/* Added Dynamic Rating Label here */}
            {ratingValue > 0 && (
              <AppText
                text={RATING_LABELS[ratingValue]}
                fontSize={16}
                color={Colors.BLACK}
                mt={25}
              />
            )}

            {ratingValue > 0 && ratingValue < 5 && (
              <View style={styles.tagSection}>
                <AppText
                  text="Tell us what happened"
                  type="Bold"
                  fontSize={22}
                  mt={25}
                  mb={15}
                />
                <View style={styles.pillContainer}>
                  {config.tags.map(tag => (
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
            <AppText
              text={`Would you recommend ${guestName}?`}
              fontSize={28}
              type="Bold"
              color={Colors.BLACK}
              mb={20}
              mt={30}
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
                  <AppText text="Yes" type="Medium" color={Colors.BLACK} />
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
                  <AppText text="No" type="Medium" color={Colors.BLACK} />
                </ButtonView>
              </GradientBorder>
            </View>
            {currentValues.recommend === false && (
              <View style={styles.textAreaBox}>
                <AppText
                  text={`Why don't you recommend ${guestName}?`}
                  fontSize={22}
                  type="Bold"
                  mt={30}
                  mb={15}
                />
                <TextareaField
                  name="feedback"
                  control={control}
                  errors={{}}
                  placeholder="We’re curious because you gave them a high rating. (Required)"
                  multiline
                  // wordLimit={100}
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
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  stepContainer: { flex: 1 },
  starRow: { flexDirection: 'row', marginTop: 10 },
  tagSection: { marginTop: 10 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, // Adjusted gap for spacing
  pill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  activePill: {
    borderWidth: 1.5,
    borderColor: Colors.BOTTLE_GREEN,
    borderBottomColor:Colors.BOTTLE_GREEN,
    backgroundColor: 'rgba(29, 187, 159, 0.05)',
  },
  recommendRow: { flexDirection: 'row', gap: 15 },
  choiceGradient: { flex: 1 },
  choiceInner: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 32,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    backgroundColor: 'transparent',
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