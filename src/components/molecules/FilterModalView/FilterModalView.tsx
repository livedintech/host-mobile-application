import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';

import BottomSheetComponent from '@/components/molecules/BottomSheetComponent/BottomSheetComponent';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '../AppButton/AppButton';
import ButtonView from '../AppButton/ButtonView';
import DropdownField from '../Input/DropdownField';
import MultiSelectDropdownField from '../Input/MultiSelectDropdownField';
import { useTranslation } from 'react-i18next';
import Metrics from '@/utility/Metrics';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onApply: (selected: string[], checkInOut?: string) => void;
  onReset: () => void;
  actualProperties: any[];
  initialSelectedValues: string[];
}

export const FilterModalView = ({
  isVisible,
  onClose,
  onApply,
  actualProperties,
  initialSelectedValues,
}: Props) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      properties: initialSelectedValues,
      checkInOut: '',
    },
  });

  useEffect(() => {
    if (isVisible) setValue('properties', initialSelectedValues);
  }, [isVisible, initialSelectedValues]);

  const onApplyInternal = (data: any) => {
    onApply(data.properties ?? [], data.checkInOut);
  };

  return (
    <BottomSheetComponent isVisible={isVisible} onClose={onClose} customHeight={Metrics.screenHeight * 0.70}>
      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, vs(20)) },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText text={t('app.filter_modal_view.apply_filter')} type="Bold" fontSize={ms(20)} color="#000" />
          <ButtonView onPress={onClose} style={styles.closeCircle}>
            <X size={ms(18)} color="#000" />
          </ButtonView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <MultiSelectDropdownField
            name="properties"
            label={t('app.filter_modal_view.select_property')}
            control={control as any}
            errors={errors}
            data={actualProperties}
            placeholder="Select Multiple Options"
          />

          <View style={{ marginTop: vs(25), display: 'none' }}>
            <DropdownField
              label="Select Check-in/Check-out"
              name="checkInOut"
              control={control as any}
              errors={errors}
              placeholder="Select Multiple Options"
              data={[
                { label: t('app.filter_modal_view.checked_in'), value: 'today' },
                { label: t('app.filter_modal_view.checked_out'), value: 'checkedout' },
              ]}
            />
          </View>

          <View style={styles.footer}>
            <AppButton
              title={t('app.analytics.apply')}
              onPress={handleSubmit(onApplyInternal)}
              fontSize={18}
              type="Bold"
              backgroundColor="#09A389"
              style={{ width: '100%', borderRadius: ms(25), height: vs(45) }}
            />
          </View>
        </ScrollView>
      </View>
    </BottomSheetComponent>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(24),
    paddingTop: vs(10),
    paddingBottom: vs(15),
    alignItems: 'center',
  },
  closeCircle: {
    backgroundColor: '#E0E0E0',
    borderRadius: 100,
    padding: ms(6),
  },
  scrollContent: {
    paddingHorizontal: s(24),
    paddingBottom: vs(20),
  },
  footer: {
    marginTop: vs(20),
    width: '100%',
  },
});
