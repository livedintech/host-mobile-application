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
            // This styles the actual popup menu
            containerStyle={styles.popupListContainer}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            data={data}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value}
            onChange={item => {
              onChange(item.value);
              if (onSelect) {
                onSelect(item);
              }
            }}
            disable={disabled}
            renderRightIcon={() => (
              <Svgicons path="ChevronDownIcon" width={15} height={15} color="#2D3142" />
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
  dropdown: {
    height: Metrics.verticalScale(54),
    // --- GLASS STYLING ---
     backgroundColor: 'rgba(255, 255, 255, 0.25)', // Translucent fill
    borderRadius: 10,             
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.WHITE_OPACITY_60, 
  },
  popupListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginTop: 5,
    borderWidth: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  errorBorder: {
    borderColor: Colors.INDIAN_RED,
  },
  placeholderStyle: {
    fontSize: Metrics.generatedFontSize(14),
    color: '#7B8D88', // Matches calendar price color
    fontWeight: '500',
  },
  selectedTextStyle: {
    fontSize: Metrics.generatedFontSize(14),
    color: '#1A332C', // Deep forest color for contrast
    fontWeight: '600',
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
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
  },
});

export default DropdownField;