import React, { useState, useEffect } from 'react';
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
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useTranslation } from 'react-i18next';

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
  const [localSelected, setLocalSelected] = useState<string[]>(
    initialSelectedValues,
  );
  const [isPropertyOpen, setIsPropertyOpen] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      checkInOut: '',
    },
  });

  useEffect(() => {
    if (isVisible) setLocalSelected(initialSelectedValues);
  }, [isVisible, initialSelectedValues]);

  const toggleLocalProperty = (val: any) => {
    const valStr = String(val);
    setLocalSelected(prev =>
      prev.includes(valStr)
        ? prev.filter(v => v !== valStr)
        : [...prev, valStr],
    );
  };

  const handleSelectAll = () => {
    if (localSelected.length === actualProperties.length) {
      setLocalSelected([]);
    } else {
      setLocalSelected(actualProperties.map(p => String(p.value)));
    }
  };

  const isAnySelected = localSelected.length > 0;
  const RenderTick = () => <View style={styles.tickContainer} />;

  const onApplyInternal = (data: any) => {
    onApply(localSelected, data.checkInOut);
  };

  return (
    <BottomSheetComponent isVisible={isVisible} onClose={onClose}>
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
          <AppText text={t('app.filter_modal_view.select_property')} type="Medium" fontSize={ms(15)} mb={vs(10)} color="#000" />

          {/* DROPDOWN BOX */}
          <View style={[styles.dropdownBox, isPropertyOpen && styles.activeBorder]}>
            <ButtonView
              activeOpacity={0.8}
              style={styles.dropdownHeader}
              onPress={() => setIsPropertyOpen(!isPropertyOpen)}
            >
              <View style={styles.headerLeft}>
                <ButtonView
                  onPress={handleSelectAll}
                  style={[styles.checkbox, isAnySelected && styles.checkboxSelected]}
                >
                  {isAnySelected && <RenderTick />}
                </ButtonView>

                <AppText
                  text={isAnySelected ? `${localSelected.length} Selected` : 'Select Multiple Options'}
                  color={isAnySelected ? '#000' : '#00000059'}
                  fontSize={ms(14)}
                  type="Medium"
                  style={styles.labelMargin}
                />
              </View>

              <View style={{ transform: [{ rotate: isPropertyOpen ? '180deg' : '0deg' }] }}>
                <Svgicons path="ChevronDownIcon" width={15} height={15} color="#2D3142" />
              </View>
            </ButtonView>

            {/* SCROLLABLE LIST AREA */}
            {isPropertyOpen && (
              <View style={styles.listAreaContainer}>
                <ScrollView 
                  nestedScrollEnabled={true} 
                  style={{ maxHeight: vs(180) }} // SPECIFIC HEIGHT SET HERE
                  showsVerticalScrollIndicator={true}
                >
                  {actualProperties.map(item => {
                    const isChecked = localSelected.includes(String(item.value));
                    return (
                      <ButtonView
                        key={item.value}
                        style={styles.itemRow}
                        onPress={() => toggleLocalProperty(item.value)}
                      >
                        <View style={[styles.checkbox, isChecked && styles.checkboxSelected]}>
                          {isChecked && <RenderTick />}
                        </View>
                        <AppText
                          text={item.label}
                          color={isChecked ? '#000' : '#7B8D88'}
                          fontSize={ms(14)}
                          type="Regular"
                          style={styles.labelMargin}
                        />
                      </ButtonView>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{ marginTop: vs(25), display: 'none' }}>
            <DropdownField
              label="Select Check-in/Check-out"
              name="checkInOut"
              control={control as any}
              errors={errors}
              placeholder="Select Multiple Options"
              data={[
                { label: 'Checked-in', value: 'today' },
                { label: 'Checked-out', value: 'checkedout' },
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
  dropdownBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  activeBorder: { borderColor: '' },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ms(16),
    alignItems: 'center',
    height: vs(54),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listAreaContainer: {
    paddingHorizontal: ms(16),
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  labelMargin: { marginLeft: s(12) },
  checkbox: {
    width: ms(18),
    height: ms(18),
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#D1D1D1',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#09A389',
    borderColor: '#09A389',
  },
  tickContainer: {
    width: ms(10),
    height: ms(6),
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#FFF',
    transform: [{ rotate: '-45deg' }],
    marginTop: -vs(2),
  },
  footer: {
    marginTop: vs(20),
    width: '100%',
  },
});