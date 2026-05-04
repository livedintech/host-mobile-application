import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { MultiSelect } from 'react-native-element-dropdown';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GlassCard from '../GlassCard/GlassCard';

interface DropdownItem {
  label: string;
  value: string | number;
}

interface MultiSelectDropdownFieldProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  data: DropdownItem[];
  placeholder?: string;
  disabled?: boolean;
  rules?: object;
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  labelStyle?: object;
}

const MultiSelectDropdownField: React.FC<MultiSelectDropdownFieldProps> = ({
  name,
  control,
  errors,
  label,
  data,
  placeholder = 'Select',
  disabled = false,
  rules,
  dropdownPosition = 'bottom',
  labelStyle,
}) => {
  const error = errors[name]?.message as string;

  const MAX_VISIBLE_CHIPS = 3;
  const MAX_CHIP_TEXT_LEN = 8;

  const truncateText = (text: string, limit: number) =>
    text.length > limit ? `${text.substring(0, limit)}...` : text;

  return (
    <View style={{ marginBottom: Metrics.verticalScale(18) }}>
      <AppText
        text={label}
        mb={8}
        color={Colors.BLACK}
        fontSize={14}
        type="Medium"
        style={labelStyle}
      />
      <GlassCard style={styles.wrapper}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value } }) => {
            const renderDropdownItem = (item: DropdownItem) => {
              const isSelected = value?.includes(item.value);
              return (
                <View style={styles.itemContainer}>
                  <Svgicons
                    path={isSelected ? "CheckboxCheckedIcon" : "CheckboxUncheckedIcon"}
                  />
                  <View style={{ flex: 1 }}>
                    <AppText
                      text={truncateText(item.label, 35)}
                      fontSize={13}
                      color={Colors.BLACK_35_PERCENT}
                      type="Medium"
                      numberOfLines={1}
                    />
                  </View>
                </View>
              );
            };

            const renderSelectedItem = (item: DropdownItem) => {
              const selectedValues = value || [];
              const itemIndex = selectedValues.indexOf(item.value);
              const totalSelected = selectedValues.length;

              if (itemIndex > MAX_VISIBLE_CHIPS) return <View style={styles.hiddenChip} />;

              if (itemIndex === MAX_VISIBLE_CHIPS) {
                const remaining = totalSelected - MAX_VISIBLE_CHIPS;
                return (
                  <View style={styles.moreChip}>
                    <AppText text={`+${remaining}`} fontSize={11} color={Colors.BLACK} type="Medium" />
                  </View>
                );
              }

              return (
                <View style={styles.selectedChip}>
                  <AppText
                    text={truncateText(item.label, MAX_CHIP_TEXT_LEN)}
                    fontSize={11}
                    color={Colors.BLACK}
                    numberOfLines={1}
                    type="Medium"
                  />
                </View>
              );
            };

            return (
              <MultiSelect
                inside
                dropdownPosition={dropdownPosition}
                style={[
                  styles.dropdown,
                  !!error && styles.errorBorder,
                  disabled && styles.disabled,
                ]}
                containerStyle={styles.whiteContainer}
                itemContainerStyle={styles.itemContainerStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={data}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={value || []}
                onChange={onChange}
                disable={disabled}
                activeColor={Colors.ANTI_FLASH_WHITE}
                renderRightIcon={() => (
                  <Svgicons path="ChevronDownIcon" width={15} height={15} />
                )}
                selectedStyle={styles.selectedChip}
                renderItem={renderDropdownItem}
                renderSelectedItem={renderSelectedItem}
                backgroundColor="transparent"
              />
            );
          }}
        />
      </GlassCard>
      {error && (
        <AppText text={error} color={Colors.INDIAN_RED} fontSize={12} mt={5} ml={4} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9999,
    width: '100%',
    padding: 0,
    borderRadius: 12
  },
  dropdown: {
    height: Metrics.verticalScale(56),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  whiteContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    marginTop: 4,
    // Width will now match the parent naturally
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  itemContainerStyle: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.scale(12),
    paddingHorizontal: 16,
    gap: 12,
  },
  disabled: {
    backgroundColor: Colors.ANTI_FLASH_WHITE,
    opacity: 0.5,
  },
  errorBorder: {
    borderColor: Colors.INDIAN_RED,
  },
  placeholderStyle: {
    fontSize: Metrics.generatedFontSize(14),
    color: '#7B8D88',
    fontWeight: '600',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: Colors.BLACK,
  },
  selectedStyle: {
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectedChip: {
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
    marginVertical: 2,
  },
  moreChip: {
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
    marginVertical: 2,
  },
  hiddenChip: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
});

export default MultiSelectDropdownField;