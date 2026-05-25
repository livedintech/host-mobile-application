import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // Added

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import TextareaField from '@/components/molecules/Input/TextareaField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import Checkbox from '@/components/molecules/Input/CheckBox';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import CategoryInstructionsContainer from '../containers/CategoryInstructionsContainer';

const CategoryInstructionsScreen = () => {
  const { t } = useTranslation(); // Added
  const { title, listingOptions, existingData, isLoading, onSave, isSaving,isAddMoreDisabled } =
    CategoryInstructionsContainer();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sections: [{ instruction: '', properties: [] }],
      apply_to_all_listings: false,
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'sections',
  });

  const isApplyAllChecked = watch('apply_to_all_listings');

  useEffect(() => {
    if (existingData && existingData.length > 0) {
      const apiItem = existingData[0];
      setValue('apply_to_all_listings', !!apiItem.apply_to_all_listings);

      if (apiItem.instructions && apiItem.instructions.length > 0) {
        const formattedSections = apiItem.instructions.map((text: string) => ({
          instruction: text,
          properties: apiItem.listing_ids?.map(String) || [],
        }));
        setValue('sections', formattedSections);
      }
    }
  }, [existingData, setValue]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.TEAL_PRIMARY_ALT} />
      </View>
    );
  }

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText
          text={t('app.category_instructions.main_title', { title })}
          fontSize={28}
          type="Bold"
          mt={20}
          mb={12}
        />
        <AppText
          text={t('app.category_instructions.description')}
          fontSize={14}
          type="Regular"
          mt={20}
          color={Colors.DARK_CHARCOAL_OPACITY}
          mb={30}
        />

        <View style={styles.addMoreRow}>
          <TouchableOpacity
            onPress={() => append({ instruction: '', properties: [] })}
            disabled={isAddMoreDisabled}
            style={styles.addMoreButton}
          >
            <AppText
              text={t('app.category_instructions.add_more')}
              color={Colors.BLACK}
              fontSize={14}
              type="Medium"
            />
          </TouchableOpacity>
        </View>

        {fields.map((field, index) => (
          <View key={field.id} style={styles.sectionContainer}>
            <TextareaField
              label={t('app.category_instructions.label_instructions')}
              name={`sections.${index}.instruction`}
              control={control as any}
              errors={errors}
              placeholder={t('app.category_instructions.placeholder_instructions')}
              multiline={true}
              height={Metrics.verticalScale(120)}
            />

            <View style={{ marginTop: Metrics.verticalScale(10) }}>
              <MultiSelectDropdownField
                name={`sections.${index}.properties`}
                control={control as any}
                errors={errors}
                label={t('app.category_instructions.label_select_property')}
                data={listingOptions}
                placeholder={t('app.category_instructions.placeholder_multiselect')}
                dropdownPosition="top"
              />
            </View>

            {index < fields.length - 1 && <View style={styles.divider} />}
          </View>
        ))}

        <ButtonView style={styles.globalCheckboxRow} activeOpacity={0.7}>
          <Checkbox
            isChecked={isApplyAllChecked}
            onPress={() =>
              setValue('apply_to_all_listings', !isApplyAllChecked)
            }
          />
          <AppText
            text={t('app.category_instructions.label_auto_create')}
            ml={10}
            fontSize={14}
            type="Medium"
          />
        </ButtonView>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title={isSaving ? t('app.category_instructions.saving') : t('app.category_instructions.btn_apply')}
          onPress={handleSubmit(onSave)}
          variant="primary"
          disabled={isSaving}
          backgroundColor={Colors.TEAL_PRIMARY_ALT}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Metrics.verticalScale(50) },
  scrollContent: {
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(140),
  },
  addMoreRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Metrics.verticalScale(15),
  },
  addMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: Metrics.scale(16),
    paddingVertical: Metrics.verticalScale(8),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  globalCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(25),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  sectionContainer: { marginBottom: Metrics.verticalScale(20) },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginVertical: Metrics.verticalScale(30),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(40),
    paddingTop: Metrics.verticalScale(10),
    backgroundColor: 'transparent',
  },
});

export default CategoryInstructionsScreen;