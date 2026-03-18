import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { MultiSelect } from 'react-native-element-dropdown';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
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

  return (
    <View style={styles.wrapper}>
      <AppText
        text={label}
        mb={8}
        color={Colors.BLACK}
        fontSize={14}
        type="Medium"
        style={labelStyle}
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
                  fontSize={13}
                  color={Colors.BLACK_35_PERCENT}
                  type="Medium"
                />
              </View>
            );
          };

          return (
            <MultiSelect
              dropdownPosition={dropdownPosition}
              style={[
                styles.dropdown,
                !!error && styles.errorBorder,
                disabled && styles.disabled,
              ]}
              containerStyle={styles.whiteContainer} 
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
              selectedStyle={styles.selectedStyle}
              itemContainerStyle={styles.itemContainerStyle}
              renderItem={renderDropdownItem}
              backgroundColor="transparent"
            />
          );
        }}
      />
      {error && (
        <AppText text={error} color={Colors.INDIAN_RED} style={styles.errorText} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Metrics.verticalScale(18),
  },
  dropdown: {
    minHeight: Metrics.verticalScale(56),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  // NEW: Solid white container for the options list
  whiteContainer: {
    backgroundColor: Colors.WHITE, 
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  disabled: {
    backgroundColor: Colors.ANTI_FLASH_WHITE,
      opacity: 0.5,
  },
  errorBorder: {
    borderColor: Colors.INDIAN_RED,
  },
  placeholderStyle: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.4)',
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
  itemContainerStyle: {
    backgroundColor: Colors.WHITE, // Solid background for items
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.scale(12),
    paddingHorizontal: 16,
    gap: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.ANTI_FLASH_WHITE,
  },
  // disabled: {
  //   opacity: 0.5,
  // },
  // errorBorder: {
  //   borderColor: Colors.INDIAN_RED,
  // },
  errorText: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default MultiSelectDropdownField;