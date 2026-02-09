import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { MultiSelect } from 'react-native-element-dropdown';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import CheckboxChecked from '@/assets/icons/checkbox-primary-checked.svg';
import CheckboxUnchecked from '@/assets/icons/checkbox-primary-unchecked.svg';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

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
  dropdownPosition
}) => {
  const error = errors[name]?.message as string;

  return (
    <View style={styles.wrapper}>
      {/* <AppText text={label} style={styles.label} /> */}
      <AppText
        text={label}
        mb={8}
        color={Colors.PINE_FOREST}
        fontSize={14}
        type="Medium"
      />
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => {
          const renderDropdownItem = (item: DropdownItem) => {
            const isSelected = value?.includes(item.value);

            return (
              <View style={styles.itemContainer}>
                {isSelected ? (
                  <Svgicons path="CheckboxCheckedIcon" />
                ) : (
                  <Svgicons path="CheckboxUncheckedIcon" />
                )}
                <AppText
                  text={item.label}
                  fontSize={12}
                  color={Colors.SUPER_GREY}
                  type="SemiBold"
                />
              </View>
            );
          };

          return (
            <MultiSelect
            dropdownPosition={dropdownPosition}
              searchPlaceholder="Search..."
              search
              style={[
                styles.dropdown,
                !!error && styles.errorBorder,
                disabled && styles.disabled,
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={data}
              labelField="label"
              valueField="value"
              placeholder={placeholder}
              value={value || []}
              onChange={onChange}
              disable={disabled}
              renderRightIcon={() => (
                <Svgicons path="ChevronDownIcon" width={15} height={15} />
              )}
              selectedStyle={styles.selectedStyle}
              inputSearchStyle={styles.inputSearchStyle}
              renderItem={renderDropdownItem}
            />
          );
        }}
      />
      {error && (
        <AppText
          text={error}
          color={Colors.INDIAN_RED}
          style={styles.errorText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Metrics.verticalScale(18),
  },
  label: {
    color: Colors.PINE_FOREST,
    marginBottom: 8,
    fontSize: Metrics.generatedFontSize(14),
  },
  dropdown: {
    minHeight: Metrics.verticalScale(56),
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Metrics.verticalScale(8),
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
  },
  disabled: {
    backgroundColor: Colors.ANTI_FLASH_WHITE,
  },
  errorBorder: {
    borderColor: Colors.INDIAN_RED,
  },
  placeholderStyle: {
    fontSize: Metrics.generatedFontSize(12),
    color: Colors.SUPER_GREY,
    fontWeight: '500',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: Colors.BLACK,
  },

  errorText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.INDIAN_RED,
  },
  inputSearchStyle: {
    color: Colors.BLACK,
  },
  selectedStyle: {
    borderRadius: 12,
    backgroundColor: Colors.ANTI_FLASH_WHITE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Metrics.scale(16),
    gap: 8,
  },
});

export default MultiSelectDropdownField;
