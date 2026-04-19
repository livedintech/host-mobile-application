import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import { Controller, Control, FieldErrors, RegisterOptions } from 'react-hook-form';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

interface TextareaFieldProps extends TextInputProps {
  name: string;
  control: Control<any, any>;
  errors: FieldErrors;
  label?: string;
  leftIcon?: React.ReactNode;
  wrapperStyle?: object;
  descriptionLength?: number;
  wordLimit?: number;
  sparkleIcon?: boolean;
  rules?: RegisterOptions;
  height?: number; // ✅ added
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  name,
  control,
  errors,
  label,
  leftIcon,
  wrapperStyle,
  style,
  multiline,
  descriptionLength,
  wordLimit,
  sparkleIcon,
  rules,
  height, // ✅ added
  ...props
}) => {
  const error = errors[name]?.message as string;

  return (
    <View style={[styles.mainWrapper, wrapperStyle]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        {label && (
          <AppText text={label} style={styles.label} fontSize={14} type="Medium" />
        )}
      </View>

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          multiline && {
            height: height ?? Metrics.verticalScale(160), // ✅ default + override
            alignItems: 'flex-start',
          },
          !!error && styles.errorBorder,
        ]}
      >
        {leftIcon && (
          <View style={[styles.iconWrapper, multiline && styles.multilineIcon]}>
            {leftIcon}
          </View>
        )}

        <Controller
          control={control}
          rules={rules}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                style,
                multiline && styles.multilineInput,
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              multiline={multiline}
              selectionColor={Colors.BOTTLE_GREEN}
              {...props}
            />
          )}
        />
      </View>

      {/* Bottom Row */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: Metrics.verticalScale(error ? 0 : 10),
          gap: 3,
        }}
      >
        {wordLimit !== undefined && (
          <AppText
            text={`${descriptionLength || 0}/${wordLimit} Words`}
            fontSize={11}
            color={Colors.DARK_CHARCOAL}
          />
        )}

        {sparkleIcon && (
          <View style={styles.sparkleIcon}>
            <Svgicons path="sparkleIcon" size={18} />
          </View>
        )}
      </View>

      {/* Error */}
      {error && (
        <AppText text={error} color={Colors.INDIAN_RED} style={styles.errorText} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    marginBottom: Metrics.verticalScale(16),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(8),
  },
  label: {
    color: Colors.BLACK,
    fontSize: Metrics.generatedFontSize(14),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    minHeight: Metrics.verticalScale(56),
    overflow: 'hidden',
  },
  multilineContainer: {
    height: Metrics.verticalScale(160), // default height
    alignItems: 'flex-start',
  },
  iconWrapper: {
    paddingLeft: Metrics.scale(16),
    marginRight: Metrics.scale(8),
  },
  multilineIcon: {
    marginTop: Metrics.verticalScale(16),
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: Metrics.scale(16),
    color: Colors.PINE_FOREST,
    fontSize: 15,
    paddingVertical: 0,
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top',
    paddingTop:
      Platform.OS === 'ios'
        ? Metrics.verticalScale(16)
        : Metrics.verticalScale(12),
    paddingBottom: Metrics.verticalScale(16),
  },
  errorBorder: {
    borderColor: Colors.INDIAN_RED,
  },
  errorText: {
    marginTop: Metrics.verticalScale(4),
    fontSize: 12,
    color: Colors.INDIAN_RED,
    paddingLeft: 4,
  },
  sparkleIcon: {},
});

export default TextareaField;