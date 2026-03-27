import React, { useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Animated } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import AppText from '../AppText/AppText';
import ButtonView from '../AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

interface PhoneInputFieldProps {
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  countryFieldName: string;
  phoneFieldName: string;
  activeColor?: string;
  disabled?: boolean;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  control,
  errors,
  label,
  countryFieldName,
  phoneFieldName,
  activeColor = Colors.PINE_FOREST, // Matching your theme's primary focus
  disabled = false,
}) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  // Glass Constants matching Dropdown/Input
  const GLASS_BASE = 'rgba(255, 255, 255, 0.25)';
  const GLASS_RIM = 'rgba(255, 255, 255, 0.6)';
  const TEXT_COLOR = '#1A332C'; // Deep forest for contrast

  const handleFocus = () => {
    if (disabled) return;
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
    outputRange: [GLASS_RIM, activeColor],
  });

  return (
    <View style={styles.wrapper}>
      {label && (
        <AppText
          text={label}
          style={styles.label}
          type="Medium"
          fontSize={14}
          color={Colors.BLACK}
        />
      )}

      <Animated.View
        style={[
          styles.container,
          {
            borderColor: errors[phoneFieldName]
              ? Colors.INDIAN_RED
              : animatedBorderColor,
            backgroundColor: disabled ? 'rgba(255, 255, 255, 0.1)' : GLASS_BASE,
          },
        ]}
      >
        {/* Country Picker Section */}
        <Controller
          control={control}
          name={countryFieldName}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerWrapper}>
              <ButtonView
                onPress={() => !disabled && setPickerVisible(true)}
                style={styles.pickerButton}
                activeOpacity={disabled ? 1 : 0.7}
              >
                <CountryPicker
                  withFlag
                  withFilter
                  withCallingCode
                  countryCode={value?.cca2 as CountryCode}
                  onSelect={(country: Country) => {
                    onChange({
                      cca2: country.cca2,
                      callingCode: country.callingCode[0] || '',
                    });
                  }}
                  visible={!disabled && pickerVisible}
                  onClose={() => setPickerVisible(false)}
                  // containerStyle={styles.countryPickerContainer}
                  theme={{
                    fontSize: 14,
                    fontFamily: 'System', // or your custom font
                    backgroundColor: Colors.WHITE,
                  }}
                />
                <AppText
                  text={`+${value?.callingCode || ''}`}
                  color={disabled ? Colors.SUPER_GREY : TEXT_COLOR}
                  type="SemiBold"
                  fontSize={14}
                />
                {!disabled && (
                  <View style={{ marginLeft: 4 }}>
                    <Svgicons path="ChevronDownIcon" size={10} />
                  </View>
                )}
              </ButtonView>
              {/* Vertical Divider Line */}
              <View style={styles.divider} />
            </View>
          )}
        />

        {/* Phone Number Input Section */}
        <Controller
          control={control}
          name={phoneFieldName}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, disabled && { color: Colors.SUPER_GREY }]}
              onFocus={handleFocus}
              onBlur={() => {
                handleBlur();
                onBlur();
              }}
              onChangeText={onChange}
              value={value}
              editable={!disabled}
              placeholder="50 123 4567"
              placeholderTextColor={'#7B8D88'}
              keyboardType="phone-pad"
            />
          )}
        />
      </Animated.View>

      {errors[phoneFieldName] && (
        <AppText
          text={errors[phoneFieldName].message as string}
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
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    height: Metrics.verticalScale(54), // Uniform height with Dropdown
    paddingHorizontal: 4,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: '100%',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 2,
  },
  countryPickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: '#1A332C',
    fontSize: Metrics.generatedFontSize(14),
    fontWeight: '600',
    paddingVertical: 0,
    flex: 1,
    paddingLeft: 10,
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
    marginLeft: 4,
  },
});

export default PhoneInputField;
