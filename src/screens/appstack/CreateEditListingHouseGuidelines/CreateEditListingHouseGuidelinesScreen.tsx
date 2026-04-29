import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import TextareaField from '@/components/molecules/Input/TextareaField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import useCreateEditListingHouseGuidelinesContainer from './useCreateEditListingHouseGuidelinesContainer';
import { useTranslation } from 'react-i18next';
import BGImage from '@/components/molecules/BGImage/BGImage';

const CreateEditListingHouseGuidelinesScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    isEdit,
    onNext,
    onSaveExit,
    isLoading,
    arrivalGuideLength,
    houseRulesLength,
    checkoutInstructionsLength,
  } = useCreateEditListingHouseGuidelinesContainer();
  const { t } = useTranslation();

  return (
     <BGImage source={require('@/assets/img/background/linearBG.png')}>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <AppPressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </AppPressable>
          </GradientBorder>
          <CircularProgress percentage={50} size={48} strokeWidth={4} />
        </View>

        {/* Title */}
        <View style={styles.titleRow}>
          <AppText text={t('app.house_guidelines.title')} fontSize={28} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="bookIcon" size={24} />
        </View>

        {/* Arrival Guide */}
        <View style={styles.section}>
          <TextareaField
            name="arrival_guide"
            control={control}
            errors={errors}
            label={t('app.house_guidelines.arrival_label')}
            placeholder={t('app.house_guidelines.arrival_placeholder')}
            multiline={true}
            numberOfLines={8}
            descriptionLength={arrivalGuideLength}
          />
        </View>

        {/* House Rules */}
        <View style={styles.section}>
          <TextareaField
            name="house_rules"
            control={control}
            errors={errors}
            label={t('app.house_guidelines.rules_label')}
            placeholder={t('app.house_guidelines.rules_placeholder')}
            multiline={true}
            numberOfLines={8}
            descriptionLength={houseRulesLength}
          />
        </View>

        {/* Checkout Instructions */}
        <View style={styles.section}>
          <TextareaField
            name="checkout_instructions"
            control={control}
            errors={errors}
            label={t('app.house_guidelines.checkout_label')}
            placeholder={t('app.house_guidelines.checkout_placeholder')}
            multiline={true}
            numberOfLines={8}
            descriptionLength={checkoutInstructionsLength}
          />
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          {!isEdit && (
            <>
              <AppButton
                title={t('app.house_guidelines.next')}
                onPress={handleSubmit(onNext)}
                loading={isLoading}
              />
              <AppButton
                title={t('app.house_guidelines.save_exit')}
                onPress={handleSubmit(onSaveExit)}
                mt={15}
                disabled={isLoading}
              />
            </>
          )}

          {isEdit && (
            <AppButton
              title={t('app.house_guidelines.save_exit')}
              onPress={handleSubmit(onSaveExit)}
              loading={isLoading}
            />
          )}
        </View>

      </ScrollView>
    </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1},
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  footer: { marginTop: 20 },
});

export default CreateEditListingHouseGuidelinesScreen;