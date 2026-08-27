import React, { useCallback, useRef, useState } from 'react';
import { Animated, I18nManager, StyleSheet, TextInput, View } from 'react-native';
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import AppText from '../AppText/AppText';
import ButtonView from '../AppButton/ButtonView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

export interface CountryValue {
  cca2: CountryCode;
  callingCode: string;
}

interface PhoneInputFieldProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  label?: string;
  countryFieldName: Path<T>;
  phoneFieldName: Path<T>;
  activeColor?: string;
  disabled?: boolean;
}

const GLASS_BASE        = 'rgba(255, 255, 255, 0.25)';
const GLASS_RIM         = 'rgba(255, 255, 255, 0.6)';
const TEXT_COLOR        = '#000000';
const PLACEHOLDER_COLOR = '#7B8D88';
const DEFAULT_COUNTRY: CountryCode = 'AE';

// ─── Country Selector ────────────────────────────────────────────────────────

interface CountrySelectorProps {
  value: CountryValue | undefined;
  onChange: (v: CountryValue) => void;
  disabled: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ value, onChange, disabled }) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleSelect = useCallback(
    (country: Country) => {
      onChange({ cca2: country.cca2, callingCode: country.callingCode[0] ?? '' });
      setPickerVisible(false);
    },
    [onChange],
  );

  const openPicker  = useCallback(() => { if (!disabled) setPickerVisible(true); }, [disabled]);
  const closePicker = useCallback(() => setPickerVisible(false), []);

  return (
    <View style={styles.pickerWrapper}>
      <ButtonView
        onPress={openPicker}
        style={styles.pickerButton}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <CountryPicker
          withFlag
          withFilter
          withCallingCode
          countryCode={value?.cca2 ?? DEFAULT_COUNTRY}
          onSelect={handleSelect}
          visible={!disabled && pickerVisible}
          onClose={closePicker}
          theme={{ fontSize: 14, fontFamily: 'System', backgroundColor: Colors.WHITE }}
        />
        <AppText
          text={value?.callingCode ? `+${value.callingCode}` : ''}
          color={disabled ? Colors.SUPER_GREY : TEXT_COLOR}
          type="SemiBold"
          fontSize={14}
        />
        {!disabled && (
          <View style={styles.chevron}>
            <Svgicons path="ChevronDownIcon" size={10} />
          </View>
        )}
      </ButtonView>
      <View style={styles.divider} />
    </View>
  );
};

// ─── Phone Input ─────────────────────────────────────────────────────────────

interface PhoneInputProps {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, onBlur, onFocus, disabled }) => {
  const textAlign = I18nManager.isRTL ? 'right' : 'left';

  if (disabled) {
    return (
      <AppText
        text={value}
        textAlign={textAlign}
        style={[styles.disabledText, styles.ltrText]}
        color={TEXT_COLOR}
        fontSize={14}
        type="SemiBold"
      />
    );
  }

  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={[styles.input, styles.ltrText, { textAlign }]}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        placeholder="050 111111"
        placeholderTextColor={PLACEHOLDER_COLOR}
        keyboardType="phone-pad"
      />
    </View>
  );
};

// ─── PhoneInputField ──────────────────────────────────────────────────────────

function PhoneInputField<T extends FieldValues>({
  control,
  errors,
  label,
  countryFieldName,
  phoneFieldName,
  activeColor = Colors.PINE_FOREST,
  disabled = false,
}: PhoneInputFieldProps<T>) {
  const animation = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    Animated.timing(animation, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  }, [animation]);

  const handleBlur = useCallback(() => {
    Animated.timing(animation, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  }, [animation]);

  const animatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [GLASS_RIM, activeColor],
  });

  const hasError = !!errors[phoneFieldName];

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
            borderColor: hasError ? Colors.INDIAN_RED : animatedBorderColor,
            backgroundColor: disabled ? 'rgba(255, 255, 255, 0.1)' : GLASS_BASE,
          },
        ]}
      >
        <Controller
          control={control}
          name={countryFieldName}
          render={({ field: { onChange, value } }) => (
            <CountrySelector
              value={value as CountryValue | undefined}
              onChange={onChange}
              disabled={disabled}
            />
          )}
        />

        <Controller
          control={control}
          name={phoneFieldName}
          render={({ field: { onChange, onBlur, value } }) => (
            <PhoneInput
              value={value ?? ''}
              onChange={onChange}
              onBlur={() => { handleBlur(); onBlur(); }}
              onFocus={handleFocus}
              disabled={disabled}
            />
          )}
        />
      </Animated.View>

      {hasError && (
        <AppText
          text={errors[phoneFieldName]?.message as string}
          color={Colors.INDIAN_RED}
          style={styles.errorText}
        />
      )}
    </View>
  );
}

export default PhoneInputField;

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    height: Metrics.verticalScale(54),
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
  chevron: {
    marginStart: 4,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 2,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  disabledText: {
    paddingHorizontal: 10,
  },
  ltrText: {
    writingDirection: 'ltr',
  },
  input: {
    color: TEXT_COLOR,
    fontSize: Metrics.generatedFontSize(14),
    fontWeight: '600',
    paddingVertical: 0,
    flex: 1,
    paddingHorizontal: 10,
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
    marginStart: 4,
  },
});
