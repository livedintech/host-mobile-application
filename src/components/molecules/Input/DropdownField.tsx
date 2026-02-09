import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Controller,
  Control,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

interface DropdownItem {
  label: string;
  value: string | number;
}
interface DropdownFieldProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  data: DropdownItem[];
  placeholder?: string;
  disabled?: boolean;
  rules?: RegisterOptions;
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  onSelect?: (value: any) => void;
  extraPayload?: any;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  name,
  control,
  errors,
  label,
  data,
  placeholder = 'Select',
  disabled = false,
  rules,
  dropdownPosition,
  onSelect,
  extraPayload,
}) => {
  const error = errors[name]?.message as string;

  return (
    <View style={styles.wrapper}>
      {label && (
        <AppText
          text={label}
          mb={8}
          color={Colors.PINE_FOREST}
          fontSize={14}
          type="Medium"
        />
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            dropdownPosition={dropdownPosition}
            inputSearchStyle={styles.inputSearchStyle}
            search
            style={[
              styles.dropdown,
              !!error && styles.errorBorder,
              disabled && styles.disabled,
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            data={data}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value}
            // onChange={item => onChange(item.value)}
            onChange={item => {
              onChange(item.value);
              if (onSelect) {
                onSelect(item);
              }
            }}
            disable={disabled}
            renderRightIcon={() => (
              <Svgicons path="ChevronDownIcon" width={15} height={15} />
            )}
            autoScroll={false}
            searchPlaceholder="Search..."
          />
        )}
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
    zIndex: 9999,
    overflow: 'visible',
  },
  label: {
    color: Colors.BRUNSWICK_GREEN,
    marginBottom: 8,
    fontSize: Metrics.generatedFontSize(14),
  },
  dropdown: {
    height: Metrics.verticalScale(56),
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
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
    fontSize: Metrics.generatedFontSize(14),
    color: Colors.SUPER_GREY,
    fontWeight: '500',
  },
  selectedTextStyle: {
    fontSize: Metrics.generatedFontSize(14),
    color: Colors.MIDNIGHT,
  },
  itemTextStyle: {
    fontSize: Metrics.generatedFontSize(14),
    color: Colors.MIDNIGHT,
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.INDIAN_RED,
  },
  inputSearchStyle: {
    color: Colors.MIDNIGHT,
  },
});

export default DropdownField;
