import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { useTranslation } from 'react-i18next';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

interface CountryPickerFieldProps {
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  name: string;
  placeholder?: string;
  defaultCountryCode?: CountryCode;
  disabled?: boolean;
  onSelect?: (country: Country) => void;
}

export interface CountryValue {
  cca2: CountryCode;
  name: string;
  callingCode: string;
}

const CountryPickerField: React.FC<CountryPickerFieldProps> = ({
  control,
  errors,
  label,
  name,
  placeholder = 'Select Country',
  defaultCountryCode = 'SA',
  disabled,
  onSelect
}) => {
  const { t } = useTranslation();
  const [pickerVisible, setPickerVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.WHITE_OPACITY_60, Colors.WHITE_OPACITY_60],
  });

  return (
    <View style={styles.wrapper}>
      <AppText text={label} style={styles.label} type="Medium" />

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          const countryCode = value?.cca2 || defaultCountryCode;

          return (
            <Animated.View
              style={[
                styles.container,
                {
                  borderColor: errors[name] ? Colors.INDIAN_RED : animatedBorderColor,
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
                disabled && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              ]}
            >
              <TouchableOpacity
                style={styles.pickerButton}
                activeOpacity={0.7}
                onPress={() => {
                  if (disabled) return;
                  setPickerVisible(true);
                  handleFocus();
                }}
              >
                <CountryPicker
                  withFilter={true} // Allows searching
                  withFlag={true}
                  withCountryNameButton={false}
                  countryCode={countryCode as CountryCode}
                  visible={pickerVisible}
                  onClose={() => {
                    setPickerVisible(false);
                    handleBlur();
                  }}
                  onSelect={(country: Country) => {
                    const selectedData = {
                      cca2: country.cca2,
                      name: country.name,
                      callingCode: country.callingCode[0] || '',
                    };
                    onChange(selectedData);
                    if (onSelect) onSelect(country);
                    setPickerVisible(false);
                    handleBlur();
                  }}
                />

                <AppText
                  text={value?.name || placeholder}
                  style={[
                    styles.text,
                    !value?.name ? { color: Colors.SUPER_GREY } : {},
                  ]}
                />

                <Svgicons path="ChevronDownIcon" size={10} pl={5} />
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />

      {errors[name] && (
        <AppText
          text={errors[name]?.message as string || t('common.required')}
          color={Colors.INDIAN_RED}
          style={styles.errorText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: Metrics.verticalScale(18) },
  label: { color: Colors.BLACK, marginBottom: 8, fontSize: Metrics.generatedFontSize(14) },
  container: { borderWidth: 1.5, borderRadius: 10, height: Metrics.verticalScale(54), justifyContent: 'center' },
  pickerButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, flex: 1 },
  text: { color: Colors.BLACK, fontSize: Metrics.generatedFontSize(14), flex: 1, marginLeft: 10 },
  errorText: { marginTop: Metrics.verticalScale(5), fontSize: Metrics.generatedFontSize(12), marginLeft: Metrics.scale(4) },
});

export default CountryPickerField;