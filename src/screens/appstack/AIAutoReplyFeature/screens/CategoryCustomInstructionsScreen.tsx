import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
import CategoryCustomInstructionsSkeleton from '@/components/Skeletons/CategoryCustomInstructionsSkeleton';

const CategoryInstructionsScreen = () => {
  const { t } = useTranslation();
  const {
    title,
    listingOptions,
    existingData,
    isLoading,
    onSave,
    isSaving,
    isAddMoreDisabled,
  } = CategoryInstructionsContainer();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sections: [
        { instruction: '', properties: [], apply_to_all_listings: false },
      ],
    },
    mode: 'onSubmit',
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'sections',
  });

  const watchedSections = watch('sections');

  useEffect(() => {
    if (existingData && existingData.length > 0) {
      const formattedSections = existingData.map((apiItem: any) => ({
        instruction: apiItem.instructions?.[0] || '',
        properties: apiItem.listing_ids?.map(String) || [],
        apply_to_all_listings: !!apiItem.apply_to_all_listings,
      }));

      setValue('sections', formattedSections);
    }
  }, [existingData, setValue]);

  if (isLoading) {
    return (
      <BGImage
        source={require('@/assets/img/background/linearBG.png')}
        style={styles.container}
      >
        <CategoryCustomInstructionsSkeleton />
      </BGImage>
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
            onPress={() =>
              append({
                instruction: '',
                properties: [],
                apply_to_all_listings: false,
              })
            }
            disabled={isAddMoreDisabled}
            style={[
              styles.addMoreButton,
              isAddMoreDisabled && { opacity: 0.45 },
            ]}
          >
            <AppText
              text={t('app.category_instructions.add_more')}
              color={Colors.BLACK}
              fontSize={14}
              type="Medium"
            />
          </TouchableOpacity>
        </View>

        {fields.map((field, index) => {
          const currentApplyAllValue =
            watchedSections?.[index]?.apply_to_all_listings || false;

          // TypeScript error fixed by constructing an isolated map wrapper targeting our precise field item structures
          const textInputFieldName = `sections.${index}.instruction`;
          const dropdownFieldName = `sections.${index}.properties`;

          const textErrorObj = errors?.sections?.[index]?.instruction
            ? { [textInputFieldName]: errors.sections[index].instruction }
            : {};
          const dropErrorObj = errors?.sections?.[index]?.properties
            ? { [dropdownFieldName]: errors.sections[index].properties }
            : {};

          return (
            <View key={field.id} style={styles.sectionContainer}>
              <TextareaField
                label={t('app.category_instructions.label_instructions')}
                name={textInputFieldName}
                control={control as any}
                errors={textErrorObj as any}
                rules={{
                  required: t(
                    'app.category_instructions.error_instruction_required',
                  ),
                }}
                placeholder={t(
                  'app.category_instructions.placeholder_instructions',
                )}
                multiline={true}
                height={Metrics.verticalScale(120)}
              />

              <View style={{ marginTop: Metrics.verticalScale(10) }}>
                <MultiSelectDropdownField
                  name={dropdownFieldName}
                  control={control as any}
                  errors={dropErrorObj as any}
                  rules={{
                    validate: (value: string[]) =>
                      (value && value.length > 0) ||
                      t('app.category_instructions.error_listings_required'),
                  }}
                  label={t('app.category_instructions.label_select_property')}
                  data={listingOptions}
                  placeholder={t(
                    'app.category_instructions.placeholder_multiselect',
                  )}
                  dropdownPosition="top"
                />
              </View>

              <ButtonView
                style={[
                  styles.globalCheckboxRow,
                  { marginTop: Metrics.verticalScale(15), marginBottom: 5 },
                ]}
                activeOpacity={0.7}
              >
                <Checkbox
                  isChecked={currentApplyAllValue}
                  onPress={() =>
                    setValue(
                      `sections.${index}.apply_to_all_listings`,
                      !currentApplyAllValue,
                    )
                  }
                />
                <AppText
                  text={t('app.category_instructions.label_auto_create')}
                  ml={10}
                  fontSize={14}
                  type="Medium"
                />
              </ButtonView>

              {index < fields.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title={t('app.category_instructions.btn_apply')}
          onPress={handleSubmit(onSave)}
          variant="primary"
          // disabled={isSaving}
          backgroundColor={Colors.TEAL_PRIMARY_ALT}
          loading={isSaving}
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
