import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Controller,
  Control,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
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
  placeholderColor?: string;
  disabled?: boolean;
  rules?: RegisterOptions;
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  onSelect?: (value: any) => void;
  extraPayload?: any;
  mode?: 'default' | 'modal' | 'auto';
  maxHeight?: number;
  listContainerStyle?: object;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  name,
  control,
  errors,
  label,
  data,
  placeholder,
  placeholderColor,
  disabled = false,
  rules,
  dropdownPosition,
  onSelect,
  mode,
  maxHeight,
  listContainerStyle,
}) => {
  const { t } = useTranslation();
  const error = errors[name]?.message as string;
  const finalPlaceholder = placeholder || t("common.placeholder");

  return (
    <View
      style={{
        marginBottom: Metrics.verticalScale(18),
      }}
    >
      {label && (
        <AppText
          text={label}
          mb={8}
          color={Colors.BLACK}
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
            mode={mode}
            maxHeight={maxHeight}
            dropdownPosition={dropdownPosition}
            inputSearchStyle={styles.inputSearchStyle}
            search
            style={[
              styles.dropdown,
              disabled && styles.disabled,
              !!error && styles.errorBorder,
            ]}
            containerStyle={[styles.popupListContainer, listContainerStyle]}
            placeholderStyle={[
              styles.placeholderStyle,
              placeholderColor ? { color: placeholderColor } : {},
            ]}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            data={data}
            labelField="label"
            valueField="value"
            placeholder={finalPlaceholder}
            value={value}
            onChange={item => {
              onChange(item.value);
              if (onSelect) {
                onSelect(item);
              }
            }}
            disable={disabled}
            renderRightIcon={() => (
              <View style={{ marginRight: 8 }}>
                <Svgicons
                  path="ChevronDownIcon"
                  width={15}
                  height={15}
                  color="#2D3142"
                />
              </View>
            )}
            autoScroll={false}
            searchPlaceholder={t('common.search')}
          />
        )}
      />
      {error && (
        <AppText
          text={error}
          color={Colors.INDIAN_RED}
          fontSize={12}
          mt={5}
          ml={4}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: Metrics.verticalScale(54),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
    borderColor: Colors.WHITE_OPACITY_60,
  },
  errorBorder: {
    borderColor: Colors.INDIAN_RED,
  },
  placeholderStyle: {
    fontSize: Metrics.generatedFontSize(14),
    color: '#7B8D88',
    fontWeight: '400',
    paddingRight: 12,
  },
  selectedTextStyle: {
    fontSize: Metrics.generatedFontSize(14),
    color: '#000000',
    fontWeight: '400',
    paddingRight: 12,
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
