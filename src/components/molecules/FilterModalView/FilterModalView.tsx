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
import { ChevronDown } from 'lucide-react-native';
import DropdownField from '../Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

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
  const insets = useSafeAreaInsets();
  const [localSelected, setLocalSelected] = useState<string[]>(
    initialSelectedValues,
  );
  const [isPropertyOpen, setIsPropertyOpen] = useState(true);

  // Form control for the Check-in/out dropdown
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
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
          <AppText
            text="Apply Filter"
            type="Bold"
            fontSize={ms(20)}
            color="#000"
          />
          <ButtonView onPress={onClose} style={styles.closeCircle}>
            <X size={ms(18)} color="#000" />
          </ButtonView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Section 1: Property Selection */}
          <AppText
            text="Select Property"
            type="Medium"
            fontSize={ms(15)}
            mb={vs(10)}
            color="#000"
          />

          <View
            style={[styles.dropdownBox, isPropertyOpen && styles.activeBorder]}
          >
            <ButtonView
              activeOpacity={0.8}
              style={styles.dropdownHeader}
              onPress={() => setIsPropertyOpen(!isPropertyOpen)}
            >
              <View style={styles.headerLeft}>
                <ButtonView
                  onPress={handleSelectAll}
                  style={[
                    styles.checkbox,
                    isAnySelected && styles.checkboxSelected,
                  ]}
                >
                  {isAnySelected && <RenderTick />}
                </ButtonView>

                <AppText
                  text={
                    isAnySelected
                      ? `${localSelected.length} Selected`
                      : 'Select Multiple Options'
                  }
                  color={isAnySelected ? '#000' : '#00000059'}
                  fontSize={ms(14)}
                  type="Medium"
                  style={styles.labelMargin}
                />
              </View>

              <View
                style={{
                  transform: [{ rotate: isPropertyOpen ? '180deg' : '0deg' }],
                }}
              >
                {/* <ChevronDown size={ms(18)} color="#000" /> */}
                <Svgicons
                  path="ChevronDownIcon"
                  width={15}
                  height={15}
                  color="#2D3142"
                />
              </View>
            </ButtonView>

            {isPropertyOpen && (
              <View style={styles.listArea}>
                {actualProperties.map(item => {
                  const isChecked = localSelected.includes(String(item.value));
                  return (
                    <ButtonView
                      key={item.value}
                      style={styles.itemRow}
                      onPress={() => toggleLocalProperty(item.value)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isChecked && styles.checkboxSelected,
                        ]}
                      >
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
              </View>
            )}
          </View>

          {/* Section 2: Check-in/Check-out Dropdown (Exact Figma) */}
          <View style={{ marginTop: vs(25) }}>
            <DropdownField
              label="Select Check-in/Check-out"
              name="checkInOut"
              control={control}
              errors={errors}
              placeholder="Select Multiple Options"
              placeholderColor="#00000059"
              data={[
                { label: 'Checked-in', value: 'today' },
                { label: 'Checked-out', value: 'checkedout' },
               
              ]}
            />
          </View>

          {/* Footer Action */}
          <View style={styles.footer}>
            <AppButton
              title="Apply"
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
  container: { flex: 1 },
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
    paddingBottom: vs(40),
  },
  dropdownBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: ms(12),
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  activeBorder: { borderColor: '#FFFFFF' },
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
  listArea: {
    paddingHorizontal: ms(16),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(14),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  labelMargin: { marginLeft: s(12) },
  checkbox: {
    width: ms(18),
    height: ms(18),
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  tickContainer: {
    width: ms(10),
    height: ms(6),
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#479682', // Green tick inside white box
    transform: [{ rotate: '-45deg' }],
    marginTop: -vs(2),
  },
  footer: {
    marginTop: vs(20),
    width: '100%',
  },
});
